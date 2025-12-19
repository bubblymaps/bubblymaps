import { Waypoints } from "@/server/waypoints/waypoints";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query) {
        return NextResponse.json({ waypoints: [] });
    }

    try {
        const waypoints = await Waypoints.search(query);
        return NextResponse.json({ waypoints });
    } catch (error) {
        console.error("Search error:", error);
        return NextResponse.json({ error: "Failed to search waypoints" }, { status: 500 });
    }
}
