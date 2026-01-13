
import { NextResponse } from "next/server";
import { Users } from "@/server/user/user";

export async function GET() {
    try {

        const users = await Users.all();

        const mapped = users.map((u) => (
            {
                id: u.id,
                username: u.handle ?? u.name ?? "",
                displayName: u.displayName ?? u.name ?? "",
            }
        ));

        return NextResponse.json(
            {
                success: true,
                license: 'CC BY-NC 4.0',
                users: mapped
            }, 
            { status: 200 }
        );

    } 
    
    catch (err: any) {

        return NextResponse.json(
            { 
                success: false, 
                error: err?.message 
            },
            { status: 400 }
        );

    }
    
}

