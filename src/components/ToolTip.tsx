"use client";

import cn from "@/utils/cn";
import React, { useState, useEffect, useRef, ReactNode } from "react";
import { createPortal } from "react-dom";

function TooltipComponent({
  isVisible,
  triggerRect,
  children,
  className,
}: {
  isVisible: boolean;
  triggerRect: DOMRect | null;
  children?: ReactNode;
  className?: string;
}) {
  if (!triggerRect) return null;

  return (
    <div
      className={cn(
        "fixed bg-black bg-opacity-80 text-white px-2.5 py-1.5 rounded text-xs z-50 flex flex-col gap-1",
        className
      )}
      style={{
        top: `${triggerRect.bottom + window.scrollY + 5}px`,
        left: `${triggerRect.left + triggerRect.width / 2}px`,
        transform: "translateX(-50%)",
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.2s ease-in-out",
        pointerEvents: isVisible ? "auto" : "none",
      }}
    >
      {children}
    </div>
  );
}

function TooltipPortal({
  isVisible,
  triggerRect,
  children,
  classNmae,
}: {
  isVisible: boolean;
  triggerRect: DOMRect | null;
  children?: ReactNode;
  classNmae?: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <TooltipComponent
      isVisible={isVisible}
      triggerRect={triggerRect}
      className={classNmae}
    >
      {children}
    </TooltipComponent>,
    document.body
  );
}

export default function useTooltip<T extends HTMLElement>(props?: {
  delay?: number;
}) {
  const { delay = 500 } = props || {};
  const [isVisible, setIsVisible] = useState(false);
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);
  const triggerRef = useRef<T>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateTriggerRect = () => {
    if (triggerRef.current) {
      setTriggerRect(triggerRef.current.getBoundingClientRect());
    }
  };

  const handleMouseEnter = () => {
    updateTriggerRect();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
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

      window.addEventListener("resize", updateTriggerRect);
      window.addEventListener("scroll", updateTriggerRect);

      return () => {
        triggerElement.removeEventListener("mouseenter", handleMouseEnter);
        triggerElement.removeEventListener("mouseleave", handleMouseLeave);
        window.removeEventListener("resize", updateTriggerRect);
        window.removeEventListener("scroll", updateTriggerRect);
      };
    }
  }, [delay]);

  const Tooltip = ({
    children,
    className,
  }: {
    children?: ReactNode;
    className?: string;
  }) => (
    <TooltipPortal
      isVisible={isVisible}
      triggerRect={triggerRect}
      classNmae={className}
    >
      {children}
    </TooltipPortal>
  );

  return {
    triggerRef,
    Tooltip,
  };
}
