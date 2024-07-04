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
  return (
    <div className="gap-4 grid grid-cols-5 items-start">
      {Sizes.toReversed().map((size) => {
        return (
          <ImagePreview
            key={size}
            className={
              size === 256 ? "col-span-3" : size === 128 ? "col-span-2" : ""
            }
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
