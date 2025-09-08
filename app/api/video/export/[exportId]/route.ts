import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { exportId: string } }) {
  try {
    const { exportId } = params

    // Fetch export job status from blob storage
    const response = await fetch(`https://blob.vercel-storage.com/exports/${exportId}.json`)

    if (!response.ok) {
      return NextResponse.json({ error: "Export job not found" }, { status: 404 })
    }

    const exportJob = await response.json()

    return NextResponse.json(exportJob)
  } catch (error) {
    console.error("Get export status error:", error)
    return NextResponse.json({ error: "Failed to get export status" }, { status: 500 })
  }
}
