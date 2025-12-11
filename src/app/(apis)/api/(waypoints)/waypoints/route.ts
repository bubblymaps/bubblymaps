import { Waypoints } from "@/server/waypoints";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const waypoints = await Waypoints.getAll();

    return NextResponse.json(
        { 
            license: "CC BY-NC 4.0",
            author: "Linus Kang",
            waypoints 
        }
    );
}