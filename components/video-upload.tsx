"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, Play, Pause } from "lucide-react"

interface VideoUploadProps {
  userId: string
  onUploadSuccess: (video: any) => void
}

export function VideoUpload({ userId, onUploadSuccess }: VideoUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    const videoFile = files.find((file) => file.type.startsWith("video/"))

    if (videoFile) {
      handleFileSelect(videoFile)
    }
  }, [])

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Create video object URL for local storage
      const videoUrl = URL.createObjectURL(selectedFile)

      const videoData = {
        id: crypto.randomUUID(),
        userId,
        filename: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        url: videoUrl,
        uploadDate: new Date().toISOString(),
        duration: null,
        isLocal: true, // Flag to indicate this is stored locally
      }

      // Save video metadata to cookies
      const existingVideos = getVideosFromCookies()
      existingVideos.push(videoData)
      saveVideosToCookies(existingVideos)

      // Simulate upload progress for UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 100
          }
          return prev + 10
        })
      }, 100)

      setTimeout(() => {
        clearInterval(progressInterval)
        setUploadProgress(100)

        onUploadSuccess(videoData)
        setSelectedFile(null)
        setPreviewUrl(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }

        setIsUploading(false)
        setUploadProgress(0)
      }, 1500)
    } catch (error) {
      console.error("Upload error:", error)
      alert("Failed to process video")
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const getVideosFromCookies = () => {
    try {
      const videosData = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`coconutz_videos_${userId}=`))
        ?.split("=")[1]

      return videosData ? JSON.parse(decodeURIComponent(videosData)) : []
    } catch (error) {
      console.error("Failed to get videos from cookies:", error)
      return []
    }
  }

  const saveVideosToCookies = (videos: any[]) => {
    try {
      const expires = new Date()
      expires.setDate(expires.getDate() + 30)
      document.cookie = `coconutz_videos_${userId}=${encodeURIComponent(JSON.stringify(videos))}; expires=${expires.toUTCString()}; path=/`
    } catch (error) {
      console.error("Failed to save videos to cookies:", error)
    }
  }

  const clearSelection = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setIsPlaying(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-white mb-4">Upload Video</h3>
        <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-blue-300 text-sm">
            📝 Videos are now stored locally in your browser for privacy. Your editing progress is automatically saved
            as you work.
          </p>
        </div>

        {!selectedFile ? (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging ? "border-cyan-400 bg-cyan-400/10" : "border-gray-600 hover:border-gray-500"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-300 mb-2">Drag and drop your video here</p>
            <p className="text-gray-500 text-sm mb-4">or</p>
            <Button onClick={() => fileInputRef.current?.click()} className="bg-cyan-500 hover:bg-cyan-600 text-white">
              Choose File
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileInputChange}
              className="hidden"
            />
            <p className="text-gray-500 text-xs mt-4">Supported formats: MP4, MOV, AVI, WebM (Max: 100MB)</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                src={previewUrl || ""}
                className="w-full h-64 object-contain"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Button onClick={togglePlayPause} className="bg-black/50 hover:bg-black/70 text-white rounded-full p-3">
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-white">
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-gray-400">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
              <Button onClick={clearSelection} variant="ghost" className="text-gray-400 hover:text-white">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-300">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <Button
              onClick={handleUpload}
              disabled={isUploading}
              className="w-full bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 text-white"
            >
              {isUploading ? "Uploading..." : "Upload Video"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
