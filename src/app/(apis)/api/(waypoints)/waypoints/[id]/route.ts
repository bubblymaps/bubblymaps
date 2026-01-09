import { NextRequest, NextResponse } from "next/server";
import { Waypoints } from "@/server/waypoints/waypoints";
import { auth } from "@/server/auth"
import type { WaypointUpdateData } from "@/server/waypoints/waypoints";
import { canEditWaypoint, awardXP } from "@/server/xp/exp";
import { XP_REQUIRED } from "@/server/xp/config";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idStr } = await params;
  const id = parseInt(idStr, 10);

  // Invalid ID
  if (isNaN(id)) {

    return NextResponse.json(
      {
        success: false,
        error: "Invalid arguments"
      },
      { status: 400 }
    );

  }

  try {
    const waypoint = await Waypoints.byId(id);

    // Not found
    if (!waypoint) {

      return NextResponse.json(
        {
          success: false,
          error: "Waypoint not found"
        },
        { status: 404 }
      );

    }

    // Fetch logs
    const waypointLogs = await Waypoints.fetchLogs(id);

    return NextResponse.json(
      {
        success: true,
        waypoint,
        logs: waypointLogs
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
      { status: 400 }
    );

  }
}

export async function PATCH(
  req: NextRequest,
  context: {
    params: Promise<{ id: string }>
  }
) {

  // Auth
  const session = await auth();
  const apiToken = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const expectedToken = process.env.API_TOKEN || process.env.API_KEY;
  const hasApiToken = !!apiToken && !!expectedToken && apiToken === expectedToken;

  // Unauthorized
  if (!session && !hasApiToken) {

    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized"
      },
      { status: 401 }
    );

  }

  // No XP
  if (session?.user?.id) {
    const allowed = await canEditWaypoint(session.user.id);

    if (!session.user.moderator && !allowed) {

      return NextResponse.json(
        {
          success: false,
          error: `Insufficient XP. Required: ${XP_REQUIRED.EDIT_WAYPOINT}`
        },
        { status: 403 }
      );

    }
  }

  const { id: idStr } = await context.params;
  const id = parseInt(idStr, 10);

  // Invalid ID
  if (isNaN(id)) {

    return NextResponse.json(
      {
        success: false,
        error: "Invalid waypoint ID"
      },
      { status: 400 }
    );

  }

  try {

    const data = await req.json() as Partial<WaypointUpdateData>;

    const allowedFields = [
      "name", "latitude", "longitude", "description",
      "amenities", "image", "maintainer", "region"
    ];

    // Allow admin fields if token/moderator
    if (hasApiToken || session?.user?.moderator) {
      allowedFields.push("approved", "verified", "addedByUserId");
    }

    // Add data
    const filteredData: Partial<WaypointUpdateData> = {};
    for (const key of allowedFields) {
      if (key in data) filteredData[key as keyof WaypointUpdateData] = data[key as keyof WaypointUpdateData] as any;
    }

    const userId = session?.user?.id || (hasApiToken ? 'api' : null);
    const updatedWaypoint = await Waypoints.edit(id, filteredData as WaypointUpdateData, userId);

    // Award XP
    if (session?.user?.id) {
      await awardXP(session.user.id, 'EDIT_WAYPOINT');
    }

    return NextResponse.json(
      {
        success: true,
        updatedWaypoint
      },
      { status: 200 }
    );

  } catch (err: any) {

    return NextResponse.json(
      {
        success: false,
        error: err.message
      },
      { status: 400 }
    );

  }
}

export async function DELETE(
  req: NextRequest,
  context: {
    params: Promise<{ id: string }>
  }
) {

  // Auth
  const apiToken = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const expectedToken = process.env.API_TOKEN || process.env.API_KEY;
  const hasApiToken = !!apiToken && !!expectedToken && apiToken === expectedToken;

  if (!hasApiToken) {

    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized"
      },
      { status: 401 }
    );

  }

  const { id: idStr } = await context.params;
  const id = parseInt(idStr, 10);

  // Invalid ID
  if (isNaN(id)) {

    return NextResponse.json(
      {
        success: false,
        error: "Invalid waypoint ID"
      },
      { status: 400 }
    );

  }

  try {

    const deletedWp = await Waypoints.delete(id, 'api');

    return NextResponse.json(
      {
        success: true,
        result: deletedWp
      },
      { status: 200 }
    );

  } catch (err: any) {

    return NextResponse.json(
      {
        success: false,
        error: err.message
      },
      { status: 400 }
    );

  }
}