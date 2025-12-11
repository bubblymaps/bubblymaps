// POST /api/user/account/edit
// {
//   "username": "newUsername",
//   "displayname": "New Display Name",
//   "bio": "New bio text",
//   "picture": "https://example.com/image.jpg"
// }
//
// next-auth.session-token=YOUR_SESSION_TOKEN

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { Users } from "@/server/user";

export async function POST(request: NextRequest) {
    const session = await auth();

    if (!session) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    const edits = await request.json();
    const { handle, displayname, bio, picture } = edits;

    if (!handle && !displayname && !bio && !picture) {
        return NextResponse.json(
            { error: "No account changes requested" },
            { status: 400 }
        );
    }

    try {
        const updatedUser = await Users.edit(session.user.id, {
            handle: handle,
            displayName: displayname,
            bio,
            image: picture,
        });
        return NextResponse.json({ user: updatedUser });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to update user" },
            { status: 500 }
        );
    }
}
