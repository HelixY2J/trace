import { Handle, Position, type NodeProps, useReactFlow } from "@xyflow/react";

export type TextNodeData = {
  kind?: "Text";
  text?: string;
  fromLLMText?: string;
};

/**
 * TextNode: simple textarea with a single output handle.
 * Updates its own data in the React Flow state.
 */
export default function TextNode({ id, data, selected }: NodeProps) {
  const rf = useReactFlow();
  const d = (data as TextNodeData) || {};

  const update = (partial: Partial<TextNodeData>) => {
    rf.setNodes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, data: { ...(n.data || {}), ...partial } } : n)),
    );
  };

  return (
    <div className={`relative min-w-[260px] max-w-[360px] rounded-md border bg-[#212126] text-zinc-100 shadow-sm ${selected ? "border-pink-400 ring-1 ring-pink-400/40" : "border-zinc-700"}`}>
      <div className="px-3 pt-2 text-xs font-medium tracking-wide text-zinc-300">
        {"Prompt"}
      </div>
      <div className="mx-3 mb-3 mt-2 rounded-md border border-zinc-700 bg-[#353539] p-2">
        <textarea
          value={d.text ?? ""}
          onChange={(e) => update({ text: e.target.value, kind: "Text" })}
          placeholder="Enter text..."
          className="h-24 w-full resize-none bg-transparent text-[13px] text-zinc-100 outline-none placeholder:text-zinc-500"
        />
      </div>
      {/* Display downstream LLM output if present */}
      {d.fromLLMText && (
        <div className="mx-3 mb-3 rounded-md border border-zinc-700 bg-[#2a2a2f] p-2 text-[12px] text-zinc-200">
          {d.fromLLMText}
        </div>
      )}
      {/* Left target (to receive from LLM), Right source (to forward downstream) */}
      <Handle type="target" position={Position.Left} className="!bg-[#22c55e]" />
      <Handle type="source" position={Position.Right} className="!bg-[#22c55e]" />
    </div>
  );
}


