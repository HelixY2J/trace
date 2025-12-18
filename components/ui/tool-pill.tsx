"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ToolPillProps = {
  label: string;
  className?: string;
};

export function ToolPill({ label, className }: ToolPillProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-[#353539] bg-[#212126] px-4 py-2 font-sans text-[13px] text-[#e8edf0] shadow-[0_6px_24px_rgba(0,0,0,0.25)]",
        className
      )}
    >
      {label}
    </div>
  );
}


