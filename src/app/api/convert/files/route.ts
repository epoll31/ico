import { NextRequest, NextResponse } from "next/server";
import toIco from "to-ico";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const blobs = formData.getAll("blobs") as Blob[];

  const pngBuffers = await Promise.all(
    blobs.map(async (blob) => {
      return Buffer.from(await blob.arrayBuffer());
    })
  );

  try {
    const icoBuffer = await toIco(pngBuffers);

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
