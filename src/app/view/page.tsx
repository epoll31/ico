"use client";

import { useState } from "react";
import ViewIco from "@/components/ViewICO";

export default function View() {
  const [icoFile, setIcoFile] = useState<File | undefined>(undefined);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    setIcoFile(file);
  };

  return (
    <main className="min-h-screen p-24">
      <h1 className="text-4xl font-bold mb-8">ICO Viewer</h1>
      <input
        type="file"
        accept=".ico"
        onChange={handleFileUpload}
        className="mb-8"
      />
      {icoFile && <ViewIco icoFile={icoFile} />}
    </main>
  );
}
