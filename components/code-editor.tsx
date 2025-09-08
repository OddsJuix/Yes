"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Download, Save, FileText, Plus } from "lucide-react"

interface FileItem {
  url: string
  filename: string
  size: number
  uploadedAt: string
}

export function CodeEditor() {
  const [content, setContent] = useState("")
  const [filename, setFilename] = useState("untitled.txt")
  const [files, setFiles] = useState<FileItem[]>([])
  const [currentFileUrl, setCurrentFileUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")

  // Load file list on component mount
  useEffect(() => {
    loadFileList()
  }, [])

  const loadFileList = async () => {
    try {
      const response = await fetch("/api/editor/list")
      const data = await response.json()
      if (data.files) {
        setFiles(data.files)
      }
    } catch (error) {
      console.error("Failed to load file list:", error)
    }
  }

  const saveFile = async () => {
    if (!filename.trim()) {
      setMessage("Please enter a filename")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/editor/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: filename.trim(),
          content,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setMessage(`File "${filename}" saved successfully!`)
        setCurrentFileUrl(data.url)
        await loadFileList()
      } else {
        setMessage(`Error: ${data.error}`)
      }
    } catch (error) {
      setMessage("Failed to save file")
      console.error("Save error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadFile = async (fileUrl: string, fileName: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/editor/load?url=${encodeURIComponent(fileUrl)}`)
      const data = await response.json()

      if (data.success) {
        setContent(data.content)
        setFilename(fileName)
        setCurrentFileUrl(fileUrl)
        setMessage(`File "${fileName}" loaded successfully!`)
      } else {
        setMessage(`Error: ${data.error}`)
      }
    } catch (error) {
      setMessage("Failed to load file")
      console.error("Load error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteFile = async (fileUrl: string, fileName: string) => {
    if (!confirm(`Are you sure you want to delete "${fileName}"?`)) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/editor/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: fileUrl }),
      })

      const data = await response.json()

      if (data.success) {
        setMessage(`File "${fileName}" deleted successfully!`)
        if (currentFileUrl === fileUrl) {
          setContent("")
          setFilename("untitled.txt")
          setCurrentFileUrl(null)
        }
        await loadFileList()
      } else {
        setMessage(`Error: ${data.error}`)
      }
    } catch (error) {
      setMessage("Failed to delete file")
      console.error("Delete error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const newFile = () => {
    setContent("")
    setFilename("untitled.txt")
    setCurrentFileUrl(null)
    setMessage("New file created")
  }

  const downloadFile = () => {
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setMessage(`File "${filename}" downloaded!`)
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6 h-full">
      {/* File Manager */}
      <div className="lg:col-span-1">
        <Card className="bg-gray-800 border-gray-700 h-full">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="w-5 h-5" />
              File Manager
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={newFile} className="w-full bg-green-600 hover:bg-green-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              New File
            </Button>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {files.length === 0 ? (
                <p className="text-gray-400 text-sm">No files saved yet</p>
              ) : (
                files.map((file) => (
                  <div
                    key={file.url}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      currentFileUrl === file.url
                        ? "bg-blue-600 border-blue-500"
                        : "bg-gray-700 border-gray-600 hover:bg-gray-600"
                    }`}
                  >
                    <div onClick={() => loadFile(file.url, file.filename)} className="flex-1">
                      <p className="text-white font-medium truncate">{file.filename}</p>
                      <p className="text-gray-400 text-xs">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteFile(file.url, file.filename)
                      }}
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20 mt-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Editor */}
      <div className="lg:col-span-2">
        <Card className="bg-gray-800 border-gray-700 h-full">
          <CardHeader>
            <CardTitle className="text-white">Coconutz Code Editor</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="Enter filename..."
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
              <div className="flex gap-2">
                <Button onClick={saveFile} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button
                  onClick={downloadFile}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
            {message && (
              <p className={`text-sm ${message.includes("Error") ? "text-red-400" : "text-green-400"}`}>{message}</p>
            )}
          </CardHeader>
          <CardContent>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start typing your code here..."
              className="min-h-96 bg-gray-900 border-gray-600 text-white placeholder-gray-400 font-mono text-sm resize-none"
              style={{ minHeight: "500px" }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
