import { Size } from "@/lib/types";
import Image from "next/image";
import DropZone from "./DropZone";
import cn from "@/utils/cn";
import useTooltip from "./ToolTip";

export default function ImagePreview({
  className,
  imageUrl,
  size,
  updateImageUrl,
}: {
  className?: string;
  imageUrl: string;
  size: Size;
  updateImageUrl: (size: Size, imageUrl: string) => void;
}) {
  const { Tooltip, triggerRef } = useTooltip<HTMLButtonElement>({
    content: "Drag and drop an image here,\n or click to select an image",
  });

  return (
    <div
      className={cn(
        "relative h-full border shadow-xl rounded-2xl flex flex-col items-center justify-between px-4 pt-4 pb-4 hover:animate-wiggle",
        className
      )}
    >
      <DropZone
        className="flex-1"
        onChange={(imageUrl) => updateImageUrl(size, imageUrl)}
        ref={triggerRef}
      >
        <Image
          src={imageUrl}
          alt={`icon ${size}x${size}`}
          width={size}
          height={size}
          style={{ width: size, height: size }}
        />
      </DropZone>
      <p className="text-lg mt-2">
        {size}x{size}
      </p>
      <Tooltip />
    </div>
  );
}
