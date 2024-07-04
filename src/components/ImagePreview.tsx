import { Size } from "@/lib/types";
import Image from "next/image";
import DropZone from "./DropZone";
import cn from "@/utils/cn";
import useTooltip from "./ToolTip";
import Upload from "./icons/upload";

export default function ImagePreview({
  className,
  size,
  imageUrl,
  active,
  updateImageUrl,
  updateActiveImageUrls,
}: {
  className?: string;
  size: Size;
  imageUrl: string | null;
  active: boolean;
  updateImageUrl: (imageUrl: string) => void;
  updateActiveImageUrls: (active: boolean) => void;
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
      <DropZone className="flex-1" onChange={updateImageUrl} ref={triggerRef}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`icon ${size}x${size}`}
            width={size}
            height={size}
            style={{ width: size, height: size }}
          />
        ) : (
          <div
            style={{ width: size, height: size }}
            className="flex items-center justify-center"
          >
            <Upload className="w-8 h-8" />
          </div>
        )}
      </DropZone>
      <p className="text-lg mt-2">
        {size}x{size}
      </p>
      <input
        type="checkbox"
        checked={active}
        disabled={!imageUrl}
        onChange={(e) => {
          updateActiveImageUrls(e.target.checked);
        }}
      />
      <Tooltip />
    </div>
  );
}
