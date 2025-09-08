"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SignupForm } from "@/components/signup-form"
import { VideoUpload } from "@/components/video-upload"

export default function EditorPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [username, setUsername] = useState("")
  const [userId, setUserId] = useState("")
  const [videos, setVideos] = useState<any[]>([])

  useEffect(() => {
    const storedUserId = localStorage.getItem("coconutz_user_id")
    const storedUsername = localStorage.getItem("coconutz_username")

    if (storedUserId && storedUsername) {
      setIsAuthenticated(true)
      setUsername(storedUsername)
      setUserId(storedUserId)
      loadUserVideos(storedUserId)
    }
    setIsLoading(false)
  }, [])

  const loadUserVideos = async (userId: string) => {
    try {
      const response = await fetch(`/api/video/list?userId=${userId}`)
      const data = await response.json()
      if (response.ok) {
        setVideos(data.videos)
      }
    } catch (error) {
      console.error("Failed to load videos:", error)
    }
  }

  const handleSignupSuccess = (userId: string) => {
    setIsAuthenticated(true)
    setUsername(localStorage.getItem("coconutz_username") || "")
    setUserId(userId)
  }

  const handleUploadSuccess = (video: any) => {
    setVideos((prev) => [video, ...prev])
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <SignupForm onSignupSuccess={handleSignupSuccess} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black text-white">
      {/* Header */}
      <div className="border-b border-gray-700 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-cyan-400">Coconutz Video Editor</h1>
              <p className="text-gray-300 text-sm">Welcome back, {username}!</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  localStorage.removeItem("coconutz_user_id")
                  localStorage.removeItem("coconutz_username")
                  setIsAuthenticated(false)
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white border-0 rounded-xl px-4 py-2"
              >
                Sign Out
              </Button>
              <Link href="/">
                <Button className="bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 text-white border-0 rounded-xl px-6 py-2">
                  Back to Main
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Video Upload Interface and Video Library */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <VideoUpload userId={userId} onUploadSuccess={handleUploadSuccess} />
          </div>

          {/* Video Library */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Your Videos ({videos.length})</h3>

              {videos.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 mb-2">No videos uploaded yet</p>
                  <p className="text-gray-500 text-sm">Upload your first video to get started!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {videos.map((video) => (
                    <div key={video.id} className="bg-gray-700/50 rounded-lg p-4">
                      <video
                        src={video.url}
                        className="w-full h-32 object-cover rounded mb-3"
                        controls={false}
                        poster=""
                      />
                      <h4 className="text-white font-medium text-sm mb-1 truncate">{video.filename}</h4>
                      <p className="text-gray-400 text-xs">
                        {(video.size / (1024 * 1024)).toFixed(2)} MB • {new Date(video.uploadDate).toLocaleDateString()}
                      </p>
                      <Button
                        className="w-full mt-3 bg-cyan-500 hover:bg-cyan-600 text-white text-sm"
                        onClick={() => {
                          window.location.href = `/editor/${video.id}`
                        }}
                      >
                        Edit Video
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
