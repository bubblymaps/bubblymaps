import { NextResponse } from "next/server";
import { Waypoints } from "@/server/waypoints/waypoints";

export async function GET(req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: idStr } = await context.params;
  try {
    const id = parseInt(idStr, 10);
    if (isNaN(id)) throw new Error("Invalid waypoint ID");

    const waypoint = await Waypoints.byId(id);
    const waypointLogs = await Waypoints.fetchLogs(id);
    if (!waypoint) return NextResponse.json({ error: "Waypoint not found" }, { status: 404 });

    return NextResponse.json({ waypoint, logs: waypointLogs });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to fetch waypoint";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}