import { Waypoints, type WaypointData } from "@/server/waypoints/waypoints";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { awardXP, canCreateWaypoint } from "@/server/xp/exp";
import { XP_REQUIRED } from "@/server/xp/config";

/**
 * GET /api/waypoints
 * Returns all waypoints
 */
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

/**
 * POST /api/waypoints
 * Creates a new waypoint
 * 
 * Authentication:
 * - Requires either a valid session OR an API token in the Authorization header
 * 
 * API Token Usage Examples:
 * 
 * curl:
 * ```bash
 * curl -X POST https://your-domain.com/api/waypoints \
 *   -H "Content-Type: application/json" \
 *   -H "Authorization: Bearer YOUR_API_TOKEN" \
 *   -d '{
 *     "name": "Example Waypoint",
 *     "latitude": -33.87,
 *     "longitude": 151.21,
 *     "description": "A great location",
 *     "amenities": ["parking", "wifi"],
 *     "region": "Sydney"
 *   }'
 * ```
 * 
 * JavaScript/fetch:
 * ```javascript
 * fetch('https://your-domain.com/api/waypoints', {
 *   method: 'POST',
 *   headers: {
 *     'Content-Type': 'application/json',
 *     'Authorization': 'Bearer YOUR_API_TOKEN'
 *   },
 *   body: JSON.stringify({
 *     name: 'Example Waypoint',
 *     latitude: -33.87,
 *     longitude: 151.21,
 *     description: 'A great location',
 *     amenities: ['parking', 'wifi'],
 *     region: 'Sydney'
 *   })
 * });
 * ```
 * 
 * With API token, you can also set admin fields:
 * - `approved`: boolean
 * - `verified`: boolean
 * - `addedByUserId`: string (defaults to "api" if not provided)
 */
export async function POST(req: Request) {
  try {
    const session = await auth();
    const apiToken = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    const expectedToken = process.env.API_TOKEN;
    const hasApiToken = !!apiToken && !!expectedToken && apiToken === expectedToken;

    if (!session && !hasApiToken) {
      return NextResponse.json({ error: "Unauthorized: missing valid session or API token" }, { status: 401 });
    }

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

    // Allow API token or moderator users to set admin-only fields
    if (hasApiToken || session?.user?.moderator) {
      allowedFields.push("approved", "verified", "addedByUserId");
    }

     const filteredData: any = {};
    for (const field of allowedFields) {
      if (data[field] !== undefined) filteredData[field] = data[field];
    }

    if (session?.user?.id) {
      filteredData.addedByUserId = session.user.id;
    } else if (hasApiToken) {
      filteredData.addedByUserId = data.addedByUserId ?? "api";
    }

    // Enforce XP requirement for creating a waypoint for authenticated users
    if (session?.user?.id) {
      const allowed = await canCreateWaypoint(session.user.id);
      if (!allowed) {
        return NextResponse.json(
          { error: `Insufficient XP to create a waypoint. Required: ${XP_REQUIRED.CREATE_WAYPOINT}` },
          { status: 403 }
        );
      }
    }

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
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const newWaypoint = await Waypoints.add(filteredData as WaypointData);

    if (session?.user?.id) {
      await awardXP(session.user.id, 'CREATE_WAYPOINT');
    }

    return NextResponse.json(newWaypoint, { status: 201 });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to create waypoint";
    console.error("Error creating waypoint:", err);
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    );
  }
}