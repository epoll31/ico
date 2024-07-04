export default function DropZone({
  className,
  onChange,
  children,
}: {
  className?: string;
  onChange?: (url: string, type: "drop" | "click") => void;
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
        const url = URL.createObjectURL(file);
        onChange?.(url, "click");
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
      const url = URL.createObjectURL(file);
      onChange?.(url, "drop");
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
      className={className}
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {children}
    </button>
  );
}
