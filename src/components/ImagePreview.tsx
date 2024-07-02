import NextImage from "next/image";
import { useEffect, useState } from "react";
import AnimatedBorder from "./AnimatedBorder";

export const Sizes = [16, 24, 32, 48, 64, 96, 128, 256] as const;
export type Size = (typeof Sizes)[number];
interface ImagePreviewProps {
  file: File; // TODO: File or URL?
  size: Size;
}

0;

interface Dimensions {
  width: number;
  height: number;
}

const correctSize = ({ width, height }: Dimensions, size: Size) => {
  if (width < size) {
    height = height * (size / width);
    width = size;
  }

  if (height < size) {
    width = width * (size / height);
    height = size;
  }

  if (width > size) {
    height = height * (size / width);
    width = size;
  }

  if (height > size) {
    width = width * (size / height);
    height = size;
  }

  return { width, height };
};

export default function ImagePreview({ file, size }: ImagePreviewProps) {
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
          ...correctSize(image, size),
        });
      };
    };
  };

  useEffect(() => {
    getFileInfo(file);
  }, [file]);

  return (
    info && (
      <div className="relative h-full border-[5px] border-blue-500 rounded-2xl p-5 flex gap-4">
        <NextImage
          className=""
          {...info}
          style={{ width: size, height: size }}
        />
        <h1 className="text-2xl font-semibold">
          {size}x{size}
        </h1>
      </div>
    )
  );
}
