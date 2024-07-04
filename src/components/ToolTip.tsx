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

function TooltipPortal({
  isVisible,
  position,
  content,
}: {
  isVisible: boolean;
  position: { x: number; y: number };
  content: string[];
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <TooltipComponent
      isVisible={isVisible}
      position={position}
      content={content}
    />,
    document.body
  );
}

function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): T {
  let inThrottle: boolean;
  return function (this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  } as T;
}

export default function useTooltip<T extends HTMLElement>({
  content,
  delay = 500,
}: UseTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<T>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const isHoveringRef = useRef(false);

  const lines = useMemo(() => content.split("\n"), [content]);

  const throttledSetPosition = useMemo(
    () =>
      throttle((x: number, y: number) => {
        setPosition({ x, y });
      }, 16), // ~60fps
    []
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isHoveringRef.current) {
        const offset = 15; // Distance from cursor
        throttledSetPosition(e.clientX + offset, e.clientY + offset);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [throttledSetPosition]);

  const handleMouseEnter = () => {
    isHoveringRef.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    isHoveringRef.current = false;
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

  const Tooltip = () => (
    <TooltipPortal isVisible={isVisible} position={position} content={lines} />
  );

  return {
    triggerRef,
    Tooltip,
  };
}
