import { Size } from "@/lib/types";
import resizeImageBase64 from "@/utils/resizeImageBase64";

export async function resizeImageUrls(imageUrls: Record<Size, string | null>) {
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
  const response = await fetch(imageUrl);
  const blob = await response.blob();

  const base64 = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });

  const base64Image = base64.split(",")[1];

  const fileName = imageUrl.split("/").pop() || "resized-image";
  const fileType = blob.type;

  const result = await resizeImageBase64(base64Image, size, fileName);

  const resizedBlob = new Blob([Buffer.from(result.base64, "base64")], {
    type: result.type || fileType,
  });

  return URL.createObjectURL(resizedBlob);
}
