import { srcToWebP } from "webp-converter-browser";

export async function webpToPng(imageUrl: string) {
  const webpBlob = await srcToWebP(imageUrl);

  return URL.createObjectURL(webpBlob);
}
