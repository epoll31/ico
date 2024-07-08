import { Size } from "@/lib/types";
// import { assert } from "console";
import decodeICO from "decode-ico";
import spreadSizes from "./spreadSizes";

interface FileInfo {
  url: string;
  size: Size;
  fromType: "png" | "bmp";
}

const processIcon = async (icon: any): Promise<FileInfo> => {
  if (icon.type === "png") {
    return {
      url: URL.createObjectURL(new Blob([icon.data], { type: "image/png" })),
      size: icon.width,
      fromType: "png",
    };
  } else {
    return convertBmpToPng(icon);
  }
};

const convertBmpToPng = (bmpData: any): FileInfo => {
  const canvas = document.createElement("canvas");
  canvas.width = bmpData.width;
  canvas.height = bmpData.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  ctx.putImageData(bmpData, 0, 0);

  return {
    url: canvas.toDataURL("image/png"),
    size: bmpData.width,
    fromType: "bmp",
  };
};

export async function icoToImageUrls(
  iconUrl: string
): Promise<Record<Size, string | null>> {
  try {
    const response = await fetch(iconUrl);
    const arrayBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const decodedIcons = decodeICO(uint8Array);

    const processedIcons = await Promise.all(decodedIcons.map(processIcon));

    const files = spreadSizes<string | null>(null);
    for (const icon of processedIcons) {
      files[icon.size] = icon.url;
    }

    return files;
  } catch (error) {
    console.error("Error processing icons:", error);
    return spreadSizes(null);
  }
}
