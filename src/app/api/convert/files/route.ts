import { NextRequest, NextResponse } from "next/server";
import toIco from "to-ico";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const files = formData.getAll("files") as File[];
  console.log("files:", files);

  const pngArrayBuffers = await Promise.all(
    files.map((file) => file.arrayBuffer())
  );

  console.log("pngArrayBuffers:", pngArrayBuffers);

  const pngBuffers = pngArrayBuffers.map((buffer) => Buffer.from(buffer));

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
