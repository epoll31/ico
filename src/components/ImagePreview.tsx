import { Size } from "@/lib/types";
import Image from "next/image";
import { useMemo } from "react";
import DropZone from "./DropZone";
import Tooltip from "./ToolTip";

export default function ImagePreview({
  file,
  size,
  updateImageUrl,
}: {
  file: File | string;
  size: Size;
  updateImageUrl: (size: Size, imageUrl: string) => void;
}) {
  const src = useMemo(() => {
    if (typeof file === "string") {
      return file;
    } else {
      return URL.createObjectURL(file);
    }
  }, [file]);

  return (
    file && (
      <div className="relative h-full border shadow-xl rounded-2xl flex gap-4 px-4 pt-4 pb-2 hover:animate-wiggle">
        <div className="flex flex-col items-center gap-2">
          <Tooltip content="Drag and drop an image here,\n or click to select an image">
            <DropZone onChange={(imageUrl) => updateImageUrl(size, imageUrl)}>
              <Image
                src={src}
                alt={`icon ${size}x${size}`}
                width={size}
                height={size}
                style={{ width: size, height: size }}
              />
            </DropZone>
          </Tooltip>
          <p className="text-lg ">
            {size}x{size}
          </p>
        </div>
      </div>
    )
  );
}
