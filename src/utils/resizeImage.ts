import { Size } from "@/components/ImagePreview";
import Resizer from "react-image-file-resizer";

export default async function resizeImage(file: File, size: Size) {
  return new Promise((resolve) =>
    Resizer.imageFileResizer(
      file,
      size,
      size,
      "PNG",
      100,
      0,
      (uri: string | Blob | File | ProgressEvent<FileReader>) => {
        return resolve(uri);
      },
      "blob", // uri will be returned as a Blob
      size,
      size
    )
  );
}
