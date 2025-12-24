import { Handle, Position, type NodeProps, useReactFlow, useStore } from "@xyflow/react";

export type LLMNodeData = {
  kind?: "LLM";
  model?: string; // Display name in header
  imageSrc?: string; // Optional preview image
  outputText?: string; // Last textual output from API
  loading?: boolean;
  error?: string;
  prompt?: string; // Optional local prompt specific to this node
};

/**
 * LLMNode: header with model name, large preview area, and footer action.
 * Keeps dark theme and green handles.
 */
export default function LLMNode({ id, data, selected }: NodeProps) {
  const rf = useReactFlow();
  const d = (data as LLMNodeData) || {};

  const update = (partial: Partial<LLMNodeData>) => {
    rf.setNodes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, data: { ...(n.data || {}), ...partial } } : n)),
    );
  };

  const edges = useStore((s) => s.edges);
  const invalidTextIn = edges.some((e) => {
    if (e.target !== id) return false;
    const th = (e as any).targetHandle || "";
    if (th !== "in:text") return false;
    const s = e.source ? rf.getNode(e.source) : undefined;
    const sh = (e as any).sourceHandle || "";
    return !(s?.type === "text" && sh === "out:text");
  });
  const invalidImageIn = edges.some((e) => {
    if (e.target !== id) return false;
    const th = (e as any).targetHandle || "";
    if (th !== "in:image") return false;
    const s = e.source ? rf.getNode(e.source) : undefined;
    const sh = (e as any).sourceHandle || "";
    return !(s?.type === "image" && sh === "out:image");
  });
  const textInClass = `typed-handle typed-handle--text${invalidTextIn ? " typed-handle--invalid" : ""}`;
  const imageInClass = `typed-handle typed-handle--image${invalidImageIn ? " typed-handle--invalid" : ""}`;
  const textInTitle = invalidTextIn ? "Wrong input type" : undefined;
  const imageInTitle = invalidImageIn ? "Wrong input type" : undefined;
  const hasInvalidInputs = invalidTextIn || invalidImageIn;

  /**
   * Traverse upstream nodes and collect inputs from Text/Image/LLM nodes.
   * This does not execute any downstream nodes.
   */
  const collectUpstreamInputs = () => {
    const edges = rf.getEdges();
    const nodes = rf.getNodes();
    const idToNode = new Map(nodes.map((n) => [n.id, n]));

    const visited = new Set<string>();
    const queue: string[] = [id];
    const upstreamIds: Set<string> = new Set();

    while (queue.length) {
      const current = queue.shift()!;
      if (visited.has(current)) continue;
      visited.add(current);

      // Find incoming edges -> sources are upstream
      const incoming = edges.filter((e) => e.target === current);
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
      }
    }

    return inputs;
  };

  const runModel = () => {
    const inputsCollected = collectUpstreamInputs();
    // Combine local prompt (optional) with upstream texts
    const localPrompt = (d.prompt ?? "").trim();
    const upstreamText = inputsCollected.texts.join("\n\n").trim();
    const combinedPieces: string[] = [];
    if (localPrompt) combinedPieces.push(localPrompt);
    if (upstreamText) combinedPieces.push(upstreamText);
    const prompt =
      combinedPieces.join("\n\n").trim() ||
      (d.model ? `Run ${d.model} with provided inputs.` : "Run model with provided inputs.");

    const inputs: Array<{ type: "text" | "image"; content: string }> = [];
    for (const t of inputsCollected.texts) inputs.push({ type: "text", content: t });
    for (const src of inputsCollected.images) inputs.push({ type: "image", content: src });
    for (const src of inputsCollected.llmImages) inputs.push({ type: "image", content: src });

    // Set loading state
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
          // Graceful, user-friendly error (hide raw provider messages)
          const friendly =
            res.status === 429 || ("error" in data && /NOT_FOUND|UNAVAILABLE|429/i.test(data.error.message))
              ? "The selected model is unavailable right now. Please try again later or choose another model."
              : "We couldn’t run this model. Please try again.";
          // Fallback: keep prior image (if any) and set a friendly error + mocked text
          update({ error: friendly, loading: false, outputText: "Mocked LLM output" });
          return;
        }

        // Success: store text output and optional image from API
        // If API returned an image, use it; otherwise clear any previous image
        const nextImage = ("image" in data && data.image) ? data.image : undefined;
        update({
          outputText: data.output,
          imageSrc: nextImage,
          loading: false,
          error: undefined,
        });

        // Propagate text output only to direct downstream Text nodes
        const edges = rf.getEdges();
        const downstreamTextIds = edges
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
          // Generic message for unexpected failures
          error: "Something went wrong while running the model. Please try again.",
          loading: false,
          outputText: "Mocked LLM output",
        });
      }
    })();
  };

  return (
    <div className={`relative min-w-[320px] max-w-[420px] rounded-md border bg-[#212126] text-zinc-100 shadow-sm ${selected ? "border-green-400 ring-1 ring-green-400/40" : "border-zinc-700"}`}>
      {/* Header: model name */}
      <div className="flex items-center justify-between px-3 py-2">
        <div className="text-xs font-medium tracking-wide text-zinc-300">
          {d.model ?? "Model"}
        </div>
      </div>
      {/* Optional local prompt editor */}
      <div className="mx-3 mb-2 rounded-md border border-zinc-700 bg-[#353539] p-2">
        <textarea
          value={d.prompt ?? ""}
          onChange={(e) => update({ prompt: e.target.value })}
          placeholder="Enter prompt (optional)..."
          className="h-16 w-full resize-none rounded-md border border-zinc-600 bg-[#2a2a2f] p-2 text-[13px] text-zinc-100 outline-none placeholder:text-zinc-500"
        />
      </div>
      {/* Body: large preview canvas with checkerboard (no inner padding; image fills) */}
      <div className="mx-3 rounded-md border border-zinc-700 bg-[#353539]">
        <div
          className="relative flex h-80 w-full items-center justify-center rounded-md overflow-hidden"
          style={{
            backgroundImage:
              "linear-gradient(45deg, rgba(255,255,255,0.06) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.06) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.06) 75%), linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.06) 75%)",
            backgroundSize: "16px 16px",
            backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
          }}
        >
          {d.imageSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={d.imageSrc}
              alt="preview"
              className="h-full w-full object-contain"
            />
          ) : null}
          {d.loading && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="rounded-md bg-black/30 px-3 py-1 text-[12px] text-zinc-100">
                Running…
              </div>
            </div>
          )}
        </div>
      </div>
      {d.error && (
        <div className="px-3 pt-1 text-[11px] text-red-400">{d.error}</div>
      )}
      {/* Footer: primary action aligned right */}
      <div className="flex items-center justify-end px-3 py-2">
        <button
          type="button"
          className="rounded-md border border-zinc-700 bg-[#2a2a2f] px-3 py-1.5 text-xs font-medium text-[#e8edf0] hover:bg-[#26262b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F7FFA8]/30 disabled:opacity-50"
          disabled={!!d.loading || hasInvalidInputs}
          onClick={runModel}
        >
          {d.loading ? "Running..." : "Run Model"}
        </button>
      </div>

      <Handle type="target" id="in:text" position={Position.Left} className={textInClass} title={textInTitle} style={{ top: 96 }} />
      <Handle type="target" id="in:image" position={Position.Left} className={imageInClass} title={imageInTitle} style={{ top: 144 }} />
      <Handle type="source" id="out:text" position={Position.Right} className="typed-handle typed-handle--text" />
    </div>
  );
}



