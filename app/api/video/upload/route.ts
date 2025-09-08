import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("video") as File
    const userId = formData.get("userId") as string

    if (!file) {
      return NextResponse.json({ error: "No video file provided" }, { status: 400 })
    }

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    // Check file type
    if (!file.type.startsWith("video/")) {
      return NextResponse.json({ error: "File must be a video" }, { status: 400 })
    }

    // Check file size (limit to 100MB)
    if (file.size > 100 * 1024 * 1024) {
      return NextResponse.json({ error: "Video file too large (max 100MB)" }, { status: 400 })
    }

    const filename = `${userId}/${Date.now()}-${file.name}`

    const blob = await put(`videos/${filename}`, file, {
      access: "public",
    })

    // Store video metadata
    const videoData = {
      id: crypto.randomUUID(),
      userId,
      filename: file.name,
      size: file.size,
      type: file.type,
      url: blob.url,
      uploadDate: new Date().toISOString(),
      duration: null, // Will be set by frontend
    }

    await put(`video-metadata/${videoData.id}.json`, JSON.stringify(videoData), {
      access: "public",
    })

    return NextResponse.json({
      success: true,
      video: videoData,
      message: "Video uploaded successfully!",
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Failed to upload video" }, { status: 500 })
  }
}
