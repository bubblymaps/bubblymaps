import { BoundingBoxes, type BoundingBoxData } from "@/server/boundingboxes/boundingboxes";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/server/auth";

export async function GET() {
  try {

    // Fetch bounding boxes
    const boundingBoxes = await BoundingBoxes.getAll();

    // Return
    return NextResponse.json(
      {
        success: true,
        license: "CC BY-NC 4.0",
        boundingBoxes
      },
      { status: 200 }
    );

  }

  catch (err: any) {

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch bounding boxes"
      },
      { status: 500 }
    );

  }

}

export async function POST(req: NextRequest) {
  const session = await auth();
  const apiToken = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const expectedToken = process.env.API_TOKEN;
  const hasApiToken = !!apiToken && !!expectedToken && apiToken === expectedToken;
  const isModerator = session?.user?.moderator === true;

  if (!hasApiToken && !isModerator) {

    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized"
      },
      { status: 401 }
    );

  }

  try {
    const data: BoundingBoxData = await req.json();

    // Validate fields
    if (!data.name || !data.coordinates) {

      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields"
        },
        { status: 400 }
      );

    }

    // Validate format
    if (!Array.isArray(data.coordinates) || !Array.isArray(data.coordinates[0])) {

      return NextResponse.json(
        {
          success: false,
          error: "Invalid format"
        },
        { status: 400 }
      );

    }

    // Create bounding box
    const boundingBox = await BoundingBoxes.create(data);

    // Return
    return NextResponse.json(
      {
        success: true,
        boundingBox
      },
      { status: 201 }
    );

  }

  catch (err: any) {

    return NextResponse.json(
      {
        success: false,
        error: err.message
      },
      { status: 500 }
    );

  }

}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  const apiToken = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const expectedToken = process.env.API_TOKEN;
  const hasApiToken = !!apiToken && !!expectedToken && apiToken === expectedToken;
  const isModerator = session?.user?.moderator === true;

  if (!hasApiToken && !isModerator) {

    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized"
      },
      { status: 401 }
    );

  }

  try {
    const { id } = await req.json();

    // Validate id
    if (!id || typeof id !== 'number') {

      return NextResponse.json(
        {
          success: false,
          error: "Missing or invalid id"
        },
        { status: 400 }
      );

    }

    // Delete bounding box
    await BoundingBoxes.delete(id);

    // Return
    return NextResponse.json(
      {
        success: true,
        message: "Bounding box deleted"
      },
      { status: 200 }
    );

  }

  catch (err: any) {

    return NextResponse.json(
      {
        success: false,
        error: err.message
      },
      { status: 500 }
    );

  }

}