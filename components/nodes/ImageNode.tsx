import { Handle, Position, type NodeProps, useReactFlow } from "@xyflow/react";
import { useCallback } from "react";

export type ImageNodeData = {
  kind?: "Image";
  src?: string;
  name?: string;
};

/**
 * ImageNode: file input + preview, single output handle.
 * Stores preview as a data URL in node data.
 */
export default function ImageNode({ id, data, selected }: NodeProps) {
  const rf = useReactFlow();
  const d = (data as ImageNodeData) || {};

  const update = (partial: Partial<ImageNodeData>) => {
    rf.setNodes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, data: { ...(n.data || {}), ...partial } } : n)),
    );
  };

  const onSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      update({ src: String(reader.result), name: file.name, kind: "Image" });
    };
    reader.readAsDataURL(file);
  }, []);

  return (
    <div className={`relative min-w-[260px] max-w-[360px] rounded-md border bg-[#212126] text-zinc-100 shadow-sm ${selected ? "border-green-400 ring-1 ring-green-400/40" : "border-zinc-700"}`}>
      <div className="px-3 pt-2 text-xs font-medium tracking-wide text-zinc-300">
        {"Image"}
      </div>
      <div className="mx-3 mb-3 mt-2 rounded-md border border-zinc-700 bg-[#353539] p-2">
        {!d.src ? (
          <label className="flex h-64 cursor-pointer items-center justify-center rounded-md border border-dashed border-zinc-600 bg-[#2a2a2f] text-[13px] text-zinc-300 hover:bg-[#303035]">
            <input type="file" accept="image/*" className="hidden" onChange={onSelect} />
            Upload image
          </label>
        ) : (
          <div className="flex flex-col gap-2">
            <img
              src={d.src}
              alt={d.name ?? "uploaded"}
              className="h-64 w-full rounded-md object-contain bg-[#2a2a2f]"
            />
            <div className="truncate text-[12px] text-zinc-400">{d.name}</div>
          </div>
        )}
      </div>
      <Handle type="source" id="out:image" position={Position.Right} className="typed-handle typed-handle--image" />
    </div>
  );
}


