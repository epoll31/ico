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
    <div className="flex flex-wrap gap-4 items-start mt-10">
      {Sizes.toReversed().map((size) => {
        let imageUrl = imageUrls[size];
        if (!imageUrl) return null;

        return (
          <ImagePreview
            key={size}
            file={imageUrl}
            size={size}
            updateImageUrl={updateImageUrl}
          />
        );
      })}
    </div>
  );
}
