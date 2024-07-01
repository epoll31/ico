"use client";

import cn from "@/utils/cn";
import AnimatedBorder from "./AnimatedBorder";
import Upload from "./icons/upload";

export default function DropZone({ className }: { className?: string }) {
  const requestFile = async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.style.display = "none";
    fileInput.multiple = false;

    fileInput.click();

    fileInput.onchange = (e: any) => {
      const file = e.target.files[0] as File;
      if (file) {
        console.log(file);
      } else {
        throw new Error("No file selected");
      }
    };
  };

  const handleClick = () => {
    requestFile();
  };

  const handleDrop = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) {
      console.log(file);
    } else {
      throw new Error("No file selected");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

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
      <div className="flex flex-col justify-center items-center  p-5 gap-5 ">
        <h1 className="text-4xl font-bold">Drop your files here</h1>
        <p className="text-xl">Or click to select files</p>
        <Upload className="" />
      </div>
    </button>
  );
}
