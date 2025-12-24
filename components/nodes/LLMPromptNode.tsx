import { Handle, Position, type NodeProps, useReactFlow, useStore } from "@xyflow/react";

export type LLMPromptNodeData = {
  kind?: "LLMPrompt";
  model?: string;
  outputText?: string;
  loading?: boolean;
  error?: string;
};

export default function LLMPromptNode({ id, data, selected }: NodeProps) {
  const rf = useReactFlow();
  const edges = useStore((s) => s.edges);
  const d = (data as LLMPromptNodeData) || {};

  const update = (partial: Partial<LLMPromptNodeData>) => {
    rf.setNodes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, data: { ...(n.data || {}), ...partial } } : n)),
    );
  };

  const validTextIn = edges.some((e) => {
    if (e.target !== id) return false;
    const th = (e as any).targetHandle || "";
    if (th !== "in:text") return false;
    const s = e.source ? rf.getNode(e.source) : undefined;
    const sh = (e as any).sourceHandle || "";
    return (s?.type === "text" && sh === "out:text") || (s?.type === "llm" && sh === "out:text") || (s?.type === "llmprompt" && sh === "out:text");
  });
  const invalidTextIn = edges.some((e) => {
    if (e.target !== id) return false;
    const th = (e as any).targetHandle || "";
    if (th !== "in:text") return false;
    const s = e.source ? rf.getNode(e.source) : undefined;
    const sh = (e as any).sourceHandle || "";
    return !((s?.type === "text" && sh === "out:text") || (s?.type === "llm" && sh === "out:text") || (s?.type === "llmprompt" && sh === "out:text"));
  });
  const validImageIn = edges.some((e) => {
    if (e.target !== id) return false;
    const th = (e as any).targetHandle || "";
    if (th !== "in:image") return false;
    const s = e.source ? rf.getNode(e.source) : undefined;
    const sh = (e as any).sourceHandle || "";
    return (s?.type === "image" && sh === "out:image") || (s?.type === "llm" && sh === "out:image");
  });
  const invalidImageIn = edges.some((e) => {
    if (e.target !== id) return false;
    const th = (e as any).targetHandle || "";
    if (th !== "in:image") return false;
    const s = e.source ? rf.getNode(e.source) : undefined;
    const sh = (e as any).sourceHandle || "";
    return !((s?.type === "image" && sh === "out:image") || (s?.type === "llm" && sh === "out:image"));
  });
  const hasAnyValidConn = validTextIn || validImageIn;
  const textInClass = `typed-handle typed-handle--text${invalidTextIn ? " typed-handle--invalid" : ""}`;
  const imageInClass = `typed-handle typed-handle--image${invalidImageIn ? " typed-handle--invalid" : ""}`;
  const textInTitle = invalidTextIn ? "Wrong input type" : (!hasAnyValidConn ? "Required Input" : undefined);
  const imageInTitle = invalidImageIn ? "Wrong input type" : (!hasAnyValidConn ? "Required Input" : undefined);
  const hasInvalidInputs = invalidTextIn || invalidImageIn || !hasAnyValidConn;

  const collectUpstreamInputs = () => {
    const allEdges = rf.getEdges();
    const nodes = rf.getNodes();
    const idToNode = new Map(nodes.map((n) => [n.id, n]));

    const visited = new Set<string>();
    const queue: string[] = [id];
    const upstreamIds: Set<string> = new Set();

    while (queue.length) {
      const current = queue.shift()!;
      if (visited.has(current)) continue;
      visited.add(current);
      const incoming = allEdges.filter((e) => e.target === current);
      for (const e of incoming) {
        upstreamIds.add(e.source);
        queue.push(e.source);
      }
    }

    const inputs = {
      texts: [] as string[],
      images: [] as string[],
      llmImages: [] as string[],
    };

    for (const upId of upstreamIds) {
      const n = idToNode.get(upId);
      if (!n) continue;
      const k = (n.data as any)?.kind;
      if (k === "Text") {
        const t = (n.data as any)?.text;
        if (t) inputs.texts.push(String(t));
      } else if (k === "Image") {
        const src = (n.data as any)?.src;
        if (src) inputs.images.push(String(src));
      } else if (k === "LLM") {
        const outSrc = (n.data as any)?.imageSrc;
        if (outSrc) inputs.llmImages.push(String(outSrc));
      } else if (k === "LLMPrompt") {
        const t = (n.data as any)?.outputText;
        if (t) inputs.texts.push(String(t));
      }
    }

    return inputs;
  };

  const runModel = () => {
    const inputsCollected = collectUpstreamInputs();
    const upstreamText = inputsCollected.texts.join("\n\n").trim();
    const prompt = upstreamText || "Generate output from inputs.";

    const inputs: Array<{ type: "text" | "image"; content: string }> = [];
    for (const t of inputsCollected.texts) inputs.push({ type: "text", content: t });
    for (const src of inputsCollected.images) inputs.push({ type: "image", content: src });
    for (const src of inputsCollected.llmImages) inputs.push({ type: "image", content: src });

    if (!inputs.length) {
      update({ error: "Required Input", loading: false });
      return;
    }

    update({ loading: true, error: undefined });

    (async () => {
      try {
        const res = await fetch("/api/gemini-model", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, inputs }),
        });

        const data = (await res.json()) as
          | { output: string; usedInputs: number; image?: string }
          | { error: { code: string; message: string } };

        if (!res.ok || "error" in data) {
          const friendly =
            res.status === 429 || ("error" in data && /NOT_FOUND|UNAVAILABLE|429/i.test(data.error.message))
              ? "The selected model is unavailable right now. Please try again later or choose another model."
              : "We couldn’t run this model. Please try again.";
          update({ error: friendly, loading: false, outputText: "Mocked LLM output" });
          return;
        }

        update({
          outputText: data.output,
          loading: false,
          error: undefined,
        });

        const allEdges = rf.getEdges();
        const downstreamTextIds = allEdges
          .filter((e) => e.source === id)
          .map((e) => e.target);
        rf.setNodes((prev) =>
          prev.map((n) => {
            if (downstreamTextIds.includes(n.id) && n.type === "text") {
              return {
                ...n,
                data: { ...(n.data as any), fromLLMText: data.output },
              };
            }
            return n;
          })
        );
      } catch (_err: any) {
        update({
          error: "Something went wrong while running the model. Please try again.",
          loading: false,
          outputText: "Mocked LLM output",
        });
      }
    })();
  };

  return (
    <div className={`relative min-w-[320px] max-w-[420px] rounded-md border bg-[#212126] text-zinc-100 shadow-sm ${selected ? "border-green-400 ring-1 ring-green-400/40" : "border-zinc-700"}`}>
      <div className="flex items-center justify-between px-3 py-2">
        <div className="text-xs font-medium tracking-wide text-zinc-300">
          {"Run LLM"}
        </div>
      </div>
      <div className="mx-3 mb-3 rounded-md border border-zinc-700 bg-[#2a2a2f] p-2">
        <textarea
          readOnly
          value={d.outputText ?? ""}
          placeholder="Output will appear here…"
          className="h-28 w-full resize-none bg-transparent text-[13px] text-zinc-100 outline-none placeholder:text-zinc-500"
        />
      </div>
      <div className="flex items-center justify-end px-3 py-2">
        <button
          type="button"
          className="rounded-md border border-zinc-700 bg-[#2a2a2f] px-3 py-1.5 text-xs font-medium text-[#e8edf0] hover:bg-[#26262b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F7FFA8]/30 disabled:opacity-50"
          disabled={!!d.loading || hasInvalidInputs}
          onClick={runModel}
        >
          {d.loading ? "Running..." : "Run LLM"}
        </button>
      </div>

      <Handle type="target" id="in:text" position={Position.Left} className={textInClass} title={textInTitle} style={{ top: 96 }} />
      <Handle type="target" id="in:image" position={Position.Left} className={imageInClass} title={imageInTitle} style={{ top: 144 }} />
      <Handle type="source" id="out:text" position={Position.Right} className="typed-handle typed-handle--text" />
    </div>
  );
}


