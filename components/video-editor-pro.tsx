"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Upload,
  Download,
  Scissors,
  Type,
  Trash2,
  ZoomIn,
  ZoomOut,
} from "lucide-react"

interface Media {
  id: string
  file: File
  element: HTMLVideoElement
  thumbnail: string
  duration: number
}

interface Keyframe {
  start: number
  x: number
  y: number
  scaleX: number
  scaleY: number
  rotation: number
  opacity: number
}

interface TextOverlay {
  id: string
  text: string
  x: number
  y: number
  fontSize: number
  color: string
  fontFamily: string
  start: number
  duration: number
}

interface Segment {
  id: string
  media: Media
  track: number
  start: number
  duration: number
  mediaStart: number
  trimStart: number
  trimEnd: number
  keyframes: Keyframe[]
  filters: {
    brightness: number
    contrast: number
    saturation: number
    blur: number
    hue: number
  }
}

export default function VideoEditorPro() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mediaList, setMediaList] = useState<Media[]>([])
  const [segments, setSegments] = useState<Segment[]>([])
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([])
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null)
  const [selectedText, setSelectedText] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [zoom, setZoom] = useState(1)
  const animationFrameRef = useRef<number>()
  const playbackStartRef = useRef(0)
  const lastTimeRef = useRef(0)

  // Canvas dimensions
  const canvasWidth = 1920
  const canvasHeight = 1080

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = canvasWidth
    canvas.height = canvasHeight
  }, [])

  // Calculate total duration
  useEffect(() => {
    let maxDuration = 0
    segments.forEach((seg) => {
      const endTime = seg.start + seg.duration
      if (endTime > maxDuration) maxDuration = endTime
    })
    textOverlays.forEach((text) => {
      const endTime = text.start + text.duration
      if (endTime > maxDuration) maxDuration = endTime
    })
    setDuration(maxDuration)
  }, [segments, textOverlays])

  // Generate thumbnail for video
  const generateThumbnail = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement("video")
      video.preload = "metadata"
      video.onloadeddata = () => {
        video.currentTime = 0.1
      }
      video.onseeked = () => {
        const canvas = document.createElement("canvas")
        canvas.width = 160
        canvas.height = 90
        const ctx = canvas.getContext("2d")!
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL())
      }
      video.src = URL.createObjectURL(file)
    })
  }

  // Upload video
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (!file.type.startsWith("video/")) continue

      const video = document.createElement("video")
      video.preload = "metadata"
      video.src = URL.createObjectURL(file)

      await new Promise<void>((resolve) => {
        video.onloadedmetadata = () => resolve()
      })

      const thumbnail = await generateThumbnail(file)

      const media: Media = {
        id: Math.random().toString(36).substr(2, 9),
        file,
        element: video,
        thumbnail,
        duration: video.duration * 1000,
      }

      setMediaList((prev) => [...prev, media])
    }
  }

  // Add segment to timeline
  const addSegmentToTimeline = (media: Media) => {
    const segment: Segment = {
      id: Math.random().toString(36).substr(2, 9),
      media,
      track: 0,
      start: duration,
      duration: media.duration,
      mediaStart: 0,
      trimStart: 0,
      trimEnd: media.duration,
      keyframes: [
        {
          start: 0,
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1,
          rotation: 0,
          opacity: 1,
        },
      ],
      filters: {
        brightness: 100,
        contrast: 100,
        saturation: 100,
        blur: 0,
        hue: 0,
      },
    }

    setSegments((prev) => [...prev, segment])
  }

  // Render frame
  const renderFrame = useCallback(
    (time: number) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")!
      ctx.clearRect(0, 0, canvasWidth, canvasHeight)
      ctx.fillStyle = "#000"
      ctx.fillRect(0, 0, canvasWidth, canvasHeight)

      // Render video segments
      segments.forEach((segment) => {
        if (time >= segment.start && time < segment.start + segment.duration) {
          const mediaTime = (time - segment.start + segment.mediaStart) / 1000
          const video = segment.media.element

          // Seek if needed
          if (Math.abs(video.currentTime - mediaTime) > 0.1) {
            video.currentTime = mediaTime
          }

          // Apply filters
          const { brightness, contrast, saturation, blur, hue } = segment.filters
          ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px) hue-rotate(${hue}deg)`

          // Get keyframe values
          const kf = segment.keyframes[0]

          ctx.save()
          ctx.translate(canvasWidth / 2 + kf.x, canvasHeight / 2 + kf.y)
          ctx.rotate((kf.rotation * Math.PI) / 180)
          ctx.scale(kf.scaleX, kf.scaleY)
          ctx.globalAlpha = kf.opacity

          const videoWidth = video.videoWidth
          const videoHeight = video.videoHeight
          ctx.drawImage(video, -videoWidth / 2, -videoHeight / 2, videoWidth, videoHeight)

          ctx.restore()
          ctx.filter = "none"
        }
      })

      // Render text overlays
      textOverlays.forEach((text) => {
        if (time >= text.start && time < text.start + text.duration) {
          ctx.font = `${text.fontSize}px ${text.fontFamily}`
          ctx.fillStyle = text.color
          ctx.fillText(text.text, text.x, text.y)
        }
      })
    },
    [segments, textOverlays],
  )

  // Playback loop
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      return
    }

    const animate = () => {
      const elapsed = performance.now() - playbackStartRef.current
      const newTime = lastTimeRef.current + elapsed

      if (newTime >= duration) {
        setIsPlaying(false)
        setCurrentTime(duration)
        return
      }

      setCurrentTime(newTime)
      renderFrame(newTime)

      // Update video playback
      segments.forEach((segment) => {
        if (newTime >= segment.start && newTime < segment.start + segment.duration) {
          if (segment.media.element.paused) {
            segment.media.element.play().catch(() => {})
          }
        } else {
          segment.media.element.pause()
        }
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    playbackStartRef.current = performance.now()
    lastTimeRef.current = currentTime
    animate()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isPlaying, currentTime, duration, renderFrame, segments])

  // Render current frame when not playing
  useEffect(() => {
    if (!isPlaying) {
      renderFrame(currentTime)
    }
  }, [currentTime, isPlaying, renderFrame])

  // Play/Pause
  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
  }

  // Seek
  const handleSeek = (value: number[]) => {
    setCurrentTime(value[0])
    lastTimeRef.current = value[0]
  }

  // Split segment
  const splitSegment = () => {
    if (!selectedSegment) return

    const segment = segments.find((s) => s.id === selectedSegment)
    if (!segment) return

    if (currentTime < segment.start || currentTime > segment.start + segment.duration) return

    const splitPoint = currentTime - segment.start

    const newSegment1: Segment = {
      ...segment,
      duration: splitPoint,
    }

    const newSegment2: Segment = {
      ...segment,
      id: Math.random().toString(36).substr(2, 9),
      start: currentTime,
      duration: segment.duration - splitPoint,
      mediaStart: segment.mediaStart + splitPoint,
    }

    setSegments((prev) => prev.map((s) => (s.id === selectedSegment ? newSegment1 : s)).concat(newSegment2))
  }

  // Delete segment
  const deleteSegment = () => {
    if (!selectedSegment) return
    setSegments((prev) => prev.filter((s) => s.id !== selectedSegment))
    setSelectedSegment(null)
  }

  // Add text overlay
  const addTextOverlay = () => {
    const text: TextOverlay = {
      id: Math.random().toString(36).substr(2, 9),
      text: "New Text",
      x: canvasWidth / 2,
      y: canvasHeight / 2,
      fontSize: 48,
      color: "#ffffff",
      fontFamily: "Arial",
      start: currentTime,
      duration: 5000,
    }
    setTextOverlays((prev) => [...prev, text])
    setSelectedText(text.id)
  }

  // Update segment filters
  const updateSegmentFilter = (key: keyof Segment["filters"], value: number) => {
    if (!selectedSegment) return
    setSegments((prev) =>
      prev.map((s) => (s.id === selectedSegment ? { ...s, filters: { ...s.filters, [key]: value } } : s)),
    )
  }

  // Update text overlay
  const updateTextOverlay = (key: keyof TextOverlay, value: any) => {
    if (!selectedText) return
    setTextOverlays((prev) => prev.map((t) => (t.id === selectedText ? { ...t, [key]: value } : t)))
  }

  // Export video
  const exportVideo = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const stream = canvas.captureStream(30)
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: "video/webm;codecs=vp9",
      videoBitsPerSecond: 8000000,
    })

    const chunks: Blob[] = []
    mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "edited-video.webm"
      a.click()
    }

    mediaRecorder.start()
    setIsPlaying(true)
    setCurrentTime(0)

    // Wait for playback to finish
    await new Promise<void>((resolve) => {
      const checkInterval = setInterval(() => {
        if (currentTime >= duration) {
          clearInterval(checkInterval)
          resolve()
        }
      }, 100)
    })

    mediaRecorder.stop()
    setIsPlaying(false)
  }

  const selectedSegmentData = segments.find((s) => s.id === selectedSegment)
  const selectedTextData = textOverlays.find((t) => t.id === selectedText)

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Top Toolbar */}
      <div className="flex items-center gap-2 p-4 border-b">
        <Button variant="outline" size="icon" onClick={() => document.getElementById("video-upload")?.click()}>
          <Upload className="h-4 w-4" />
        </Button>
        <input id="video-upload" type="file" accept="video/*" multiple className="hidden" onChange={handleUpload} />
        <Button variant="outline" size="icon" onClick={exportVideo}>
          <Download className="h-4 w-4" />
        </Button>
        <div className="h-6 w-px bg-border mx-2" />
        <Button variant="outline" size="icon" onClick={splitSegment} disabled={!selectedSegment}>
          <Scissors className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={addTextOverlay}>
          <Type className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={deleteSegment} disabled={!selectedSegment}>
          <Trash2 className="h-4 w-4" />
        </Button>
        <div className="h-6 w-px bg-border mx-2" />
        <Button variant="outline" size="icon" onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="text-sm">{Math.round(zoom * 100)}%</span>
        <Button variant="outline" size="icon" onClick={() => setZoom(Math.min(4, zoom + 0.25))}>
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Media Library */}
        <div className="w-64 border-r p-4 overflow-y-auto">
          <h3 className="font-semibold mb-4">Media Library</h3>
          <div className="space-y-2">
            {mediaList.map((media) => (
              <Card
                key={media.id}
                className="p-2 cursor-pointer hover:bg-accent"
                onClick={() => addSegmentToTimeline(media)}
              >
                <img src={media.thumbnail || "/placeholder.svg"} alt="thumbnail" className="w-full rounded mb-2" />
                <p className="text-xs truncate">{media.file.name}</p>
                <p className="text-xs text-muted-foreground">{(media.duration / 1000).toFixed(1)}s</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Center - Canvas */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex items-center justify-center bg-muted/20 p-4">
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-full border shadow-lg"
              style={{ width: "auto", height: "auto" }}
            />
          </div>

          {/* Timeline */}
          <div className="border-t p-4">
            <div className="flex items-center gap-2 mb-4">
              <Button size="icon" variant="outline" onClick={() => setCurrentTime(0)}>
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button size="icon" onClick={togglePlayback}>
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button size="icon" variant="outline" onClick={() => setCurrentTime(duration)}>
                <SkipForward className="h-4 w-4" />
              </Button>
              <span className="text-sm tabular-nums">
                {(currentTime / 1000).toFixed(2)}s / {(duration / 1000).toFixed(2)}s
              </span>
            </div>

            <Slider value={[currentTime]} max={duration || 100} step={1} onValueChange={handleSeek} className="mb-4" />

            {/* Track visualization */}
            <div className="relative h-24 bg-muted/50 rounded overflow-x-auto" style={{ width: `${zoom * 100}%` }}>
              {segments.map((segment) => (
                <div
                  key={segment.id}
                  className={`absolute h-20 bg-primary/80 rounded cursor-pointer border-2 ${
                    selectedSegment === segment.id ? "border-primary" : "border-transparent"
                  }`}
                  style={{
                    left: `${(segment.start / duration) * 100}%`,
                    width: `${(segment.duration / duration) * 100}%`,
                    top: `${segment.track * 24}px`,
                  }}
                  onClick={() => setSelectedSegment(segment.id)}
                >
                  <div className="p-1 text-xs text-primary-foreground truncate">{segment.media.file.name}</div>
                </div>
              ))}
              {/* Playhead */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-red-500"
                style={{ left: `${(currentTime / duration) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar - Properties */}
        <div className="w-80 border-l p-4 overflow-y-auto">
          <Tabs defaultValue="video">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="video">Video</TabsTrigger>
              <TabsTrigger value="text">Text</TabsTrigger>
            </TabsList>

            <TabsContent value="video" className="space-y-4">
              {selectedSegmentData ? (
                <>
                  <div>
                    <Label>Brightness</Label>
                    <Slider
                      value={[selectedSegmentData.filters.brightness]}
                      min={0}
                      max={200}
                      step={1}
                      onValueChange={(v) => updateSegmentFilter("brightness", v[0])}
                    />
                    <span className="text-xs text-muted-foreground">{selectedSegmentData.filters.brightness}%</span>
                  </div>

                  <div>
                    <Label>Contrast</Label>
                    <Slider
                      value={[selectedSegmentData.filters.contrast]}
                      min={0}
                      max={200}
                      step={1}
                      onValueChange={(v) => updateSegmentFilter("contrast", v[0])}
                    />
                    <span className="text-xs text-muted-foreground">{selectedSegmentData.filters.contrast}%</span>
                  </div>

                  <div>
                    <Label>Saturation</Label>
                    <Slider
                      value={[selectedSegmentData.filters.saturation]}
                      min={0}
                      max={200}
                      step={1}
                      onValueChange={(v) => updateSegmentFilter("saturation", v[0])}
                    />
                    <span className="text-xs text-muted-foreground">{selectedSegmentData.filters.saturation}%</span>
                  </div>

                  <div>
                    <Label>Blur</Label>
                    <Slider
                      value={[selectedSegmentData.filters.blur]}
                      min={0}
                      max={20}
                      step={0.1}
                      onValueChange={(v) => updateSegmentFilter("blur", v[0])}
                    />
                    <span className="text-xs text-muted-foreground">{selectedSegmentData.filters.blur}px</span>
                  </div>

                  <div>
                    <Label>Hue Rotate</Label>
                    <Slider
                      value={[selectedSegmentData.filters.hue]}
                      min={0}
                      max={360}
                      step={1}
                      onValueChange={(v) => updateSegmentFilter("hue", v[0])}
                    />
                    <span className="text-xs text-muted-foreground">{selectedSegmentData.filters.hue}°</span>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Select a video segment to edit</p>
              )}
            </TabsContent>

            <TabsContent value="text" className="space-y-4">
              {selectedTextData ? (
                <>
                  <div>
                    <Label>Text</Label>
                    <Input value={selectedTextData.text} onChange={(e) => updateTextOverlay("text", e.target.value)} />
                  </div>

                  <div>
                    <Label>Font Size</Label>
                    <Slider
                      value={[selectedTextData.fontSize]}
                      min={12}
                      max={200}
                      step={1}
                      onValueChange={(v) => updateTextOverlay("fontSize", v[0])}
                    />
                    <span className="text-xs text-muted-foreground">{selectedTextData.fontSize}px</span>
                  </div>

                  <div>
                    <Label>Color</Label>
                    <Input
                      type="color"
                      value={selectedTextData.color}
                      onChange={(e) => updateTextOverlay("color", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>X Position</Label>
                    <Slider
                      value={[selectedTextData.x]}
                      min={0}
                      max={canvasWidth}
                      step={1}
                      onValueChange={(v) => updateTextOverlay("x", v[0])}
                    />
                  </div>

                  <div>
                    <Label>Y Position</Label>
                    <Slider
                      value={[selectedTextData.y]}
                      min={0}
                      max={canvasHeight}
                      step={1}
                      onValueChange={(v) => updateTextOverlay("y", v[0])}
                    />
                  </div>

                  <div>
                    <Label>Duration (seconds)</Label>
                    <Input
                      type="number"
                      value={selectedTextData.duration / 1000}
                      onChange={(e) => updateTextOverlay("duration", Number.parseFloat(e.target.value) * 1000)}
                    />
                  </div>

                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => {
                      setTextOverlays((prev) => prev.filter((t) => t.id !== selectedText))
                      setSelectedText(null)
                    }}
                  >
                    Delete Text
                  </Button>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Select a text overlay to edit</p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
