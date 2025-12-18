import type { ReactNode } from "react";

type ActionCardProps = {
  icon: ReactNode;
  label: string;
  disabled?: boolean;
  onClick?: () => void;
  dragKind?: "text" | "image" | "llm";
  className?: string;
};

/**
 * Sidebar action card: full-click surface, centered icon and label.
 * Designed for the dark sidebar palette.
 */
export default function ActionCard({
  icon,
  label,
  disabled,
  onClick,
  dragKind,
  className,
}: ActionCardProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      draggable={!!dragKind}
      onDragStart={(e) => {
        if (!dragKind) return;
        e.dataTransfer.setData("application/reactflow", dragKind);
        e.dataTransfer.effectAllowed = "move";
      }}
      className={`group w-full min-h-[84px] rounded-lg border border-[#353539] bg-[#212126] p-3 text-left transition-colors hover:bg-[#26262b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F7FFA8]/50 disabled:cursor-not-allowed disabled:opacity-50 ${className ?? ""}`}
    >
      <div className="flex h-full w-full flex-col items-center justify-center gap-2">
        <div className="text-[#e8edf0] opacity-90">{icon}</div>
        <div className="text-center text-xs font-medium text-[#e8edf0]">{label}</div>
      </div>
    </button>
  );
}


