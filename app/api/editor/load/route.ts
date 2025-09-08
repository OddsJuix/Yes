import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get("url")

    if (!url) {
      return NextResponse.json({ error: "File URL is required" }, { status: 400 })
    }

    // Fetch the file content from the blob URL
    const response = await fetch(url)

    if (!response.ok) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    const content = await response.text()

    return NextResponse.json({
      content,
      success: true,
    })
  } catch (error) {
    console.error("Load error:", error)
    return NextResponse.json({ error: "Load failed" }, { status: 500 })
  }
}
