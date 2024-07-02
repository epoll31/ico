"use client";

import AnimatedBorder from "@/components/AnimatedBorder";
import DropZone from "@/components/DropZone";
import SizedDropZones, { SizedFiles } from "@/components/SizedDropZones";
import Upload from "@/components/icons/upload";
import { useCallback, useEffect, useState } from "react";

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
export default function Page() {
  const [file, setFile] = useState<File>();
  const [files, setFiles] = useState<SizedFiles>();
  useEffect(() => {
    if (file) {
      setFiles(spreadFiles(file));
    } else {
      setFiles(undefined);
    }
  }, [file]);

  const handleDownload = useCallback(() => {}, [files]);

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
            onClick={handleDownload}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Download
          </button>
        </>
      )}
    </div>
  );
}
