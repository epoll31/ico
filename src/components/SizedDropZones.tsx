import ImagePreview, { Size, Sizes } from "./ImagePreview";
import DropZone from "./DropZone";

export type SizedFiles = Record<Size, File>;

export default function SizedDropZones({
  files,
  updateFile,
}: {
  files: SizedFiles;
  updateFile: (size: Size, file: File) => void;
}) {
  return (
    <div className="flex flex-wrap gap-4 items-start mt-10">
      {Sizes.toReversed().map((size) => (
        <DropZone onChange={(file) => updateFile(size, file)} key={size}>
          <ImagePreview file={files[size]} size={size} />
        </DropZone>
      ))}
    </div>
  );
}
