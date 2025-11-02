"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Pause, SkipBack, SkipForward, Scissors, Download, Save, Type, Palette, Volume2, Zap } from "lucide-react"

interface VideoTimelineEditorProps {
  video: {
    id: string
    filename: string
    url: string
    duration?: number
  }
  onSave?: (editedVideo: any) => void
  onExport?: (editedVideo: any) => void
}

export function VideoTimelineEditor({ video, onSave, onExport }: VideoTimelineEditorProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState([100])
  const [playbackSpeed, setPlaybackSpeed] = useState([1])
  const [trimStart, setTrimStart] = useState(0)
  const [trimEnd, setTrimEnd] = useState(0)
  const [cuts, setCuts] = useState<Array<{ start: number; end: number }>>([])

  const [brightness, setBrightness] = useState([100])
  const [contrast, setContrast] = useState([100])
  const [saturation, setSaturation] = useState([100])
  const [blur, setBlur] = useState([0])
  const [textOverlays, setTextOverlays] = useState<
    Array<{
      id: string
      text: string
      x: number
      y: number
      size: number
      color: string
      startTime: number
      endTime: number
    }>
  >([])
  const [selectedFilter, setSelectedFilter] = useState("none")

  const videoRef = useRef<HTMLVideoElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadEditingState = () => {
      try {
        const savedState = localStorage.getItem(`coconutz_edit_${video.id}`)
        if (savedState) {
          const editData = JSON.parse(savedState)
          setVolume([editData.volume || 100])
          setPlaybackSpeed([editData.speed || 1])
          setTrimStart(editData.trimStart || 0)
          setTrimEnd(editData.trimEnd || duration)
          setCuts(editData.cuts || [])
          setBrightness([editData.brightness || 100])
          setContrast([editData.contrast || 100])
          setSaturation([editData.saturation || 100])
          setBlur([editData.blur || 0])
          setSelectedFilter(editData.selectedFilter || "none")
          setTextOverlays(editData.textOverlays || [])
        }
      } catch (error) {
        console.error("[v0] Failed to load editing state:", error)
      }
    }

    if (duration > 0) {
      loadEditingState()
    }
  }, [video.id, duration])

  useEffect(() => {
    const saveEditingState = () => {
      try {
        const editData = {
          videoId: video.id,
          trimStart,
          trimEnd,
          cuts,
          volume: volume[0],
          speed: playbackSpeed[0],
          brightness: brightness[0],
          contrast: contrast[0],
          saturation: saturation[0],
          blur: blur[0],
          selectedFilter,
          textOverlays,
          lastSaved: new Date().toISOString(),
        }
        localStorage.setItem(`coconutz_edit_${video.id}`, JSON.stringify(editData))
      } catch (error) {
        console.error("[v0] Failed to save editing state:", error)
      }
    }

    const timeoutId = setTimeout(saveEditingState, 1000)
    return () => clearTimeout(timeoutId)
  }, [
    video.id,
    trimStart,
    trimEnd,
    cuts,
    volume,
    playbackSpeed,
    brightness,
    contrast,
    saturation,
    blur,
    selectedFilter,
    textOverlays,
  ])

  useEffect(() => {
    const videoElement = videoRef.current
    if (!videoElement) return

    const handleLoadedMetadata = () => {
      console.log("[v0] Video loaded, duration:", videoElement.duration)
      setDuration(videoElement.duration)
      setTrimEnd(videoElement.duration)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(videoElement.currentTime)

      const currentCut = cuts.find((cut) => videoElement.currentTime >= cut.start && videoElement.currentTime < cut.end)
      if (currentCut) {
        videoElement.currentTime = currentCut.end
      }

      if (videoElement.currentTime < trimStart) {
        videoElement.currentTime = trimStart
      }
      if (videoElement.currentTime > trimEnd) {
        videoElement.pause()
        videoElement.currentTime = trimStart
        setIsPlaying(false)
      }
    }

    const handlePlay = () => {
      console.log("[v0] Video playing")
      setIsPlaying(true)
    }

    const handlePause = () => {
      console.log("[v0] Video paused")
      setIsPlaying(false)
    }

    videoElement.addEventListener("loadedmetadata", handleLoadedMetadata)
    videoElement.addEventListener("timeupdate", handleTimeUpdate)
    videoElement.addEventListener("play", handlePlay)
    videoElement.addEventListener("pause", handlePause)

    return () => {
      videoElement.removeEventListener("loadedmetadata", handleLoadedMetadata)
      videoElement.removeEventListener("timeupdate", handleTimeUpdate)
      videoElement.removeEventListener("play", handlePlay)
      videoElement.removeEventListener("pause", handlePause)
    }
  }, [cuts, trimStart, trimEnd])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const filterString = `
      brightness(${brightness[0]}%) 
      contrast(${contrast[0]}%) 
      saturate(${saturation[0]}%) 
      blur(${blur[0]}px)
      ${selectedFilter !== "none" ? getFilterEffect(selectedFilter) : ""}
    `.trim()

    video.style.filter = filterString
  }, [brightness, contrast, saturation, blur, selectedFilter])

  const getFilterEffect = (filter: string) => {
    switch (filter) {
      case "sepia":
        return "sepia(100%)"
      case "grayscale":
        return "grayscale(100%)"
      case "invert":
        return "invert(100%)"
      case "vintage":
        return "sepia(50%) contrast(120%) brightness(90%)"
      case "cool":
        return "hue-rotate(180deg) saturate(120%)"
      case "warm":
        return "hue-rotate(30deg) saturate(110%)"
      default:
        return ""
    }
  }

  const togglePlayPause = () => {
    const video = videoRef.current
    if (!video) return

    console.log("[v0] Toggle play/pause, current state:", isPlaying)

    if (isPlaying) {
      video.pause()
    } else {
      // Start from trim start if at the end
      if (video.currentTime >= trimEnd || video.currentTime < trimStart) {
        video.currentTime = trimStart
      }
      video.play().catch((err) => console.error("[v0] Play error:", err))
    }
  }

  const seekTo = (time: number) => {
    const video = videoRef.current
    if (!video) return

    const clampedTime = Math.max(trimStart, Math.min(trimEnd, time))
    video.currentTime = clampedTime
    setCurrentTime(clampedTime)
  }

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current || !duration) return

    const rect = timelineRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const timelineWidth = rect.width
    const clickTime = (clickX / timelineWidth) * duration

    seekTo(clickTime)
  }

  const addCut = () => {
    const cutStart = currentTime
    const cutEnd = Math.min(currentTime + 1, duration) // 1 second cut by default

    const newCut = { start: cutStart, end: cutEnd }
    setCuts([...cuts, newCut].sort((a, b) => a.start - b.start))
    console.log("[v0] Added cut:", newCut)
  }

  const removeCut = (index: number) => {
    setCuts(cuts.filter((_, i) => i !== index))
  }

  const addTextOverlay = () => {
    const newOverlay = {
      id: crypto.randomUUID(),
      text: "Sample Text",
      x: 50,
      y: 50,
      size: 32,
      color: "#ffffff",
      startTime: currentTime,
      endTime: Math.min(currentTime + 5, duration),
    }
    setTextOverlays([...textOverlays, newOverlay])
  }

  const updateTextOverlay = (id: string, updates: Partial<(typeof textOverlays)[0]>) => {
    setTextOverlays(textOverlays.map((overlay) => (overlay.id === id ? { ...overlay, ...updates } : overlay)))
  }

  const removeTextOverlay = (id: string) => {
    setTextOverlays(textOverlays.filter((overlay) => overlay.id !== id))
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    const ms = Math.floor((time % 1) * 10)
    return `${minutes}:${seconds.toString().padStart(2, "0")}.${ms}`
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value)
    if (videoRef.current) {
      videoRef.current.volume = value[0] / 100
    }
  }

  const handleSpeedChange = (value: number[]) => {
    setPlaybackSpeed(value)
    if (videoRef.current) {
      videoRef.current.playbackRate = value[0]
    }
  }

  const handleSave = () => {
    const editData = {
      videoId: video.id,
      trimStart,
      trimEnd,
      cuts,
      volume: volume[0],
      speed: playbackSpeed[0],
      brightness: brightness[0],
      contrast: contrast[0],
      saturation: saturation[0],
      blur: blur[0],
      selectedFilter,
      textOverlays,
      editedAt: new Date().toISOString(),
    }

    try {
      localStorage.setItem(`coconutz_edit_${video.id}`, JSON.stringify(editData))
      alert("Project saved successfully!")
    } catch (error) {
      console.error("[v0] Failed to save project:", error)
      alert("Failed to save project")
    }

    onSave?.(editData)
  }

  const handleExport = () => {
    const exportData = {
      videoId: video.id,
      filename: video.filename,
      url: video.url,
      trimStart,
      trimEnd,
      cuts,
      volume: volume[0],
      speed: playbackSpeed[0],
      brightness: brightness[0],
      contrast: contrast[0],
      saturation: saturation[0],
      blur: blur[0],
      selectedFilter,
      textOverlays,
    }
    onExport?.(exportData)
    alert("Export configuration saved! In a production app, this would render the video with all effects applied.")
  }

  return (
    <div ref={containerRef} className="h-full flex flex-col bg-gray-900">
      {/* Video Preview */}
      <div className="flex-1 bg-black flex items-center justify-center p-4 relative">
        <div className="relative max-w-full max-h-full">
          <video
            ref={videoRef}
            src={video.url}
            className="max-w-full max-h-full object-contain"
            onLoadedMetadata={() => {
              if (videoRef.current) {
                videoRef.current.volume = volume[0] / 100
                videoRef.current.playbackRate = playbackSpeed[0]
              }
            }}
          />

          {textOverlays.map((overlay) => {
            if (currentTime >= overlay.startTime && currentTime <= overlay.endTime) {
              return (
                <div
                  key={overlay.id}
                  className="absolute pointer-events-none"
                  style={{
                    left: `${overlay.x}%`,
                    top: `${overlay.y}%`,
                    fontSize: `${overlay.size}px`,
                    color: overlay.color,
                    fontWeight: "bold",
                    textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {overlay.text}
                </div>
              )
            }
            return null
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 p-4 space-y-4">
        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={() => seekTo(Math.max(trimStart, currentTime - 5))}
            className="bg-gray-700 hover:bg-gray-600"
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button onClick={togglePlayPause} className="bg-cyan-500 hover:bg-cyan-600 px-8 py-6">
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </Button>
          <Button onClick={() => seekTo(Math.min(trimEnd, currentTime + 5))} className="bg-gray-700 hover:bg-gray-600">
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Timeline */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-300">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          <div
            ref={timelineRef}
            className="relative h-16 bg-gray-700 rounded cursor-pointer"
            onClick={handleTimelineClick}
          >
            {/* Timeline track */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded" />

            {/* Trim indicators */}
            <div
              className="absolute top-0 bottom-0 bg-red-500/30 border-l-4 border-red-500"
              style={{ left: `${(trimStart / duration) * 100}%` }}
            >
              <div className="absolute -top-1 left-0 bg-red-500 text-white text-xs px-1 rounded">Start</div>
            </div>
            <div
              className="absolute top-0 bottom-0 bg-red-500/30 border-r-4 border-red-500"
              style={{ left: `${(trimEnd / duration) * 100}%` }}
            >
              <div className="absolute -top-1 right-0 bg-red-500 text-white text-xs px-1 rounded">End</div>
            </div>

            {cuts.map((cut, index) => (
              <div
                key={index}
                className="absolute top-0 bottom-0 bg-black/60 border-x-2 border-yellow-400 cursor-pointer hover:bg-black/80"
                style={{
                  left: `${(cut.start / duration) * 100}%`,
                  width: `${((cut.end - cut.start) / duration) * 100}%`,
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  removeCut(index)
                }}
                title="Click to remove cut"
              >
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-yellow-400 text-xs">
                  <Scissors className="h-4 w-4" />
                </div>
              </div>
            ))}

            {/* Text overlay markers */}
            {textOverlays.map((overlay) => (
              <div
                key={overlay.id}
                className="absolute top-0 h-2 bg-green-400 rounded"
                style={{
                  left: `${(overlay.startTime / duration) * 100}%`,
                  width: `${((overlay.endTime - overlay.startTime) / duration) * 100}%`,
                }}
                title={overlay.text}
              />
            ))}

            {/* Playhead */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10"
              style={{ left: `${(currentTime / duration) * 100}%` }}
            >
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white rounded-full" />
            </div>
          </div>
        </div>

        {/* Processing Tools Tabs */}
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-700">
            <TabsTrigger value="basic" className="text-white">
              Basic
            </TabsTrigger>
            <TabsTrigger value="effects" className="text-white">
              <Palette className="h-4 w-4 mr-1" />
              Effects
            </TabsTrigger>
            <TabsTrigger value="text" className="text-white">
              <Type className="h-4 w-4 mr-1" />
              Text
            </TabsTrigger>
            <TabsTrigger value="audio" className="text-white">
              <Volume2 className="h-4 w-4 mr-1" />
              Audio
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Trim Controls */}
              <Card className="bg-gray-700 border-gray-600">
                <CardContent className="p-3">
                  <h4 className="text-white text-sm font-medium mb-2">Trim Start</h4>
                  <div className="space-y-2">
                    <div className="text-cyan-400 text-lg font-mono">{formatTime(trimStart)}</div>
                    <Slider
                      value={[trimStart]}
                      onValueChange={(value) => {
                        setTrimStart(value[0])
                        if (currentTime < value[0]) seekTo(value[0])
                      }}
                      max={trimEnd - 0.1}
                      step={0.1}
                      className="mt-1"
                    />
                    <Button
                      onClick={() => setTrimStart(currentTime)}
                      className="w-full bg-cyan-500 hover:bg-cyan-600 text-xs"
                    >
                      Set to Current Time
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-700 border-gray-600">
                <CardContent className="p-3">
                  <h4 className="text-white text-sm font-medium mb-2">Trim End</h4>
                  <div className="space-y-2">
                    <div className="text-cyan-400 text-lg font-mono">{formatTime(trimEnd)}</div>
                    <Slider
                      value={[trimEnd]}
                      onValueChange={(value) => {
                        setTrimEnd(value[0])
                        if (currentTime > value[0]) seekTo(value[0])
                      }}
                      min={trimStart + 0.1}
                      max={duration}
                      step={0.1}
                      className="mt-1"
                    />
                    <Button
                      onClick={() => setTrimEnd(currentTime)}
                      className="w-full bg-cyan-500 hover:bg-cyan-600 text-xs"
                    >
                      Set to Current Time
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Cut Controls */}
              <Card className="bg-gray-700 border-gray-600">
                <CardContent className="p-3">
                  <h4 className="text-white text-sm font-medium mb-2">Cuts ({cuts.length})</h4>
                  <p className="text-xs text-gray-400 mb-2">Remove segments from video</p>
                  <Button onClick={addCut} className="w-full bg-yellow-500 hover:bg-yellow-600 text-black text-sm mb-2">
                    <Scissors className="h-3 w-3 mr-1" />
                    Cut Here
                  </Button>
                  <div className="text-xs text-gray-400">
                    {cuts.length > 0 ? "Click cuts on timeline to remove" : "No cuts yet"}
                  </div>
                </CardContent>
              </Card>

              {/* Volume Control */}
              <Card className="bg-gray-700 border-gray-600">
                <CardContent className="p-3">
                  <h4 className="text-white text-sm font-medium mb-2">Volume: {volume[0]}%</h4>
                  <Slider value={volume} onValueChange={handleVolumeChange} max={100} step={1} />
                  <div className="mt-2">
                    <h4 className="text-white text-sm font-medium mb-2">Speed: {playbackSpeed[0]}x</h4>
                    <Slider value={playbackSpeed} onValueChange={handleSpeedChange} min={0.25} max={2} step={0.25} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="effects" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Color Adjustments */}
              <Card className="bg-gray-700 border-gray-600">
                <CardContent className="p-3">
                  <h4 className="text-white text-sm font-medium mb-3">Color Adjustments</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-300">Brightness: {brightness[0]}%</label>
                      <Slider value={brightness} onValueChange={setBrightness} min={0} max={200} step={1} />
                    </div>
                    <div>
                      <label className="text-xs text-gray-300">Contrast: {contrast[0]}%</label>
                      <Slider value={contrast} onValueChange={setContrast} min={0} max={200} step={1} />
                    </div>
                    <div>
                      <label className="text-xs text-gray-300">Saturation: {saturation[0]}%</label>
                      <Slider value={saturation} onValueChange={setSaturation} min={0} max={200} step={1} />
                    </div>
                    <div>
                      <label className="text-xs text-gray-300">Blur: {blur[0]}px</label>
                      <Slider value={blur} onValueChange={setBlur} min={0} max={20} step={0.5} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Filters */}
              <Card className="bg-gray-700 border-gray-600">
                <CardContent className="p-3">
                  <h4 className="text-white text-sm font-medium mb-3">Filters</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {["none", "sepia", "grayscale", "invert", "vintage", "cool", "warm"].map((filter) => (
                      <Button
                        key={filter}
                        onClick={() => setSelectedFilter(filter)}
                        className={`text-xs ${selectedFilter === filter ? "bg-cyan-500" : "bg-gray-600"} hover:bg-cyan-600`}
                      >
                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-gray-700 border-gray-600">
                <CardContent className="p-3">
                  <h4 className="text-white text-sm font-medium mb-3">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button
                      onClick={() => {
                        setBrightness([120])
                        setContrast([110])
                        setSaturation([120])
                      }}
                      className="w-full bg-purple-500 hover:bg-purple-600 text-xs"
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      Auto Enhance
                    </Button>
                    <Button
                      onClick={() => {
                        setBrightness([100])
                        setContrast([100])
                        setSaturation([100])
                        setBlur([0])
                        setSelectedFilter("none")
                      }}
                      className="w-full bg-gray-600 hover:bg-gray-500 text-xs"
                    >
                      Reset Effects
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="text" className="space-y-4">
            <Card className="bg-gray-700 border-gray-600">
              <CardContent className="p-3">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-white text-sm font-medium">Text Overlays ({textOverlays.length})</h4>
                  <Button onClick={addTextOverlay} className="bg-green-500 hover:bg-green-600 text-white text-xs">
                    <Type className="h-3 w-3 mr-1" />
                    Add Text
                  </Button>
                </div>

                {textOverlays.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-4">
                    No text overlays yet. Click "Add Text" to create one.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {textOverlays.map((overlay) => (
                      <div key={overlay.id} className="bg-gray-600 p-3 rounded space-y-3">
                        <div className="flex justify-between items-start">
                          <Input
                            value={overlay.text}
                            onChange={(e) => updateTextOverlay(overlay.id, { text: e.target.value })}
                            className="bg-gray-700 text-white flex-1 mr-2"
                            placeholder="Enter text..."
                          />
                          <Button
                            onClick={() => removeTextOverlay(overlay.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-2"
                          >
                            ×
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-gray-300">Color</label>
                            <Input
                              type="color"
                              value={overlay.color}
                              onChange={(e) => updateTextOverlay(overlay.id, { color: e.target.value })}
                              className="bg-gray-700 h-8 w-full"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-300">Size: {overlay.size}px</label>
                            <Slider
                              value={[overlay.size]}
                              onValueChange={(value) => updateTextOverlay(overlay.id, { size: value[0] })}
                              min={16}
                              max={96}
                              step={2}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-gray-300">X Position: {overlay.x}%</label>
                            <Slider
                              value={[overlay.x]}
                              onValueChange={(value) => updateTextOverlay(overlay.id, { x: value[0] })}
                              min={0}
                              max={100}
                              step={1}
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-300">Y Position: {overlay.y}%</label>
                            <Slider
                              value={[overlay.y]}
                              onValueChange={(value) => updateTextOverlay(overlay.id, { y: value[0] })}
                              min={0}
                              max={100}
                              step={1}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-gray-300">Start: {formatTime(overlay.startTime)}</label>
                            <Slider
                              value={[overlay.startTime]}
                              onValueChange={(value) => updateTextOverlay(overlay.id, { startTime: value[0] })}
                              max={overlay.endTime - 0.1}
                              step={0.1}
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-300">End: {formatTime(overlay.endTime)}</label>
                            <Slider
                              value={[overlay.endTime]}
                              onValueChange={(value) => updateTextOverlay(overlay.id, { endTime: value[0] })}
                              min={overlay.startTime + 0.1}
                              max={duration}
                              step={0.1}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audio" className="space-y-4">
            <Card className="bg-gray-700 border-gray-600">
              <CardContent className="p-3">
                <h4 className="text-white text-sm font-medium mb-3">Audio Controls</h4>
                <p className="text-gray-400 text-sm">
                  Volume and playback speed controls are available in the Basic tab.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600 text-white px-6">
            <Save className="h-4 w-4 mr-2" />
            Save Project
          </Button>
          <Button
            onClick={handleExport}
            className="bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 text-white px-6"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Video
          </Button>
        </div>
      </div>
    </div>
  )
}
