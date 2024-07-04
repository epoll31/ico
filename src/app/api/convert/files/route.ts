import { NextRequest, NextResponse } from "next/server";
import toIco from "to-ico";

async function fetchPng(url: string) {
  console.log("fetchPng:", url);
  const response = await fetch(url);

  console.log("response.ok:", response.ok);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  console.log("response:", response);

  // const blob = await response.blob();
  const arrayBuffer = await response.arrayBuffer();

  console.log("arrayBuffer:", arrayBuffer);

  return Buffer.from(arrayBuffer);
}

export async function POST(req: NextRequest) {
  console.log("api/convert/files/route.ts");
  const formData = await req.formData();

  const urls = formData.getAll("urls") as Blob[];
  console.log("urls:", urls);

  const pngBuffers = await Promise.all(
    urls.map(async (blob) => {
      return Buffer.from(await blob.arrayBuffer());
    })
  );

  console.log("pngBuffers:", pngBuffers);

  try {
    const icoBuffer = await toIco(pngBuffers);
    // console.log("ICO buffer:", icoBuffer);

    // Create a Response with the ico buffer
    const response = new NextResponse(icoBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/x-icon",
        "Content-Disposition": 'attachment; filename="icon.ico"',
      },
    });

    return response;
  } catch (error) {
    console.error("Error converting to ICO:", error);
    return NextResponse.json(
      { success: false, error: "Conversion failed" },
      { status: 500 }
    );
  }
}
