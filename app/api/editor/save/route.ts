import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { filename, content } = await request.json()

    if (!filename || content === undefined) {
      return NextResponse.json({ error: "Filename and content are required" }, { status: 400 })
    }

    // Create a file from the content
    const file = new File([content], filename, { type: "text/plain" })

    // Upload to Vercel Blob with editor/ prefix
    const blob = await put(`editor/${filename}`, file, {
      access: "public",
    })

    return NextResponse.json({
      url: blob.url,
      filename,
      size: file.size,
      success: true,
    })
  } catch (error) {
    console.error("Save error:", error)
    return NextResponse.json({ error: "Save failed" }, { status: 500 })
  }
}
