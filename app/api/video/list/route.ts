import { list } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const { blobs } = await list({
      prefix: "video-metadata/",
    })

    const userVideos = []

    for (const blob of blobs) {
      try {
        const response = await fetch(blob.url)
        const videoData = await response.json()

        if (videoData.userId === userId) {
          userVideos.push(videoData)
        }
      } catch (error) {
        console.error("Error fetching video metadata:", error)
      }
    }

    // Sort by upload date (newest first)
    userVideos.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())

    return NextResponse.json({ videos: userVideos })
  } catch (error) {
    console.error("List videos error:", error)
    return NextResponse.json({ error: "Failed to list videos" }, { status: 500 })
  }
}
