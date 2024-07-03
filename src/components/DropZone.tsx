import cn from "@/utils/cn";

export default function DropZone({
  className,
  onChange,
  children,
}: {
  className?: string;
  onChange?: (file: File, type: "drop" | "click") => void;
  children?: React.ReactNode;
}) {
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
        onChange?.(file, "click");
      } else {
        throw new Error("No file selected");
      }
    };
  };

  const handleClick = async () => {
    requestFile();
  };

  const handleDrop = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) {
      onChange?.(file, "drop");
    } else {
      throw new Error("No file selected");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <button
      className={cn(
        " flex flex-col justify-center items-center relative",
        className
      )}
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {children}
    </button>
  );
}
