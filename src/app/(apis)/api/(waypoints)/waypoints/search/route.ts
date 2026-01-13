import { Waypoints } from "@/server/waypoints/waypoints";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query) {
        return NextResponse.json(
            { 
                success: false,
                error: "Missing required parameters"
            },
            { status: 400 }
        );
    }

    try {
        const waypoints = await Waypoints.search(query);

        return NextResponse.json(
            { 
                success: true,
                license: 'CC BY-NC 4.0',
                waypoints 
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
