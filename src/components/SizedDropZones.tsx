"use client";

import cn from "@/utils/cn";
import ImagePreview from "./ImagePreview";
import { Size, Sizes } from "@/lib/types";
import { ImageInfo, ImageInfoMap } from "@/app/page";

export default function SizedDropZones({
  imageInfos,
  updateImageInfo,
  tabIndex,
}: {
  imageInfos: ImageInfoMap;
  updateImageInfo: (size: Size, imageInfo: ImageInfo | null) => void;
  tabIndex?: number;
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
        const imageInfo = imageInfos[size];

        return (
          <ImagePreview
            tabIndex={tabIndex}
            key={size}
            className={cn(sizes[size], "")}
            size={size}
            imageInfo={imageInfo}
            updateImageInfo={(imageInfo: ImageInfo) =>
              updateImageInfo(size, imageInfo)
            }
          />
        );
      })}
    </div>
  );
}
