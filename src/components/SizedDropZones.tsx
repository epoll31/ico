"use client";

import cn from "@/utils/cn";
import ImagePreview from "./ImagePreview";
import { Size, Sizes } from "@/lib/types";

export default function SizedDropZones({
  imageUrls,
  activeImageUrls,
  updateImageUrl,
  updateActiveImageUrls,
}: {
  imageUrls: Record<Size, string | null>;
  activeImageUrls: Record<Size, boolean>;
  updateImageUrl: (size: Size, imageUrl: string) => void;
  updateActiveImageUrls: (size: Size, active: boolean) => void;
}) {
  const sizes: Record<Size, string> = {
    [256]: "col-span-2 min-[750px]:col-span-3",
    [128]: "col-span-2 min-[750px]:col-span-2",
    [64]: "col-span-2  min-[750px]:col-span-1",
    [48]: "col-span-1  min-[750px]:col-span-1",
    [32]: "col-span-1  min-[750px]:col-span-1",
    [24]: "col-span-1  min-[750px]:col-span-1",
    [16]: "col-span-1  min-[750px]:col-span-1",
  };

  return (
    <div className="gap-4 grid grid-cols-2  min-[750px]:grid-cols-5">
      {Sizes.toReversed().map((size) => {
        return (
          <ImagePreview
            key={size}
            className={cn(sizes[size], "")}
            imageUrl={imageUrls[size]}
            size={size}
            active={activeImageUrls[size]}
            updateImageUrl={(imageUrl) => updateImageUrl(size, imageUrl)}
            updateActiveImageUrls={(active) =>
              updateActiveImageUrls(size, active)
            }
          />
        );
      })}
    </div>
  );
}
