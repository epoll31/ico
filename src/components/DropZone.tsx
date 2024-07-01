"use client";

import cn from "@/utils/cn";
import AnimatedBorder from "./AnimatedBorder";
import Upload from "./icons/upload";
import { useEffect, useState } from "react";

export default function DropZone({
  className,
  onChange,
}: {
  className?: string;
  onChange?: (file: File, type: "drop" | "click") => void;
}) {
  const [result, setResult] = useState<{
    file: File;
    type: "drop" | "click";
  }>();

  const requestFile = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.style.display = "none";
    fileInput.multiple = false;

    fileInput.click();

    fileInput.onchange = (e: any) => {
      const file = e.target.files[0] as File;
      if (file) {
        setResult({
          file,
          type: "click",
        });
      } else {
        throw new Error("No file selected");
      }
    };
  };

  const handleClick = async () => {
    requestFile();
  };

  const handleDrop = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) {
      setResult({
        file,
        type: "drop",
      });
    } else {
      throw new Error("No file selected");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  useEffect(() => {
    if (result) {
      onChange?.(result.file, result.type);
    }
  }, [result]);

  return (
    <button
      className={cn(
        " flex flex-col justify-center items-center relative",
        className
      )}
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <AnimatedBorder />
      <div className="flex flex-col justify-center items-center  p-5 gap-2 ">
        <h1 className="text-4xl font-bold">Drop your image here</h1>
        <p className="text-xl">Or click to select an image</p>
        <Upload className="w-8 h-8 mx-4" />
      </div>
    </button>
  );
}
