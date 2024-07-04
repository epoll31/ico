"use server";

import { Size } from "@/components/ImagePreview";
import sharp from "sharp";

export default async function resizeImage(
  base64Image: string,
  size: Size,
  fileName: string
) {
  // Convert base64 to Buffer
  const imageBuffer = Buffer.from(base64Image, "base64");

  const output = await sharp(imageBuffer).resize(size, size).toBuffer();

  // Return base64 string of the resized image
  return {
    base64: output.toString("base64"),
    fileName: fileName,
    type: "image/png",
  };
}
