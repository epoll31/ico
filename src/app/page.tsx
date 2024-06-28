"use client";
import React, { useState } from "react";

export default function ConvertToIco() {
  const [file, setFile] = useState<File | null>(null);
  const [sizes, setSizes] = useState<number[]>([16, 32, 48]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSizesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sizeArray = e.target.value
      .split(",")
      .map((size) => parseInt(size.trim()));
    setSizes(sizeArray);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);

    try {
      // Convert file to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });

      const response = await fetch("/api/convert-to-ico", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pngBase64: base64,
          sizes: JSON.stringify(sizes),
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "icon.ico";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        const error = await response.json();
        console.error("Conversion failed:", error.message);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" accept=".png" onChange={handleFileChange} />
      <input
        type="text"
        value={sizes.join(", ")}
        onChange={handleSizesChange}
        placeholder="Enter sizes (e.g., 16, 32, 48)"
      />
      <button type="submit" disabled={!file || loading}>
        {loading ? "Converting..." : "Convert to ICO"}
      </button>
    </form>
  );
}
