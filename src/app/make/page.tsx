"use client";

import { useState } from "react";
import Image from "next/image";
import ViewIco from "@/components/ViewICO";

const ICO_SIZES = [16, 32, 48, 64, 128, 256];

export default function Make() {
  const [sourceImage, setSourceImage] = useState<File | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<number[]>(ICO_SIZES);
  const [resultFile, setResultFile] = useState<File | undefined>(undefined);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setSourceImage(file);
  };

  const handleSizeToggle = (size: number) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleCreateICO = async () => {
    if (!sourceImage) return;

    const formData = new FormData();
    formData.append("pngFile", sourceImage);
    formData.append("sizes", JSON.stringify(selectedSizes));

    try {
      const response = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.blob();

        setResultFile(new File([result], "icon.ico", { type: "image/x-icon" }));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const downloadResultFile = () => {
    if (!resultFile) return;

    const url = URL.createObjectURL(resultFile);
    const link = document.createElement("a");
    link.href = url;
    link.download = "icon.ico";
    link.click();
  };

  return (
    <div className="p-4 flex flex-col gap-4">
      <h1 className="text-2xl font-bold mb-4">ICO Creator</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="mb-4"
      />

      {sourceImage && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Preview:</h2>
          <Image
            src={URL.createObjectURL(sourceImage)}
            alt="Source image"
            width={200}
            height={200}
          />
        </div>
      )}

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Select Sizes:</h2>
        {ICO_SIZES.map((size) => (
          <label key={size} className="block">
            <input
              type="checkbox"
              checked={selectedSizes.includes(size)}
              onChange={() => handleSizeToggle(size)}
            />
            {size}x{size}
          </label>
        ))}
      </div>

      <button
        onClick={handleCreateICO}
        className="bg-blue-500 text-white px-4 py-2 rounded w-fit"
        disabled={!sourceImage || selectedSizes.length === 0}
      >
        Create ICO
      </button>

      {resultFile && (
        <>
          <ViewIco icoFile={resultFile} />
          <button
            onClick={downloadResultFile}
            className="bg-blue-500 text-white px-4 py-2 rounded w-fit"
          >
            Download
          </button>
        </>
      )}
    </div>
  );
}
