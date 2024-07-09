import { Size } from "@/lib/types";
import Image from "image-js";

export async function resizeImageUrls(imageUrls: Record<Size, string>) {
  const resizedImages = imageUrls;

  for (const [rawSize, imageUrl] of Object.entries(imageUrls)) {
    if (imageUrl) {
      const size = Number(rawSize) as Size;

      resizedImages[size] = await resizeImageUrl(imageUrl, size);
    }
  }

  return resizedImages;
}

export async function resizeImageUrl(
  imageUrl: string,
  size: Size
): Promise<string> {
  const image = await Image.load(imageUrl);
  return image
    .resize({
      width: size,
      height: size,
      preserveAspectRatio: false,
    })
    .toDataURL();
}
