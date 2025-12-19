import { NextResponse } from "next/server";
import { db } from "@/server/db";

export async function GET() {
	try {
		const [totalWaypoints, totalVerifiedWaypoints, totalUsers, totalReviews, totalContributions] = await Promise.all([
			db.bubbler.count(),
			db.bubbler.count({ where: { verified: true } }),
			db.user.count(),
			db.review.count(),
			db.bubblerLog.count(),
		]);

		return NextResponse.json(
			{ totalWaypoints, totalVerifiedWaypoints, totalUsers, totalReviews, totalContributions },
			{ status: 200 }
		);
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : "Failed to fetch stats";
		console.error("Failed to fetch stats:", err);
		return NextResponse.json({ error: errorMessage }, { status: 500 });
	}
}