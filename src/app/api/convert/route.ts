import { NextRequest, NextResponse } from "next/server";
import toIco from "to-ico";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const pngFile = formData.get("pngFile") as File;
  const sizes = JSON.parse(formData.get("sizes") as string);

  console.log("Converting to ICO...");
  console.log(pngFile, sizes);

  const pngArrayBuffer = await pngFile.arrayBuffer();
  const pngBuffer = Buffer.from(pngArrayBuffer);

  try {
    const icoBuffer = await toIco([pngBuffer], { sizes });

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
