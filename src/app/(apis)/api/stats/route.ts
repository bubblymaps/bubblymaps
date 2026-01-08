import { NextResponse } from "next/server";
import { db } from "@/server/db";

export async function GET() {
	try {

		const [totalWaypoints,
			totalVerifiedWaypoints,
			totalUsers,
			totalReviews,
			totalContributions
		] = await Promise.all(
			[
				db.bubbler.count(),
				db.bubbler.count({ where: { verified: true } }),
				db.user.count(),
				db.review.count(),
				db.bubblerLog.count(),
			]
		);

		return NextResponse.json(
			{
				success: true,
				totalWaypoints,
				totalVerifiedWaypoints,
				totalUsers,
				totalReviews,
				totalContributions
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