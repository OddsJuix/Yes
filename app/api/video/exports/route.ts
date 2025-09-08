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
      prefix: "exports/",
    })

    const userExports = []

    for (const blob of blobs) {
      try {
        const response = await fetch(blob.url)
        const exportData = await response.json()

        // Filter by user ID (assuming it's stored in the export data)
        if (exportData.userId === userId) {
          userExports.push(exportData)
        }
      } catch (error) {
        console.error("Error fetching export data:", error)
      }
    }

    // Sort by creation date (newest first)
    userExports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({ exports: userExports })
  } catch (error) {
    console.error("List exports error:", error)
    return NextResponse.json({ error: "Failed to list exports" }, { status: 500 })
  }
}
