import { useEffect, useState } from "react";
import ImagePreview, { Size, Sizes } from "./ImagePreview";
import DropZone from "./DropZone";

function spreadFiles(file: File) {
  return {
    16: file,
    24: file,
    32: file,
    48: file,
    64: file,
    96: file,
    128: file,
    256: file,
  };
}

export default function SizedDropZones({ defaultFile }: { defaultFile: File }) {
  const [sizedFiles, setSizedFiles] = useState<Record<Size, File>>(
    spreadFiles(defaultFile)
  );

  const updateSizedFile = (file: File, size: Size) => {
    setSizedFiles({
      ...sizedFiles,
      [size]: file,
    });
  };

  useEffect(() => {
    setSizedFiles(spreadFiles(defaultFile));
  }, [defaultFile]);

  return (
    <div className="flex flex-wrap gap-4 items-start mt-10">
      {Sizes.toReversed().map((size) => (
        <DropZone onChange={(file) => updateSizedFile(file, size)} key={size}>
          <ImagePreview file={sizedFiles[size]} size={size} />
        </DropZone>
      ))}
    </div>
  );
}
