import { Size } from "@/lib/types";
import Image from "next/image";
import DropZone from "./DropZone";
import cn from "@/utils/cn";
import useTooltip from "./ToolTip";
import Upload from "./icons/upload";
import Toggle from "./Toggle";

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
  const { Tooltip, triggerRef } = useTooltip<HTMLElement>();

  return (
    <div
      className={cn(
        "relative min-w-fit h-full border shadow-xl rounded-2xl flex flex-col items-center justify-between px-4 pt-4 pb-4 hover:animate-wiggle",
        className
      )}
    >
      <DropZone className="flex-1" onChange={updateImageUrl}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`icon ${size}x${size}`}
            width={size}
            height={size}
            style={{ width: size, height: size }}
            className="border"
            ref={triggerRef as any}
          />
        ) : (
          <div
            style={{ width: size, height: size }}
            className="flex items-center justify-center border rounded"
            ref={triggerRef as any}
          >
            <Upload className="w-8 h-8" />
          </div>
        )}
      </DropZone>
      <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center mt-2 w-full">
        <p className="text-lg">
          {size}x{size}
        </p>

        <Toggle
          toggled={active}
          disabled={imageUrl === null}
          setToggled={updateActiveImageUrls}
        />
      </div>
      <Tooltip className="text-center">
        Drag and drop an image here<br></br>or click to select an image
      </Tooltip>
    </div>
  );
}
