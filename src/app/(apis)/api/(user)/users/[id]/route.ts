import { NextRequest, NextResponse } from "next/server";
import { Users } from "@/server/user/user";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params;

	if (!id) {

		return NextResponse.json(
			{
				success: false,
				error: "Missing user id",
			},
			{ status: 400 }
		);

	}

	try {
		const [user, contributions] = await Promise.all([
			Users.get(id),
			Users.getUserContributions(id),
		]);

		// Redact email and remove sensitive session data
		const safeUser = {
			...user,
			email: "",
			sessions: [],
			name: "",
			accounts: [],
			emailVerified: null,
		};

		return NextResponse.json(
			{
				success: true,
				license: 'CC BY-NC 4.0',
				user: safeUser,
				contributions,
			},
			{ status: 200 }
		);

	} 
	
	catch (err: any) {

		return NextResponse.json(
			{
				success: false,
				error: err?.message || String(err),
			},
			{ status: 400 }
		);

	}
}
