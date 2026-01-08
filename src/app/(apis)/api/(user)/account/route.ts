import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { Users } from "@/server/user/user";

import { uploadFile } from "@/server/s3"
import { _success } from "zod/v4/core";

// Edit account details
export async function PATCH(request: NextRequest) {

    // Check session
    const session = await auth();

    if (!session) {

        return NextResponse.json(
            {
                success: false,
                error: "Unauthorized"
            },
            { status: 401 }
        );

    }

    // Fetch changes
    const {
        handle,
        displayname,
        bio,
        picture
    } = await request.json();

    if (!handle && !displayname && !bio && !picture) {

        return NextResponse.json(
            {
                success: false,
                error: "No account changes requested."
            },
            { status: 400 }
        );

    }

    // Is handle empty

    if (handle.trim().length === 0) {

        return NextResponse.json(
            {
                success: false,
                error: "Username cannot be empty."
            },
            { status: 400 }
        );

    }

    // Is display name empty

    if (displayname.trim().length === 0) {
        return NextResponse.json(
            {
                success: false,
                error: "Display name cannot be empty."
            },
            { status: 400 }
        );
    }

    // Check handle properties

    if (handle) {

        // Is username permitted

        const normalizedHandle = handle.trim().toLowerCase();
        const HANDLE_REGEX = /^[a-z0-9_]{5,20}$/;

        if (!HANDLE_REGEX.test(normalizedHandle)) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Usernames must be at least 5 characters and may only contain letters, numbers, and underscores."
                },
                { status: 400 }
            );
        }

        if (normalizedHandle.includes("__")) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Usernames cannot contain consecutive underscores."
                },
                { status: 400 }
            );
        }

        // Is username reserved

        const isReserved = await Users.isHandleReserved(handle);

        if (isReserved) {

            return NextResponse.json(
                {
                    success: false,
                    error: `The username '${handle}' is reserved, please choose another.`
                },
                { status: 400 }
            );

        }

        // Is username taken

        const isTaken = await Users.isHandleTaken(handle, session.user.id);

        if (isTaken) {

            return NextResponse.json(
                {
                    success: false,
                    error: `The username '${handle}' is already taken, please choose another.`
                },
                { status: 400 }
            );

        }

    }

    // Update user
    try {

        const updatedUser = await Users.edit(
            session.user.id,
            {
                handle: handle,
                displayName: displayname,
                bio,
                image: picture,
            }
        );

        return NextResponse.json(
            {
                success: true,
                user: updatedUser
            },
            { status: 200 }
        );

    }

    catch (error: any) {

        return NextResponse.json(
            {
                success: false,
                error: `Error while updating id ${session.user.id}: ${error.message}.`
            },
            { status: 500 }
        );

    }

}

// Create account profile picture

export async function POST(req: Request) {

    // Check session
    const session = await auth();

    if (!session) {

        return NextResponse.json(
            {
                success: false,
                error: "Unauthorized"
            },
            { status: 401 }
        );

    }

    try {

        const file = (await req.formData()).get("file") as File;

        // Check presence of file
        if (!file) {
            return NextResponse.json(
                {
                    success: false,
                    error: "No file uploaded"
                },
                { status: 400 }
            );
        }

        const buffer = Buffer.from(await file.arrayBuffer())
        const key = `profile_images/${session.user.id}-${Date.now()}-${file.name}`

        // Upload profile image to S3
        const result = await uploadFile(key, buffer, file.type)

        return NextResponse.json(
            {
                success: true,
                url: result.url
            },
            { status: 200 }
        );

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);

        return NextResponse.json(
            {
                success: false,
                error: `Failed to upload profile image of id ${session.user.id}: ${errorMessage}.`
            },
            { status: 500 }
        );
    }
}