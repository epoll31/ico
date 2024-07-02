"use client";

import AnimatedBorder from "@/components/AnimatedBorder";
import DropZone from "@/components/DropZone";
import ImagePreview, { Sizes } from "@/components/ImagePreview";
import Upload from "@/components/icons/upload";
import { useState } from "react";

export default function Page() {
  const [file, setFile] = useState<File>();

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
      <div className="flex flex-row flex-wrap gap-4 items-start">
        {file &&
          Sizes.map((size) => (
            <ImagePreview key={size} file={file} size={size} />
          ))}
      </div>
    </div>
  );
}
