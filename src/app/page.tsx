"use client";

import AnimatedBorder from "@/components/AnimatedBorder";
import DropZone from "@/components/DropZone";
import Upload from "@/components/icons/upload";
import NextImage from "next/image";
import { useState } from "react";

const MAX_WIDTH = 300;
const MAX_HEIGHT = 300;

const correctSize = (width: number, height: number) => {
  if (width > MAX_WIDTH) {
    height = height * (MAX_WIDTH / width);
    width = MAX_WIDTH;
  }

  if (height > MAX_HEIGHT) {
    width = width * (MAX_HEIGHT / height);
    height = MAX_HEIGHT;
  }

  return { width, height };
};

export default function Page() {
  const [info, setInfo] = useState<{
    src: string;
    alt: string;
    width: number;
    height: number;
  }>();

  const getFileInfo = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const image = new Image();
      image.src = reader.result as string;
      image.onload = () => {
        setInfo({
          src: reader.result as string,
          alt: file.name,
          ...correctSize(image.width, image.height),
        });
      };
    };
  };

  return (
    <div className="flex justify-center items-center w-dvw h-dvh">
      <div className="flex flex-col flex-1 h-full items-center justify-center">
        <h1 className="text-5xl font-bold">ICO's Better Than Ever</h1>
        <p className="text-2xl">Lorem ipsum dolor sit amet.</p>
      </div>
      <div className="flex flex-col flex-1 h-full items-center justify-center gap-4">
        <DropZone onChange={getFileInfo}>
          <div className="flex flex-col justify-center items-center  p-5 gap-2 ">
            <h1 className="text-4xl font-bold">Drop your image here</h1>
            <p className="text-xl">Or click to select an image</p>
            <Upload className="w-8 h-8 mx-4" />
          </div>
          {/* TODO: fix dashArray */}
          <AnimatedBorder borderRadius={15} dashArray="10 10" />
        </DropZone>
        {info && <NextImage {...info} />}
      </div>
    </div>
  );
}
