import ImagePreview from "./ImagePreview";
import { Size, SizedURLs, Sizes } from "@/lib/types";

export default function SizedDropZones({
  imageUrls,
  updateImageUrl,
}: {
  imageUrls: SizedURLs;
  updateImageUrl: (size: Size, imageUrl: string) => void;
}) {
  return (
    <div className="gap-4 grid grid-cols-5 items-start">
      {Sizes.toReversed().map((size) => {
        let imageUrl = imageUrls[size];
        if (!imageUrl) return null;

        return (
          <ImagePreview
            key={size}
            className={
              size === 256 ? "col-span-3" : size === 128 ? "col-span-2" : ""
            }
            imageUrl={imageUrl}
            size={size}
            updateImageUrl={updateImageUrl}
          />
        );
      })}
    </div>
  );
}
