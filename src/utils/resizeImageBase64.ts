"use server";

import { Size } from "@/lib/types";
import sharp from "sharp";

export default async function resizeImageBase64(
  base64Image: string,
  size: Size,
  fileName: string
) {
  // Convert base64 to Buffer
  const imageBuffer = Buffer.from(base64Image, "base64");

  const output = await sharp(imageBuffer)
    .resize(size, size, {
      fit: "fill",
    })
    .toBuffer();

  // Return base64 string of the resized image
  return {
    base64: output.toString("base64"),
    fileName: fileName,
    type: "image/png",
  };
}
