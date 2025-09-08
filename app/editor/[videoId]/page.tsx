"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { VideoTimelineEditor } from "@/components/video-timeline-editor"
import { ExportDialog } from "@/components/export-dialog"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function VideoEditorPage() {
  const params = useParams()
  const router = useRouter()
  const [video, setVideo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentExportData, setCurrentExportData] = useState<any>(null)

  useEffect(() => {
    const loadVideo = async () => {
      try {
        const userId = localStorage.getItem("coconutz_user_id")
        if (!userId) {
          router.push("/editor")
          return
        }

        const response = await fetch(`/api/video/list?userId=${userId}`)
        const data = await response.json()

        if (response.ok) {
          const foundVideo = data.videos.find((v: any) => v.id === params.videoId)
          if (foundVideo) {
            setVideo(foundVideo)
          } else {
            router.push("/editor")
          }
        }
      } catch (error) {
        console.error("Failed to load video:", error)
        router.push("/editor")
      } finally {
        setIsLoading(false)
      }
    }

    loadVideo()
  }, [params.videoId, router])

  const handleSave = async (editData: any) => {
    try {
      // Save edit data to blob storage
      const response = await fetch("/api/video/save-edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      })

      if (response.ok) {
        alert("Project saved successfully!")
      } else {
        alert("Failed to save project")
      }
    } catch (error) {
      alert("Error saving project")
    }
  }

  const handleExport = async (exportData: any) => {
    setCurrentExportData(exportData)
  }

  const handleExportStart = (settings: any) => {
    console.log("Export started with settings:", settings)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading video editor...</div>
      </div>
    )
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Video not found</div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-700 bg-black/20 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button onClick={() => router.push("/editor")} className="bg-gray-700 hover:bg-gray-600 text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Library
            </Button>
            <div>
              <h1 className="text-xl font-bold text-cyan-400">Editing: {video.filename}</h1>
              <p className="text-gray-300 text-sm">{(video.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
          </div>
          {currentExportData && <ExportDialog exportData={currentExportData} onExportStart={handleExportStart} />}
        </div>
      </div>

      {/* Timeline Editor */}
      <div className="flex-1">
        <VideoTimelineEditor video={video} onSave={handleSave} onExport={handleExport} />
      </div>
    </div>
  )
}
