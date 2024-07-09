import cn from "@/utils/cn";
import React, { useRef, useState, useEffect, MouseEventHandler } from "react";

interface Position {
  x: number;
  y: number;
}

export default function MagneticButton({
  className,
  onClick,
  children,
  disabled,
  tabIndex,
}: {
  className?: string;
  children: React.ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  tabIndex?: number;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [resetTimeout, setResetTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (ref.current) {
      const { clientX, clientY } = e;
      const { height, width, left, top } = ref.current.getBoundingClientRect();
      const middleX = clientX - (left + width / 2);
      const middleY = clientY - (top + height / 2);
      setPosition({ x: middleX * 0.2, y: middleY * 0.6 });
    }
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  useEffect(() => {
    const button = ref.current;
    if (button) {
      button.style.transform = `translate(${position.x}px, ${position.y}px)`;
    }
  }, [position]);

  return (
    <button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      onMouseDown={() => {
        if (resetTimeout) {
          clearTimeout(resetTimeout);
        }
        setResetTimeout(setTimeout(reset, 200));
      }}
      className={cn(
        "relative rounded-xl bg-red-500 px-6 py-2 text-sm font-medium text-white transition-transform duration-150 ease-out",
        className
      )}
      style={{ willChange: "transform" }}
      disabled={disabled}
      tabIndex={tabIndex}
    >
      {children}
    </button>
  );
}
