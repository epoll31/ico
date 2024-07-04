import Image from "next/image";
import { useMemo } from "react";

export const Sizes = [16, 24, 32, 48, 64, 128, 256] as const;
export type Size = (typeof Sizes)[number];

export default function ImagePreview({
  file,
  size,
}: {
  file: File | string;
  size: Size;
}) {
  const src = useMemo(() => {
    if (typeof file === "string") {
      return file;
    } else {
      return URL.createObjectURL(file);
    }
  }, [file]);

  return (
    file && (
      <div className="relative h-full border-[5px] border-blue-500 rounded-2xl p-5 flex gap-4">
        <Image
          className=""
          src={src}
          alt={`icon ${size}x${size}`}
          width={size}
          height={size}
          style={{ width: size, height: size }}
        />
        <h1 className="text-2xl font-semibold">
          {size}x{size}
        </h1>
      </div>
    )
  );
}
