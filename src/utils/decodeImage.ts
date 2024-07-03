import { Size } from "@/components/ImagePreview";
import { SizedFiles } from "@/components/SizedDropZones";
// import { assert } from "console";
import decodeICO from "decode-ico";

interface FileInfo {
  url: string;
  size: Size;
  fromType: "png" | "bmp";
}

const processIcon = async (icon: any): Promise<FileInfo> => {
  // assert(icon.width === icon.height, "All icons must be square");

  if (icon.type === "png") {
    return {
      url: URL.createObjectURL(new Blob([icon.data], { type: "image/png" })),
      size: icon.width,
      fromType: "png",
    };
  } else {
    // For BMP, we need to convert it to PNG
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

/**
 *
 * @param file ico file
 * @returns processed icons as SizedFiles
 */
export async function icoToSizedFiles(
  file: File
): Promise<Partial<SizedFiles>> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const decodedIcons = decodeICO(uint8Array);

    const processedIcons = await Promise.all(decodedIcons.map(processIcon));

    const files: Partial<SizedFiles> = {};
    for (const icon of processedIcons) {
      const sizedFile = await urlToFile(icon.url, `icon-${icon.size}.png`);
      if (sizedFile) {
        files[icon.size] = sizedFile;
      }
    }

    return files;
  } catch (error) {
    console.error("Error processing icons:", error);
    // Handle error appropriately
    return {};
  }
}

async function urlToFile(url: string, filename: string = "image.png") {
  try {
    // Fetch the image data from the URL
    const response = await fetch(url);

    // Check if the fetch was successful
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Convert the response to a Blob
    const blob = await response.blob();

    // Create a File object from the Blob
    const file = new File([blob], filename, { type: "image/png" });

    return file;
  } catch (error) {
    console.error("Error converting URL to File:", error);
    return null;
  }
}
