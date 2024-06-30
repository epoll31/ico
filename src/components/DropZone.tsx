import cn from "@/utils/cn";
import AnimatedBorder from "./AnimatedBorder";

export default function DropZone({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-full h-full flex flex-col justify-center items-center relative",
        // "border-2 border-dashed border-gray-400",
        className
      )}
    >
      <AnimatedBorder />
      <div className="flex-col justify-center items-center w-full h-full p-5 ">
        <h1 className="text-4xl font-bold">Drop your files here</h1>
        <p className="text-xl">Or click to select files</p>
      </div>
    </div>
  );
}
