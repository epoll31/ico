"use client";

import AnimatedBorder from "@/components/AnimatedBorder";
import DropZone from "@/components/DropZone";
import SizedDropZones from "@/components/SizedDropZones";
import Upload from "@/components/icons/upload";
import resizeImageBase64 from "@/utils/resizeImage";
import { Size } from "@/components/ImagePreview";
import { useCallback, useEffect, useState } from "react";
import { icoToSizedFiles } from "@/utils/decodeImage";

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

const downloadBlobAsFile = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
};
async function resizeImage(imageUrl: string, size: Size): Promise<string> {
  // Fetch the image data from the URL
  const response = await fetch(imageUrl);
  const blob = await response.blob();

  // Convert blob to base64
  const base64 = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });

  // Remove data URL prefix
  const base64Image = base64.split(",")[1];

  // Assume we're using the original file name and type
  const fileName = imageUrl.split("/").pop() || "resized-image";
  const fileType = blob.type;

  const result = await resizeImageBase64(base64Image, size, fileName);

  // Create a new Blob from the resized base64 data
  const resizedBlob = new Blob([Buffer.from(result.base64, "base64")], {
    type: result.type || fileType,
  });

  // Create and return a new object URL
  return URL.createObjectURL(resizedBlob);
}

async function resizeFiles(files: Partial<Record<Size, string>>) {
  const resizedFiles = files;

  for (const [rawSize, file] of Object.entries(files)) {
    if (file) {
      const size = Number(rawSize) as Size;

      resizedFiles[size] = await resizeImage(file, size);
    }
  }

  return resizedFiles;
}

export default function Page() {
  const [files, setFilesDirect] = useState<Partial<Record<Size, string>>>({});

  const setFiles = useCallback(
    async (files: Partial<Record<Size, string>>) => {
      if (!files) {
        setFilesDirect({});
        return;
      }

      files = await resizeFiles(files); // TODO: maybe use setFiles which will resize the images?

      console.log("settingfiles", files);

      setFilesDirect(files);
    },
    [setFilesDirect]
  );

  const updateFile = useCallback(
    async (size: Size, file: string) => {
      const resizedFile = await resizeImage(file, size);

      setFilesDirect((files) => ({
        ...files,
        [size]: resizedFile,
      }));
    },
    [setFilesDirect]
  );

  const setFilesFromIco = useCallback(
    async (file: string) => {
      const files = await icoToSizedFiles(file);
      setFilesDirect(files); // TODO: maybe use setFiles which will resize the images?
    },
    [setFilesDirect]
  );

  const loadFile = useCallback(
    async (url: string) => {
      if (url) {
        const file = await fetch(url).then((res) => res.blob());
        if (file.type === "image/png") {
          setFiles(spreadSizes(url));
        } else if (
          file.type === "image/x-icon" ||
          file.type === "image/vnd.microsoft.icon"
        ) {
          setFilesFromIco(url);
        } else {
          alert("Unsupported file type");
        }
      } else {
        setFiles({});
      }
    },
    [setFiles, setFilesFromIco]
  );

  const handleDownloadRequest = useCallback(
    async (sizedUrls: Partial<Record<Size, string>>) => {
      const urls = Object.values(sizedUrls).filter(Boolean);
      console.log("urls", urls);

      const files = await Promise.all(
        urls.map(async (url) => await fetch(url).then((res) => res.blob()))
      );

      const formData = new FormData();
      files.forEach((file) => formData.append("urls", file));

      try {
        const response = await fetch("/api/convert/files", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("HTTP error: status code " + response.status);
        }

        const result = await response.blob();

        downloadBlobAsFile(result, "icon.ico");
        console.log("Success:", result);
      } catch (error) {
        console.error("Error:", error);
      }
    },
    []
  );

  useEffect(() => {
    console.log("files", files);
  }, [files]);

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
          <DropZone onChange={loadFile}>
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
      {files && (
        <>
          <SizedDropZones files={files} updateFile={updateFile} />
          <button
            onClick={() => handleDownloadRequest(files)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Download
          </button>
        </>
      )}
    </div>
  );
}
