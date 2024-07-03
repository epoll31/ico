"use client";

import AnimatedBorder from "@/components/AnimatedBorder";
import DropZone from "@/components/DropZone";
import SizedDropZones, { SizedFiles } from "@/components/SizedDropZones";
import Upload from "@/components/icons/upload";
import resizeImage from "@/utils/resizeImage";
import { Size } from "@/components/ImagePreview";
import { useCallback, useEffect, useState } from "react";
import { icoToSizedFiles } from "@/utils/decodeImage";

function spreadFiles(file: File) {
  return {
    16: file,
    24: file,
    32: file,
    48: file,
    64: file,
    96: file,
    128: file,
    256: file,
  };
}

async function resizeFiles(files: Partial<SizedFiles>) {
  const resizedFiles = files;

  for (const [rawSize, file] of Object.entries(files)) {
    if (file) {
      const size = Number(rawSize) as Size;
      resizedFiles[size] = (await resizeImage(file, size)) as File;
    }
  }

  return resizedFiles;
}

export default function Page() {
  const [file, setFile] = useState<File>();
  const [files, setFilesDirect] = useState<Partial<SizedFiles>>();

  async function setFilesFromIco(file: File) {
    const files = await icoToSizedFiles(file);
    setFilesDirect(files); // TODO: maybe use setFiles?
  }

  useEffect(() => {
    if (file) {
      // console.log("filetype", file.type);
      if (file.type === "image/png") {
        console.log("loading png");
        setFiles(spreadFiles(file));
      } else if (
        file.type === "image/x-icon" ||
        file.type === "image/vnd.microsoft.icon"
      ) {
        console.log("loading ico");
        setFilesFromIco(file);
      } else {
        alert("Unsupported file type");
      }
    } else {
      setFiles(undefined);
    }
  }, [file]);

  async function setFiles(files: Partial<SizedFiles> | undefined) {
    if (!files) {
      return;
    }

    files = await resizeFiles(files);

    setFilesDirect(files);
  }
  const downloadBlobAsFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
  };
  const handleDownloadRequest = useCallback(
    async (files: Partial<SizedFiles>) => {
      const pngFiles = Object.values(files).filter(Boolean) as File[];

      const formData = new FormData();
      pngFiles.forEach((file) => formData.append("files", file));

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
    [files]
  );

  return (
    <div className="flex flex-col justify-center items-center p-20 gap-10">
      <div className="flex  items-center justify-center gap-10">
        <div className="flex flex-col flex-1 h-full items-center justify-center">
          <h1 className="text-4xl font-bold text-center">
            ICO's Better Than Ever
          </h1>
          <p className="text-2xl text-center">Lorem ipsum dolor sit amet.</p>
        </div>
        <div className="flex flex-col flex-1 h-full items-center justify-center gap-4">
          <DropZone onChange={setFile}>
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
          <SizedDropZones
            files={files}
            updateFile={(size, file) =>
              setFiles({
                ...files,
                [size]: file,
              })
            }
          />
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
