import { NextResponse } from "next/server"
import { auth } from "@/server/auth"
import { uploadFile } from "@/server/s3"

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const key = `profile_images/${session.user.id}-${Date.now()}-${file.name}`

    const result = await uploadFile(key, buffer, file.type)

    if (!result.success) {
      console.error("[Upload] Failed to upload file:", result.error)
      const errorMessage = result.error instanceof Error ? result.error.message : String(result.error);
      return NextResponse.json({ error: `Failed to upload file: ${errorMessage}` }, { status: 500 })
    }

    return NextResponse.json({ url: result.url })
  } catch (error) {
    console.error("[Upload] Internal server error:", error)
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: `Internal server error: ${errorMessage}` }, { status: 500 })
  }
}