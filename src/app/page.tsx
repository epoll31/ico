"use client";

import AnimatedBorder from "@/components/AnimatedBorder";
import DropZone from "@/components/DropZone";
import SizedDropZones from "@/components/SizedDropZones";
import Upload from "@/components/icons/upload";
import { useCallback, useState } from "react";
import { icoToImageUrls } from "@/utils/decodeImage";
import { Size, Sizes } from "@/lib/types";
import downloadBlobAsFile from "@/utils/downloadBlobAsFile";
import { resizeImageUrl, resizeImageUrls } from "@/utils/resizeImageUrls";
import spreadSizes from "@/utils/spreadSizes";

export default function Page() {
  const [imageUrls, setImageUrlsDirect] = useState<Record<Size, string | null>>(
    spreadSizes(null)
  );
  const [activeImageUrls, setActiveImageUrls] = useState<Record<Size, boolean>>(
    spreadSizes(false)
  );

  const setImageUrls = useCallback(
    async (imageUrls: Record<Size, string | null>) => {
      if (imageUrls) {
        const resizedImageUrls = await resizeImageUrls(imageUrls);
        setImageUrlsDirect(resizedImageUrls);
        const activeImageUrls: Record<Size, boolean> = spreadSizes(false);
        Object.keys(resizedImageUrls).forEach((size) => {
          activeImageUrls[Number(size) as Size] = true;
        });
        setActiveImageUrls(activeImageUrls);
      } else {
        setImageUrlsDirect(spreadSizes(null));
        setActiveImageUrls(spreadSizes(false));
      }
    },
    [setImageUrlsDirect]
  );

  const updateImageUrl = useCallback(
    async (size: Size, imageUrl: string) => {
      const resizedImageUrl = await resizeImageUrl(imageUrl, size);
      // TODO: make sure that ICO's import the correct size

      setImageUrlsDirect((imageUrls) => ({
        ...imageUrls,
        [size]: resizedImageUrl,
      }));
      setActiveImageUrls((activeImageUrls) => ({
        ...activeImageUrls,
        [size]: true,
      }));
    },
    [setImageUrlsDirect]
  );

  const updateActiveImageUrl = useCallback(
    (size: Size, active: boolean) => {
      setActiveImageUrls((activeImageUrls) => ({
        ...activeImageUrls,
        [size]: active,
      }));
    },
    [setActiveImageUrls]
  );

  const setImageUrlsFromIco = useCallback(
    async (imageUrl: string) => {
      const iamgeUrlsFromIco = await icoToImageUrls(imageUrl);

      const imageUrls = {
        ...spreadSizes(null),
        ...iamgeUrlsFromIco,
      };
      setImageUrlsDirect(imageUrls);

      const activeImageUrls = spreadSizes(false);
      Sizes.forEach((size) => {
        activeImageUrls[size] = imageUrls[size] !== null;
      });

      setActiveImageUrls(activeImageUrls);
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
        setImageUrls(spreadSizes(null));
        setActiveImageUrls(spreadSizes(false));
      }
    },
    [setImageUrls, setImageUrlsFromIco]
  );

  const handleDownloadRequest = useCallback(async () => {
    const blobs = await Promise.all(
      Sizes.filter((size) => imageUrls[size] && activeImageUrls[size]).map(
        (size) => fetch(imageUrls[size] as string).then((res) => res.blob())
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
  }, [imageUrls, activeImageUrls]);

  return (
    <div className="flex flex-col justify-center items-center gap-10 p-10">
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

      <SizedDropZones
        imageUrls={imageUrls}
        activeImageUrls={activeImageUrls}
        updateImageUrl={updateImageUrl}
        updateActiveImageUrls={updateActiveImageUrl}
      />
      {Sizes.filter((size) => imageUrls[size] && activeImageUrls[size]).length >
        0 && (
        <button
          onClick={handleDownloadRequest}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Download
        </button>
      )}
    </div>
  );
}
