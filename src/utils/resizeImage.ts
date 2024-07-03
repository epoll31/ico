import { Size } from "@/components/ImagePreview";
import Resizer from "react-image-file-resizer";

export default function resizeImage(file: File, size: Size) {
  return new Promise((resolve) =>
    Resizer.imageFileResizer(
      file,
      size,
      size,
      "PNG",
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      "file",
      size,
      size
    )
  );
}
