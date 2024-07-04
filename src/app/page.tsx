"use client";

import AnimatedBorder from "@/components/AnimatedBorder";
import DropZone from "@/components/DropZone";
import SizedDropZones from "@/components/SizedDropZones";
import Upload from "@/components/icons/upload";
import { useCallback, useState } from "react";
import { icoToImageUrls } from "@/utils/decodeImage";
import { Size, SizedURLs } from "@/lib/types";
import downloadBlobAsFile from "@/utils/downloadBlobAsFile";
import { resizeImageUrl, resizeImageUrls } from "@/utils/resizeImageUrls";

function spreadSizes<T>(value: T): Record<Size, T> {
  return {
    16: value,
    24: value,
    32: value,
    48: value,
    64: value,
    128: value,
    256: value,
  };
}

export default function Page() {
  const [imageUrls, setImageUrlsDirect] = useState<SizedURLs>({});

  const setImageUrls = useCallback(
    async (imageUrls: SizedURLs) => {
      if (imageUrls) {
        setImageUrlsDirect(await resizeImageUrls(imageUrls));
      } else {
        setImageUrlsDirect({});
      }
    },
    [setImageUrlsDirect]
  );

  const updateImageUrl = useCallback(
    async (size: Size, imageUrl: string) => {
      const resizedImageUrl = await resizeImageUrl(imageUrl, size);

      setImageUrlsDirect((imageUrls) => ({
        ...imageUrls,
        [size]: resizedImageUrl,
      }));
    },
    [setImageUrlsDirect]
  );

  const setImageUrlsFromIco = useCallback(
    async (imageUrl: string) => {
      setImageUrlsDirect(await icoToImageUrls(imageUrl));
    },
    [setImageUrlsDirect]
  );

  const loadFile = useCallback(
    async (imageUrl: string) => {
      if (imageUrl) {
        const blob = await fetch(imageUrl).then((res) => res.blob());
        if (blob.type === "image/png") {
          setImageUrls(spreadSizes(imageUrl));
        } else if (
          blob.type === "image/x-icon" ||
          blob.type === "image/vnd.microsoft.icon"
        ) {
          setImageUrlsFromIco(imageUrl);
        } else {
          alert("Unsupported file type");
        }
      } else {
        setImageUrls({});
      }
    },
    [setImageUrls, setImageUrlsFromIco]
  );

  const handleDownloadRequest = useCallback(async (imageUrls: SizedURLs) => {
    const imageUrlsAsArray = Object.values(imageUrls).filter(Boolean);

    const blobs = await Promise.all(
      imageUrlsAsArray.map(
        async (imageUrl) => await fetch(imageUrl).then((res) => res.blob())
      )
    );

    const formData = new FormData();
    blobs.forEach((blob) => formData.append("blobs", blob));

    try {
      const response = await fetch("/api/convert/files", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("HTTP error: status code " + response.status);
      }

      const blob = await response.blob();

      downloadBlobAsFile(blob, "icon.ico");
    } catch (error) {
      console.error("Error:", error);
    }
  }, []);

  return (
    <div className="flex flex-col justify-center items-center p-20 gap-10">
      <div className="flex  items-center justify-center gap-10">
        <div className="flex flex-col flex-1 h-full items-center justify-center">
          <h1 className="text-4xl font-bold text-center">
            ICO&rsquo;s Better Than Ever
          </h1>
          <p className="text-2xl text-center">Lorem ipsum dolor sit amet.</p>
        </div>
        <div className="flex flex-col flex-1 h-full items-center justify-center gap-4">
          <DropZone onChange={loadFile} className="relative">
            <div className="flex flex-col justify-center items-center  p-5 gap-2 ">
              <h1 className="text-4xl font-bold">Drop your image here</h1>
              <p className="text-xl">Or click to select an image</p>
              <Upload className="w-8 h-8 mx-4" />
            </div>
            {/* TODO: fix dashArray */}
            <AnimatedBorder borderRadius={15} dashArray="10 10" />
          </DropZone>
        </div>
      </div>
      {imageUrls && (
        <>
          <SizedDropZones
            imageUrls={imageUrls}
            updateImageUrl={updateImageUrl}
          />
          <button
            onClick={() => handleDownloadRequest(imageUrls)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Download
          </button>
        </>
      )}
    </div>
  );
}
