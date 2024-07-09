import cn from "@/utils/cn";
import React, {
  forwardRef,
  useRef,
  useState,
  useEffect,
  MouseEventHandler,
  useImperativeHandle,
} from "react";

interface Position {
  x: number;
  y: number;
}

interface MagneticButtonProps {
  className?: string;
  children: React.ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  tabIndex?: number;
}

const MagneticButton = forwardRef<HTMLButtonElement, MagneticButtonProps>(
  ({ className, onClick, children, disabled, tabIndex }, ref) => {
    const innerRef = useRef<HTMLButtonElement>(null);
    const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
    const [resetTimeout, setResetTimeout] = useState<NodeJS.Timeout | null>(
      null
    );

    const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
      const button = innerRef.current;
      if (button) {
        const { clientX, clientY } = e;
        const { height, width, left, top } = button.getBoundingClientRect();
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);
        setPosition({ x: middleX * 0.2, y: middleY * 0.6 });
      }
    };

    const reset = () => {
      setPosition({ x: 0, y: 0 });
    };

    useEffect(() => {
      const button = innerRef.current;
      if (button) {
        button.style.transform = `translate(${position.x}px, ${position.y}px)`;
      }
    }, [position]);

    useImperativeHandle(ref, () => innerRef.current!, []);

    return (
      <button
        ref={innerRef}
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
);

MagneticButton.displayName = "MagneticButton";

export default MagneticButton;
