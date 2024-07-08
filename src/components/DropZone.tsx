import { forwardRef } from "react";

const DropZone = forwardRef(
  (
    {
      className,
      onChange,
      children,
      allow = "any",
      dataTooltipId,
      dataTooltipDelayShow,
      dataTooltipDelayHide,
      as: Component = "button",
    }: {
      className?: string;
      onChange?: (url: string, type: "drop" | "click") => void;
      children?: React.ReactNode;
      allow?: "any" | "drop" | "click" | "none";
      dataTooltipId?: string;
      dataTooltipDelayShow?: number;
      dataTooltipDelayHide?: number;
      as?: React.ElementType;
    },
    ref: React.Ref<HTMLButtonElement>
  ) => {
    const requestFile = () => {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";
      fileInput.style.display = "none";
      fileInput.multiple = false;

      fileInput.click();

      fileInput.onchange = (e: any) => {
        const file = e.target.files[0] as File;
        if (file) {
          const url = URL.createObjectURL(file);
          onChange?.(url, "click");
        } else {
          throw new Error("No file selected");
        }
      };
    };

    const handleClick = async () => {
      if (allow === "click" || allow === "any") {
        requestFile();
      }
    };

    const handleDrop = (e: React.DragEvent<HTMLButtonElement>) => {
      if (allow === "drop" || allow === "any") {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files[0];
        if (file) {
          const url = URL.createObjectURL(file);
          onChange?.(url, "drop");
        } else {
          throw new Error("No file selected");
        }
      }
    };

    const handleDragOver = (e: React.DragEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
    };

    return (
      <Component
        className={className}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        data-tooltip-id={dataTooltipId}
        data-tooltip-delay-show={dataTooltipDelayShow}
        data-tooltip-delay-hide={dataTooltipDelayHide}
        ref={ref}
      >
        {children}
      </Component>
    );
  }
);

export default DropZone;
