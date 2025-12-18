"use client";

import { useState } from "react";
import { useReactFlow } from "@xyflow/react";
import type { ReactNode } from "react";
import { MousePointer2, Hand, Undo2, Redo2 } from "lucide-react";

type Props = {
  locked: boolean;
  setLocked: (v: boolean) => void;
  panMode: boolean;
  setPanMode: (v: boolean) => void;
  zoomPercent: number;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
};

function Button({
  children,
  onClick,
  disabled,
  active,
  ariaLabel,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className={`rounded-md border px-2 py-1 text-sm shadow-sm ${
        active
          ? "bg-[#F7FFA8] text-[#0f0f13] border-[#F7FFA8] hover:bg-[#F7FFA8]"
          : "bg-[#212126] text-[#e8edf0] border-[#353539] hover:bg-[#26262b]"
      } ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
    >
      {children}
    </button>
  );
}

export default function CanvasControls({
  locked,
  setLocked,
  panMode,
  setPanMode,
  zoomPercent,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: Props) {
  const [zoomMenuOpen, setZoomMenuOpen] = useState(false);
  const rf = useReactFlow();

  const zoomIn = () => {
    const vp = rf.getViewport();
    rf.setViewport({ ...vp, zoom: Math.min(2, (vp.zoom ?? 1) + 0.1) });
  };
  const zoomOut = () => {
    const vp = rf.getViewport();
    rf.setViewport({ ...vp, zoom: Math.max(0.2, (vp.zoom ?? 1) - 0.1) });
  };
  const fit = () => {
    rf.fitView({ padding: 0.2, includeHiddenNodes: false });
  };

  return (
    <div className="pointer-events-auto absolute bottom-3 left-1/2 z-20 -translate-x-1/2">
      <div className="flex items-center gap-2 rounded-full border border-[#353539] bg-[#212126]/95 px-2 py-1 shadow-lg backdrop-blur">
        {/* Lock / Unlock */}
        <Button
          onClick={() => {
            setLocked(true);
            setPanMode(false);
          }}
          ariaLabel={locked ? "Unlock canvas" : "Lock canvas"}
          active={locked}
        >
          <MousePointer2 size={16} />
        </Button>

        {/* Pan / Move mode */}
        <Button
          onClick={() => {
            setPanMode(true);
            setLocked(false);
          }}
          ariaLabel="Toggle pan mode"
          active={panMode}
        >
          <Hand size={16} />
        </Button>

        {/* Undo / Redo */}
        <Button onClick={onUndo} ariaLabel="Undo" disabled={!canUndo}>
          <Undo2 size={16} />
        </Button>
        <Button onClick={onRedo} ariaLabel="Redo" disabled={!canRedo}>
          <Redo2 size={16} />
        </Button>

        {/* Zoom indicator + menu */}
        <div className="relative">
          <Button onClick={() => setZoomMenuOpen((o) => !o)} ariaLabel="Zoom menu">
            {zoomPercent}%
          </Button>
          {zoomMenuOpen && (
            <div className="absolute bottom-9 left-1/2 z-30 w-40 -translate-x-1/2 rounded-md border border-[#353539] bg-[#212126] p-1 shadow-md">
              <button
                className="block w-full rounded p-2 text-left text-sm text-[#e8edf0] hover:bg-[#26262b]"
                onClick={() => {
                  zoomIn();
                  setZoomMenuOpen(false);
                }}
              >
                Zoom in
              </button>
              <button
                className="block w-full rounded p-2 text-left text-sm text-[#e8edf0] hover:bg-[#26262b]"
                onClick={() => {
                  zoomOut();
                  setZoomMenuOpen(false);
                }}
              >
                Zoom out
              </button>
              <button
                className="block w-full rounded p-2 text-left text-sm text-[#e8edf0] hover:bg-[#26262b]"
                onClick={() => {
                  fit();
                  setZoomMenuOpen(false);
                }}
              >
                Zoom to fit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


