"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  delay?: number;
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  delay = 500,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const lines = useMemo(() => content.split("\\n"), [content]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (tooltipRef.current) {
        const offset = 15; // Distance from cursor
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        const maxX = window.innerWidth - tooltipRect.width;
        const maxY = window.innerHeight - tooltipRect.height;

        setPosition({
          x: Math.min(e.clientX + offset, maxX),
          y: Math.min(e.clientY + offset, maxY),
        });
      }
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

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      <div
        ref={triggerRef}
        className="inline-block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
      {createPortal(
        <div
          ref={tooltipRef}
          className="fixed bg-black bg-opacity-80 text-white px-2.5 py-1.5 rounded text-xs z-50 pointer-events-none flex flex-col gap-1"
          style={{
            top: `${position.y}px`,
            left: `${position.x}px`,
            opacity: isVisible ? 1 : 0,
          }}
        >
          {lines.map((line, index) => (
            <span key={index}>{line}</span>
          ))}
        </div>,
        document.body
      )}
    </>
  );
};

export default Tooltip;
