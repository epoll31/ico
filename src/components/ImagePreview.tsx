import { Size } from "@/lib/types";
import Image from "next/image";
import DropZone from "./DropZone";
import cn from "@/utils/cn";
import Upload from "./icons/upload";
import Toggle from "./Toggle";
import { Tooltip } from "react-tooltip";
import { ImageInfo } from "@/app/page";

export default function ImagePreview({
  className,
  size,
  imageInfo,
  updateImageInfo,
}: {
  className?: string;
  size: Size;
  imageInfo: ImageInfo | null;
  updateImageInfo: (imageInfo: ImageInfo) => void;
}) {
  return (
    <>
      <div
        className={cn(
          "relative min-w-fit h-full bg-white shadow-xl rounded-2xl flex flex-col items-center justify-between px-4 pt-4 pb-4",
          className
        )}
      >
        <p className="text-lg">
          {size}x{size}
        </p>

        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <DropZone
            onChange={(imageUrl) => {
              if (!imageInfo) {
                updateImageInfo({
                  url: imageUrl,
                  active: true,
                });
              } else {
                updateImageInfo({
                  ...imageInfo,
                  url: imageUrl,
                });
              }
            }}
            dataTooltipId="tooltip"
            dataTooltipDelayHide={500}
            dataTooltipDelayShow={500}
          >
            {imageInfo ? (
              <Image
                src={imageInfo.url}
                alt={`icon ${size}x${size}`}
                width={size}
                height={size}
                style={{ width: size, height: size }}
                className="border bg-checkered"
              />
            ) : (
              <div
                style={{ width: size, height: size }}
                className="flex items-center justify-center border rounded"
              >
                <Upload
                  className="max-w-8 max-h-8"
                  style={{ width: size, height: size }}
                />
              </div>
            )}
          </DropZone>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 mt-2">
          <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center mt-2 w-full">
            <Toggle
              toggled={imageInfo?.active}
              disabled={imageInfo === null}
              setToggled={(active) => {
                if (imageInfo) {
                  updateImageInfo({
                    ...imageInfo,
                    active: active,
                  });
                }
              }}
            />
          </div>
        </div>
      </div>
      <Tooltip className="text-center z-50" id="tooltip" place="bottom">
        Drag and drop an image here<br></br>or click to select an image
      </Tooltip>
    </>
  );
}
