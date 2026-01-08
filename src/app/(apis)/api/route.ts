import { NextResponse } from "next/server";
var env = process.env;

export async function GET() {
    return NextResponse.json(
        {
            success: true,
            version: env.APP_VERSION || 'dev',
            api: env.API_VERSION || 'dev',
            license: 'CC BY-NC 4.0',
            author: 'Linus Kang (mail@linus.id.au)'
        },
        { status: 200 }
    );
}