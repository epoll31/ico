import NextImage from "next/image";
import { useEffect, useState } from "react";

type Size = 16 | 32 | 64 | 128 | 256;
interface ImagePreviewProps {
  file: File; // TODO: File or URL?
  size: Size;
}

0;

interface Dimensions {
  width: number;
  height: number;
}

const correctSize = (
  { width, height }: Dimensions,
  size: 16 | 32 | 64 | 128 | 256
) => {
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

  return info && <NextImage {...info} />;
}
