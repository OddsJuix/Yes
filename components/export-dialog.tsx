"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Download, Settings, CheckCircle, Clock, AlertCircle } from "lucide-react"

interface ExportDialogProps {
  exportData: any
  onExportStart: (settings: any) => void
}

export function ExportDialog({ exportData, onExportStart }: ExportDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [exportSettings, setExportSettings] = useState({
    format: "mp4",
    quality: "high",
    resolution: "1080p",
  })
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [exportStatus, setExportStatus] = useState<"idle" | "processing" | "completed" | "error">("idle")
  const [exportId, setExportId] = useState<string | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const handleExport = async () => {
    setIsExporting(true)
    setExportStatus("processing")
    setExportProgress(0)

    try {
      const response = await fetch("/api/video/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...exportData,
          ...exportSettings,
          userId: localStorage.getItem("coconutz_user_id"),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setExportId(data.exportId)
        onExportStart({ ...exportData, ...exportSettings })

        // Poll for export progress
        const pollInterval = setInterval(async () => {
          try {
            const statusResponse = await fetch(`/api/video/export/${data.exportId}`)
            const statusData = await statusResponse.json()

            if (statusResponse.ok) {
              setExportProgress(statusData.progress)

              if (statusData.status === "completed") {
                setExportStatus("completed")
                setDownloadUrl(statusData.downloadUrl)
                setIsExporting(false)
                clearInterval(pollInterval)
              } else if (statusData.status === "error") {
                setExportStatus("error")
                setIsExporting(false)
                clearInterval(pollInterval)
              }
            }
          } catch (error) {
            console.error("Error polling export status:", error)
          }
        }, 1000)

        // Cleanup interval after 2 minutes
        setTimeout(() => clearInterval(pollInterval), 120000)
      } else {
        setExportStatus("error")
        setIsExporting(false)
        alert(data.error || "Export failed")
      }
    } catch (error) {
      setExportStatus("error")
      setIsExporting(false)
      alert("Network error during export")
    }
  }

  const resetExport = () => {
    setIsExporting(false)
    setExportProgress(0)
    setExportStatus("idle")
    setExportId(null)
    setDownloadUrl(null)
  }

  const getStatusIcon = () => {
    switch (exportStatus) {
      case "processing":
        return <Clock className="h-5 w-5 text-yellow-400 animate-spin" />
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-400" />
      default:
        return <Download className="h-5 w-5" />
    }
  }

  const getStatusText = () => {
    switch (exportStatus) {
      case "processing":
        return "Processing video..."
      case "completed":
        return "Export completed!"
      case "error":
        return "Export failed"
      default:
        return "Ready to export"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 text-white">
          <Download className="h-4 w-4 mr-2" />
          Export Video
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Export Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Export Settings */}
          {exportStatus === "idle" && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Format</label>
                <Select
                  value={exportSettings.format}
                  onValueChange={(value) => setExportSettings({ ...exportSettings, format: value })}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="mp4">MP4</SelectItem>
                    <SelectItem value="mov">MOV</SelectItem>
                    <SelectItem value="avi">AVI</SelectItem>
                    <SelectItem value="webm">WebM</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Quality</label>
                <Select
                  value={exportSettings.quality}
                  onValueChange={(value) => setExportSettings({ ...exportSettings, quality: value })}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="low">Low (Fast)</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High (Slow)</SelectItem>
                    <SelectItem value="ultra">Ultra (Very Slow)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Resolution</label>
                <Select
                  value={exportSettings.resolution}
                  onValueChange={(value) => setExportSettings({ ...exportSettings, resolution: value })}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="480p">480p</SelectItem>
                    <SelectItem value="720p">720p (HD)</SelectItem>
                    <SelectItem value="1080p">1080p (Full HD)</SelectItem>
                    <SelectItem value="1440p">1440p (2K)</SelectItem>
                    <SelectItem value="2160p">2160p (4K)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* Export Progress */}
          {(exportStatus === "processing" || exportStatus === "completed" || exportStatus === "error") && (
            <Card className="bg-gray-700 border-gray-600">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  {getStatusIcon()}
                  {getStatusText()}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {exportStatus === "processing" && (
                  <div className="space-y-2">
                    <Progress value={exportProgress} className="w-full" />
                    <p className="text-xs text-gray-400 text-center">{exportProgress}% complete</p>
                  </div>
                )}

                {exportStatus === "completed" && downloadUrl && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-green-400" />
                    </div>
                    <Button
                      onClick={() => window.open(downloadUrl, "_blank")}
                      className="w-full bg-green-500 hover:bg-green-600 text-white"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Video
                    </Button>
                  </div>
                )}

                {exportStatus === "error" && (
                  <div className="text-center space-y-3">
                    <AlertCircle className="h-8 w-8 text-red-400 mx-auto" />
                    <p className="text-sm text-red-400">Export failed. Please try again.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            {exportStatus === "idle" && (
              <>
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300"
                >
                  Cancel
                </Button>
                <Button onClick={handleExport} className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white">
                  Start Export
                </Button>
              </>
            )}

            {(exportStatus === "completed" || exportStatus === "error") && (
              <>
                <Button
                  onClick={resetExport}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 bg-transparent"
                >
                  New Export
                </Button>
                <Button onClick={() => setIsOpen(false)} className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white">
                  Close
                </Button>
              </>
            )}

            {exportStatus === "processing" && (
              <Button onClick={() => setIsOpen(false)} className="w-full bg-gray-600 hover:bg-gray-500 text-white">
                Close (Export Continues)
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
