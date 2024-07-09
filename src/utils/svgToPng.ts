export async function svgToPng(imageUrl: string): Promise<string> {
  try {
    // Fetch the SVG content from the URL
    const response = await fetch(imageUrl);
    const svgContent = await response.text();

    // Create a Blob with the SVG content
    const svgBlob = new Blob([svgContent], { type: "image/svg+xml" });

    // Convert the SVG to PNG
    const pngDataUrl = await svgToPngBlob(svgBlob);

    return pngDataUrl;
  } catch (error) {
    throw new Error(
      `Failed to convert SVG to PNG: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

function svgToPngBlob(svgBlob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    // Create a new Image object
    const img = new Image();

    // Set up the onload handler for the image
    img.onload = () => {
      // Create a canvas element
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 256;

      // Get the 2D rendering context
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Unable to get 2D context"));
        return;
      }

      // Draw the image onto the canvas
      ctx.drawImage(img, 0, 0, 256, 256);

      // Convert the canvas to a PNG data URL
      const pngDataUrl = canvas.toDataURL("image/png");
      resolve(pngDataUrl);
    };

    // Set up error handling for the image
    img.onerror = () => {
      reject(new Error("Failed to load SVG"));
    };

    // Create a URL for the SVG Blob and set it as the image source
    img.src = URL.createObjectURL(svgBlob);
  });
}
