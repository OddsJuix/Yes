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
  const [cuts, setCuts] = useState<number[]>([])

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
  const [audioGain, setAudioGain] = useState([0])
  const [fadeIn, setFadeIn] = useState([0])
  const [fadeOut, setFadeOut] = useState([0])

  const videoRef = useRef<HTMLVideoElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const videoElement = videoRef.current
    if (!videoElement) return

    const handleLoadedMetadata = () => {
      setDuration(videoElement.duration)
      setTrimEnd(videoElement.duration)
      setFadeOut([videoElement.duration])
    }

    const handleTimeUpdate = () => {
      setCurrentTime(videoElement.currentTime)
      applyVideoEffects()
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

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
  }, [])

  const applyVideoEffects = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Apply filters
    const filterString = `
      brightness(${brightness[0]}%) 
      contrast(${contrast[0]}%) 
      saturate(${saturation[0]}%) 
      blur(${blur[0]}px)
      ${selectedFilter !== "none" ? getFilterEffect(selectedFilter) : ""}
    `

    ctx.filter = filterString
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Draw text overlays
    textOverlays.forEach((overlay) => {
      if (currentTime >= overlay.startTime && currentTime <= overlay.endTime) {
        ctx.font = `${overlay.size}px Arial`
        ctx.fillStyle = overlay.color
        ctx.fillText(overlay.text, overlay.x, overlay.y)
      }
    })
  }

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
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
    }
  }

  const seekTo = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current || !duration) return

    const rect = timelineRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const timelineWidth = rect.width
    const clickTime = (clickX / timelineWidth) * duration

    seekTo(Math.max(0, Math.min(duration, clickTime)))
  }

  const addCut = () => {
    if (!cuts.includes(currentTime)) {
      setCuts([...cuts, currentTime].sort((a, b) => a - b))
    }
  }

  const removeCut = (cutTime: number) => {
    setCuts(cuts.filter((cut) => cut !== cutTime))
  }

  const addTextOverlay = () => {
    const newOverlay = {
      id: crypto.randomUUID(),
      text: "Sample Text",
      x: 50,
      y: 100,
      size: 24,
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
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
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
      audioGain: audioGain[0],
      fadeIn: fadeIn[0],
      fadeOut: fadeOut[0],
      editedAt: new Date().toISOString(),
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
      audioGain: audioGain[0],
      fadeIn: fadeIn[0],
      fadeOut: fadeOut[0],
    }
    onExport?.(exportData)
  }

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Video Preview */}
      <div className="flex-1 bg-black flex items-center justify-center p-4 relative">
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
        <canvas
          ref={canvasRef}
          className="absolute max-w-full max-h-full object-contain pointer-events-none"
          style={{ display: "none" }}
        />
      </div>

      {/* Controls */}
      <div className="bg-gray-800 p-4 space-y-4">
        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button onClick={() => seekTo(Math.max(0, currentTime - 10))} className="bg-gray-700 hover:bg-gray-600">
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button onClick={togglePlayPause} className="bg-cyan-500 hover:bg-cyan-600 px-6">
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          <Button
            onClick={() => seekTo(Math.min(duration, currentTime + 10))}
            className="bg-gray-700 hover:bg-gray-600"
          >
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
            className="relative h-12 bg-gray-700 rounded cursor-pointer"
            onClick={handleTimelineClick}
          >
            {/* Timeline track */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded" />

            {/* Trim indicators */}
            <div
              className="absolute top-0 bottom-0 bg-red-500/30 border-l-2 border-red-500"
              style={{ left: `${(trimStart / duration) * 100}%` }}
            />
            <div
              className="absolute top-0 bottom-0 bg-red-500/30 border-r-2 border-red-500"
              style={{ left: `${(trimEnd / duration) * 100}%` }}
            />

            {/* Cut markers */}
            {cuts.map((cut, index) => (
              <div
                key={index}
                className="absolute top-0 bottom-0 w-0.5 bg-yellow-400 cursor-pointer"
                style={{ left: `${(cut / duration) * 100}%` }}
                onClick={(e) => {
                  e.stopPropagation()
                  removeCut(cut)
                }}
              />
            ))}

            {/* Text overlay markers */}
            {textOverlays.map((overlay) => (
              <div
                key={overlay.id}
                className="absolute top-0 bottom-0 bg-green-400/30 border border-green-400"
                style={{
                  left: `${(overlay.startTime / duration) * 100}%`,
                  width: `${((overlay.endTime - overlay.startTime) / duration) * 100}%`,
                }}
              />
            ))}

            {/* Playhead */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
              style={{ left: `${(currentTime / duration) * 100}%` }}
            />
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
                  <h4 className="text-white text-sm font-medium mb-2">Trim</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-gray-300">Start: {formatTime(trimStart)}</label>
                      <Slider
                        value={[trimStart]}
                        onValueChange={(value) => setTrimStart(value[0])}
                        max={duration}
                        step={0.1}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-300">End: {formatTime(trimEnd)}</label>
                      <Slider
                        value={[trimEnd]}
                        onValueChange={(value) => setTrimEnd(value[0])}
                        max={duration}
                        step={0.1}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cut Controls */}
              <Card className="bg-gray-700 border-gray-600">
                <CardContent className="p-3">
                  <h4 className="text-white text-sm font-medium mb-2">Cuts ({cuts.length})</h4>
                  <Button onClick={addCut} className="w-full bg-yellow-500 hover:bg-yellow-600 text-black text-sm">
                    <Scissors className="h-3 w-3 mr-1" />
                    Add Cut
                  </Button>
                </CardContent>
              </Card>

              {/* Volume Control */}
              <Card className="bg-gray-700 border-gray-600">
                <CardContent className="p-3">
                  <h4 className="text-white text-sm font-medium mb-2">Volume: {volume[0]}%</h4>
                  <Slider value={volume} onValueChange={handleVolumeChange} max={100} step={1} />
                </CardContent>
              </Card>

              {/* Speed Control */}
              <Card className="bg-gray-700 border-gray-600">
                <CardContent className="p-3">
                  <h4 className="text-white text-sm font-medium mb-2">Speed: {playbackSpeed[0]}x</h4>
                  <Slider value={playbackSpeed} onValueChange={handleSpeedChange} min={0.25} max={2} step={0.25} />
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
                  <div className="mt-3">
                    <label className="text-xs text-gray-300">Blur: {blur[0]}px</label>
                    <Slider value={blur} onValueChange={setBlur} min={0} max={10} step={0.1} />
                  </div>
                </CardContent>
              </Card>

              {/* Effects Preview */}
              <Card className="bg-gray-700 border-gray-600">
                <CardContent className="p-3">
                  <h4 className="text-white text-sm font-medium mb-3">Quick Effects</h4>
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
                      Enhance
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
                      Reset All
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="text" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Add Text Overlay */}
              <Card className="bg-gray-700 border-gray-600">
                <CardContent className="p-3">
                  <h4 className="text-white text-sm font-medium mb-3">Add Text Overlay</h4>
                  <Button onClick={addTextOverlay} className="w-full bg-green-500 hover:bg-green-600 text-white">
                    <Type className="h-4 w-4 mr-2" />
                    Add Text at {formatTime(currentTime)}
                  </Button>
                </CardContent>
              </Card>

              {/* Text Overlays List */}
              <Card className="bg-gray-700 border-gray-600">
                <CardContent className="p-3">
                  <h4 className="text-white text-sm font-medium mb-3">Text Overlays ({textOverlays.length})</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {textOverlays.map((overlay) => (
                      <div key={overlay.id} className="bg-gray-600 p-2 rounded text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-white truncate">{overlay.text}</span>
                          <Button
                            onClick={() => removeTextOverlay(overlay.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-xs"
                          >
                            ×
                          </Button>
                        </div>
                        <div className="text-gray-300 text-xs">
                          {formatTime(overlay.startTime)} - {formatTime(overlay.endTime)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Text Overlay Editor */}
            {textOverlays.length > 0 && (
              <Card className="bg-gray-700 border-gray-600">
                <CardContent className="p-3">
                  <h4 className="text-white text-sm font-medium mb-3">Edit Selected Text</h4>
                  {textOverlays.map((overlay) => (
                    <div key={overlay.id} className="space-y-3 border-b border-gray-600 pb-3 mb-3 last:border-b-0">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-gray-300">Text</label>
                          <Input
                            value={overlay.text}
                            onChange={(e) => updateTextOverlay(overlay.id, { text: e.target.value })}
                            className="bg-gray-600 text-white text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-300">Color</label>
                          <Input
                            type="color"
                            value={overlay.color}
                            onChange={(e) => updateTextOverlay(overlay.id, { color: e.target.value })}
                            className="bg-gray-600 h-8"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs text-gray-300">Size: {overlay.size}px</label>
                          <Slider
                            value={[overlay.size]}
                            onValueChange={(value) => updateTextOverlay(overlay.id, { size: value[0] })}
                            min={12}
                            max={72}
                            step={1}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-300">Start: {formatTime(overlay.startTime)}</label>
                          <Slider
                            value={[overlay.startTime]}
                            onValueChange={(value) => updateTextOverlay(overlay.id, { startTime: value[0] })}
                            max={duration}
                            step={0.1}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-300">End: {formatTime(overlay.endTime)}</label>
                          <Slider
                            value={[overlay.endTime]}
                            onValueChange={(value) => updateTextOverlay(overlay.id, { endTime: value[0] })}
                            max={duration}
                            step={0.1}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="audio" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Audio Gain */}
              <Card className="bg-gray-700 border-gray-600">
                <CardContent className="p-3">
                  <h4 className="text-white text-sm font-medium mb-2">Audio Gain: {audioGain[0]}dB</h4>
                  <Slider value={audioGain} onValueChange={setAudioGain} min={-20} max={20} step={1} />
                </CardContent>
              </Card>

              {/* Fade In */}
              <Card className="bg-gray-700 border-gray-600">
                <CardContent className="p-3">
                  <h4 className="text-white text-sm font-medium mb-2">Fade In: {formatTime(fadeIn[0])}</h4>
                  <Slider value={fadeIn} onValueChange={setFadeIn} min={0} max={duration / 4} step={0.1} />
                </CardContent>
              </Card>

              {/* Fade Out */}
              <Card className="bg-gray-700 border-gray-600">
                <CardContent className="p-3">
                  <h4 className="text-white text-sm font-medium mb-2">Fade Out: {formatTime(fadeOut[0])}</h4>
                  <Slider
                    value={fadeOut}
                    onValueChange={setFadeOut}
                    min={(duration * 3) / 4}
                    max={duration}
                    step={0.1}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600 text-white">
            <Save className="h-4 w-4 mr-2" />
            Save Project
          </Button>
          <Button
            onClick={handleExport}
            className="bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Video
          </Button>
        </div>
      </div>
    </div>
  )
}
