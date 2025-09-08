import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const editData = await request.json()

    if (!editData.videoId) {
      return NextResponse.json({ error: "Video ID required" }, { status: 400 })
    }

    const editId = crypto.randomUUID()
    const editRecord = {
      id: editId,
      ...editData,
      savedAt: new Date().toISOString(),
    }

    await put(`video-edits/${editId}.json`, JSON.stringify(editRecord), {
      access: "public",
    })

    return NextResponse.json({
      success: true,
      editId,
      message: "Edit saved successfully!",
    })
  } catch (error) {
    console.error("Save edit error:", error)
    return NextResponse.json({ error: "Failed to save edit" }, { status: 500 })
  }
}
