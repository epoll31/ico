import DropZone from "@/components/DropZone";

export default function Page() {
  return (
    <div className="flex justify-center items-center w-dvw h-dvh">
      <div className="flex flex-col flex-1 h-full bg-green-200 items-center justify-center">
        <h1 className="text-5xl font-bold">ICO's Better Than Ever</h1>
        <p className="text-2xl">Lorem ipsum dolor sit amet.</p>
      </div>
      <div className="flex flex-col flex-1 h-full bg-blue-200 items=center justify-center">
        <DropZone className="w-80 h-60" />
      </div>
    </div>
  );
}
