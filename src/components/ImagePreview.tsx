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
  tabIndex,
  accept = "*/*",
}: {
  className?: string;
  size: Size;
  imageInfo: ImageInfo | null;
  updateImageInfo: (imageInfo: ImageInfo) => void;
  tabIndex?: number;
  accept?: string;
}) {
  return (
    <>
      <div
        className={cn(
          "relative min-w-fit h-full rounded-2xl flex flex-col items-center justify-between px-4 pt-4 pb-4 transition-all duration-200",
          imageInfo?.active
            ? "shadow-xl-center bg-white "
            : "shadow-none bg-gray-50",
          className
        )}
      >
        <p className={"text-lg pb-2 text-gray-400"}>
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
            dataTooltipDelayHide={100}
            dataTooltipDelayShow={300}
            tabIndex={tabIndex}
            accept={accept}
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
              tabIndex={tabIndex}
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
