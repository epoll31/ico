"use client";

import { useEffect, useState } from "react";
import decodeICO from "decode-ico";
import Image from "next/image";

interface Icon {
  width: number;
  height: number;
  dataUrl: string;
  ogType: "png" | "bmp";
}

const processIcon = async (icon: any): Promise<Icon> => {
  if (icon.type === "png") {
    return {
      width: icon.width,
      height: icon.height,
      dataUrl: URL.createObjectURL(
        new Blob([icon.data], { type: "image/png" })
      ),
      ogType: "png",
    };
  } else {
    // For BMP, we need to convert it to PNG
    return convertBmpToPng(icon);
  }
};

const convertBmpToPng = (bmpData: any): Icon => {
  const canvas = document.createElement("canvas");
  canvas.width = bmpData.width;
  canvas.height = bmpData.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  ctx.putImageData(bmpData, 0, 0);

  return {
    width: bmpData.width,
    height: bmpData.height,
    dataUrl: canvas.toDataURL("image/png"),
    ogType: "bmp",
  };
};
export default function ViewIco({ icoFile }: { icoFile: File }) {
  const [icons, setIcons] = useState<Icon[]>([]);

  useEffect(() => {
    async function processIcons() {
      if (!icoFile) return;

      try {
        const arrayBuffer = await icoFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const decodedIcons = decodeICO(uint8Array);

        const processedIcons = await Promise.all(decodedIcons.map(processIcon));
        setIcons(processedIcons);
      } catch (error) {
        console.error("Error processing icons:", error);
        // Handle error appropriately
      }
    }

    processIcons();
  }, [icoFile]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {icons.map((icon, index) => (
        <div key={index} className="border p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">
            {icon.width}x{icon.height}: {icon.ogType}
          </h2>
          <Image
            src={icon.dataUrl}
            alt={`Icon ${index + 1}: ${icon.width}x${icon.height}`}
            width={icon.width}
            height={icon.height}
            className="mx-auto"
            style={{ width: icon.width, height: icon.height }}
          />
        </div>
      ))}
    </div>
  );
}
