type SidebarProps = {
  onAdd: (kind: "text" | "image" | "llm" | "llmPrompt") => void;
};

/**
 * Fixed left sidebar to add basic nodes to the canvas.
 * Keeps choices minimal and intent-driven per scope.
 */
export default function Sidebar({ onAdd }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 z-10 h-screen w-60 border-r border-zinc-800 bg-[#0f0f13] px-4 py-6">
      <div className="mb-4 select-none font-sans text-sm font-semibold text-zinc-200">
        Add Node
      </div>
      <div className="flex flex-col gap-3">
        <button
          onClick={() => onAdd("text")}
          className="rounded-md border border-zinc-700 bg-[#212126] px-3 py-2 text-left text-sm text-zinc-200 shadow-sm hover:bg-[#26262b]"
        >
          Text
        </button>
        <button
          onClick={() => onAdd("image")}
          className="rounded-md border border-zinc-700 bg-[#212126] px-3 py-2 text-left text-sm text-zinc-200 shadow-sm hover:bg-[#26262b]"
        >
          Image
        </button>
        <button
          onClick={() => onAdd("llm")}
          className="rounded-md border border-zinc-700 bg-[#212126] px-3 py-2 text-left text-sm text-zinc-200 shadow-sm hover:bg-[#26262b]"
        >
          LLM
        </button>
      </div>
    </aside>
  );
}


