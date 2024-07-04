"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";

interface UseTooltipProps {
  content: string;
  delay?: number;
}

interface TooltipComponentProps {
  isVisible: boolean;
  position: { x: number; y: number };
  content: string[];
}

const TooltipComponent: React.FC<TooltipComponentProps> = ({
  isVisible,
  position,
  content,
}) => (
  <div
    className="fixed bg-black bg-opacity-80 text-white px-2.5 py-1.5 rounded text-xs z-50 pointer-events-none flex flex-col gap-1"
    style={{
      top: `${position.y}px`,
      left: `${position.x}px`,
      opacity: isVisible ? 1 : 0,
    }}
  >
    {content.map((line, index) => (
      <span key={index}>{line}</span>
    ))}
  </div>
);

export default function useTooltip<T extends HTMLElement>({
  content,
  delay = 500,
}: UseTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<T>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const lines = useMemo(() => content.split("\n"), [content]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const offset = 15; // Distance from cursor
      setPosition({
        x: e.clientX + offset,
        y: e.clientY + offset,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  useEffect(() => {
    const triggerElement = triggerRef.current;
    if (triggerElement) {
      triggerElement.addEventListener("mouseenter", handleMouseEnter);
      triggerElement.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        triggerElement.removeEventListener("mouseenter", handleMouseEnter);
        triggerElement.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, [delay]);

  const Tooltip = () =>
    createPortal(
      <TooltipComponent
        isVisible={isVisible}
        position={position}
        content={lines}
      />,
      document.body
    );

  return {
    triggerRef,
    Tooltip,
  };
}
