"use client";

import React, { ComponentPropsWithoutRef, CSSProperties } from "react";

import { cn } from "@/lib/utils";

interface RippleProps extends ComponentPropsWithoutRef<"div"> {
  mainCircleSize?: number;
  mainCircleOpacity?: number;
  numCircles?: number;
}

export const Ripple = React.memo(function Ripple({
  mainCircleSize = 210,
  mainCircleOpacity = 0.14,
  numCircles = 8,
  className,
  ...props
}: RippleProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 select-none overflow-visible",
        className,
      )}
      {...(props as any)}
    >
      {Array.from({ length: numCircles }, (_, i) => {
        const size = mainCircleSize + i * 70;
        const opacity = mainCircleOpacity - i * 0.03;
        const animationDelay = `${i * 0.06}s`;
        const borderStyle = "solid";

        return (
          <div
            key={i}
            className={`absolute animate-ripple rounded-full border bg-[#e8edf0]/5 shadow-xl`}
            style={
              {
                "--i": i,
                width: `${size}px`,
                height: `${size}px`,
                opacity,
                animationDelay,
                borderStyle,
                borderWidth: "1px",
                borderColor: `rgba(232, 237, 240, 0.18)`,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%) scale(1)",
              } as CSSProperties
            }
          />
        );
      })}
      <style jsx>{`
        @keyframes ripple {
          0% {
            transform: translate(-50%, -50%) scale(0.9);
            opacity: 0.35;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.05);
            opacity: 0.25;
          }
          100% {
            transform: translate(-50%, -50%) scale(0.9);
            opacity: 0.35;
          }
        }
        .animate-ripple {
          animation: ripple 5.5s ease-in-out infinite;
          will-change: transform, opacity;
        }
      `}</style>
    </div>
  );
});

Ripple.displayName = "Ripple";

export type { RippleProps };
