import ImagePreview, { Size, Sizes } from "./ImagePreview";
import DropZone from "./DropZone";

export type SizedFiles = Record<Size, File>;

export default function SizedDropZones({
  files,
  updateFile,
}: {
  files: Partial<SizedFiles>;
  updateFile: (size: Size, file: File) => void;
}) {
  return (
    <div className="flex flex-wrap gap-4 items-start mt-10">
      {Sizes.toReversed().map((size) => {
        let file = files[size];
        if (!file) return null;

        if (typeof file === "string") {
          // file = new File([file], `icon-${size}.png`, { type: "image/png" });
        }

        return (
          <DropZone onChange={(file) => updateFile(size, file)} key={size}>
            <ImagePreview file={file} size={size} />
          </DropZone>
        );
      })}
    </div>
  );
}
