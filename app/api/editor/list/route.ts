import { list } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const { blobs } = await list({
      prefix: "editor/",
    })

    const files = blobs.map((blob) => ({
      ...blob,
      filename: blob.pathname.replace("editor/", "") || "unknown",
    }))

    return NextResponse.json({ files })
  } catch (error) {
    console.error("Error listing files:", error)
    return NextResponse.json({ error: "Failed to list files" }, { status: 500 })
  }
}
