import cn from "@/utils/cn";
import React from "react";

export default function AnimatedBorder({
  className,
  strokeColor = "stroke-blue-500",
  strokeWidth = 5,
  dashArray = "15 15 15 15",
  animationDuration = 20,
  borderRadius = 10,
}: {
  className?: string;
  strokeColor?: string;
  strokeWidth?: number;
  dashArray?: string;
  animationDuration?: number;
  borderRadius?: number;
}) {
  return (
    <svg
      className={cn(
        "absolute inset-0 w-full h-full pointer-events-none",
        className
      )}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x={strokeWidth / 2}
        y={strokeWidth / 2}
        width={`calc(100% - ${strokeWidth}px)`}
        height={`calc(100% - ${strokeWidth}px)`}
        fill="none"
        className={cn("animate-dash", strokeColor)}
        strokeWidth={strokeWidth}
        strokeDasharray={dashArray}
        strokeLinecap="round"
        rx={borderRadius}
        ry={borderRadius}
        style={
          {
            "--animation-duration": `${animationDuration}s`,
          } as React.CSSProperties
        }
      />
    </svg>
  );
}
