import { Waypoints, type WaypointData } from "@/server/waypoints/waypoints";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { awardXP, canCreateWaypoint } from "@/server/xp/exp";
import { XP_REQUIRED } from "@/server/xp/config";

export async function GET() {
  const waypoints = await Waypoints.getAll();

  return NextResponse.json(
    {
      success: true,
      license: "CC BY-NC 4.0",
      author: "Linus Kang (mail@linus.id.au)",
      waypoints
    },
    { status: 200 }
  );

}

export async function POST(req: NextRequest) {

  const session = await auth();
  const apiToken = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const expectedToken = process.env.API_TOKEN;
  const hasApiToken = !!apiToken && !!expectedToken && apiToken === expectedToken;

  if (!session && !hasApiToken) {

    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized"
      },
      { status: 401 }
    );

  }

  try {

    const data = await req.json();

    const allowedFields = [
      "name",
      "latitude",
      "longitude",
      "description",
      "amenities",
      "image",
      "maintainer",
      "region",
    ];

    // Allow admin fields if token/moderator
    if (hasApiToken || session?.user?.moderator) {
      allowedFields.push("approved", "verified", "addedByUserId");
    }

    const filteredData: any = {};

    for (const field of allowedFields) {
      if (data[field] !== undefined) filteredData[field] = data[field];
    }

    // Set addedByUserId
    if (session?.user?.id) {
      filteredData.addedByUserId = session.user.id;
    } else if (hasApiToken) {
      filteredData.addedByUserId = data.addedByUserId ?? "api";
    }

    // Validate latitude and longitude
    if (
      typeof filteredData.latitude !== "number" ||
      typeof filteredData.longitude !== "number" ||
      filteredData.latitude < -90 ||
      filteredData.latitude > 90 ||
      filteredData.longitude < -180 ||
      filteredData.longitude > 180
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid latitude or longitude"
        },
        { status: 400 }
      );
    }

    // Check XP
    if (session?.user?.id) {

      const allowed = await canCreateWaypoint(session.user.id);

      if (!allowed) {

        return NextResponse.json(
          {
            success: false,
            error: `Forbidden. Required XP: ${XP_REQUIRED.CREATE_WAYPOINT}`
          },
          { status: 403 }
        );

      }

    }

    // Check required fields
    const requiredFields: (keyof WaypointData)[] = [
      "name",
      "latitude",
      "longitude",
      "addedByUserId",
    ];

    for (const field of requiredFields) {
      if (
        filteredData[field] === undefined ||
        filteredData[field] === null ||
        (typeof filteredData[field] === "string" && filteredData[field].trim() === "")
      ) {

        return NextResponse.json(
          {
            success: false,
            error: `Missing required field: ${field}`
          },
          { status: 400 }
        );

      }
    }

    // Add waypoint
    const newWaypoint = await Waypoints.add(filteredData as WaypointData);

    // Award XP
    if (session?.user?.id) {
      await awardXP(session.user.id, 'CREATE_WAYPOINT');
    }

    return NextResponse.json(
      {
        success: true,
        result: newWaypoint
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
      { status: 400 }
    );

  }
}