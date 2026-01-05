import { NextResponse } from "next/server";
var env = process.env;

export async function GET() {
    return NextResponse.json(
        {
            version: env.APP_VERSION || 'dev',
            api: env.API_VERSION || 'dev',
        }
    );
}