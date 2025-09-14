"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Eye, Code, Trash2, Type, ImageIcon, Square, MousePointer, Save, Upload } from "lucide-react"
import { ExportModal } from "./export-modal"
import { toast } from "@/hooks/use-toast"

interface DraggableElement {
  id: string
  type: "div" | "p" | "h1" | "h2" | "h3" | "img" | "button"
  content: string
  styles: Record<string, string>
  x: number
  y: number
}

export function HTMLEditor() {
  const [elements, setElements] = useState<DraggableElement[]>([])
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [htmlCode, setHtmlCode] = useState("")
  const [cssCode, setCssCode] = useState("")
  const [previewMode, setPreviewMode] = useState(false)
  const [draggedElement, setDraggedElement] = useState<string | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  const elementTypes = [
    { type: "div" as const, icon: Square, label: "Div" },
    { type: "p" as const, icon: Type, label: "Paragraph" },
    { type: "h1" as const, icon: Type, label: "Heading 1" },
    { type: "h2" as const, icon: Type, label: "Heading 2" },
    { type: "h3" as const, icon: Type, label: "Heading 3" },
    { type: "img" as const, icon: ImageIcon, label: "Image" },
    { type: "button" as const, icon: MousePointer, label: "Button" },
  ]

  const addElement = (type: DraggableElement["type"]) => {
    const newElement: DraggableElement = {
      id: `element-${Date.now()}`,
      type,
      content: getDefaultContent(type),
      styles: getDefaultStyles(type),
      x: 50,
      y: 50,
    }
    setElements([...elements, newElement])
  }

  const getDefaultContent = (type: DraggableElement["type"]): string => {
    switch (type) {
      case "div":
        return "Div Container"
      case "p":
        return "This is a paragraph of text."
      case "h1":
        return "Main Heading"
      case "h2":
        return "Sub Heading"
      case "h3":
        return "Section Heading"
      case "img":
        return "/placeholder.svg?height=100&width=100"
      case "button":
        return "Click Me"
      default:
        return "Element"
    }
  }

  const getDefaultStyles = (type: DraggableElement["type"]): Record<string, string> => {
    const baseStyles = {
      position: "absolute",
      cursor: "move",
      border: "1px solid #ccc",
      padding: "8px",
      backgroundColor: "#ffffff",
      color: "#000000",
    }

    switch (type) {
      case "h1":
        return { ...baseStyles, fontSize: "32px", fontWeight: "bold" }
      case "h2":
        return { ...baseStyles, fontSize: "24px", fontWeight: "bold" }
      case "h3":
        return { ...baseStyles, fontSize: "20px", fontWeight: "bold" }
      case "button":
        return {
          ...baseStyles,
          backgroundColor: "#3b82f6",
          color: "#ffffff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }
      case "img":
        return { ...baseStyles, padding: "0", border: "none" }
      default:
        return baseStyles
    }
  }

  const updateElementContent = (id: string, content: string) => {
    setElements(elements.map((el) => (el.id === id ? { ...el, content } : el)))
  }

  const updateElementStyle = (id: string, property: string, value: string) => {
    setElements(elements.map((el) => (el.id === id ? { ...el, styles: { ...el.styles, [property]: value } } : el)))
  }

  const deleteElement = (id: string) => {
    setElements(elements.filter((el) => el.id !== id))
    if (selectedElement === id) {
      setSelectedElement(null)
    }
  }

  const handleDragStart = (e: React.DragEvent, elementId: string) => {
    setDraggedElement(elementId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (!draggedElement || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setElements(elements.map((el) => (el.id === draggedElement ? { ...el, x, y } : el)))
    setDraggedElement(null)
  }

  const generateHTML = useCallback(() => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Page</title>
    <style>
        ${cssCode}
        ${elements
          .map(
            (el) => `
        #${el.id} {
            ${Object.entries(el.styles)
              .map(([key, value]) => `${key.replace(/([A-Z])/g, "-$1").toLowerCase()}: ${value};`)
              .join("\n            ")}
            left: ${el.x}px;
            top: ${el.y}px;
        }`,
          )
          .join("")}
    </style>
</head>
<body>
    ${elements
      .map((el) => {
        switch (el.type) {
          case "img":
            return `<img id="${el.id}" src="${el.content}" alt="Generated image" />`
          case "button":
            return `<button id="${el.id}">${el.content}</button>`
          default:
            return `<${el.type} id="${el.id}">${el.content}</${el.type}>`
        }
      })
      .join("\n    ")}
</body>
</html>`
    setHtmlCode(html)
    return html
  }, [elements, cssCode])

  const selectedEl = elements.find((el) => el.id === selectedElement)

  const saveProject = () => {
    const projectData = {
      elements,
      cssCode,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem("html-editor-project", JSON.stringify(projectData))
    toast({
      title: "Project saved",
      description: "Your project has been saved locally.",
    })
  }

  const loadProject = () => {
    const saved = localStorage.getItem("html-editor-project")
    if (saved) {
      try {
        const projectData = JSON.parse(saved)
        setElements(projectData.elements || [])
        setCssCode(projectData.cssCode || "")
        toast({
          title: "Project loaded",
          description: "Your saved project has been loaded.",
        })
      } catch (error) {
        toast({
          title: "Error loading project",
          description: "Could not load the saved project.",
          variant: "destructive",
        })
      }
    } else {
      toast({
        title: "No saved project",
        description: "No saved project found.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="w-full h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">HTML/CSS Editor</h2>
        </div>

        <Tabs defaultValue="elements" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3 m-2">
            <TabsTrigger value="elements">Elements</TabsTrigger>
            <TabsTrigger value="styles">Styles</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>

          <TabsContent value="elements" className="flex-1 p-4 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Add Elements</h3>
              <div className="grid grid-cols-2 gap-2">
                {elementTypes.map(({ type, icon: Icon, label }) => (
                  <Button
                    key={type}
                    variant="outline"
                    size="sm"
                    onClick={() => addElement(type)}
                    className="flex items-center gap-2 text-gray-700"
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Elements List</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {elements.map((el) => (
                  <div
                    key={el.id}
                    className={`p-2 border rounded cursor-pointer flex items-center justify-between ${
                      selectedElement === el.id ? "border-blue-500 bg-blue-50" : "border-gray-200"
                    }`}
                    onClick={() => setSelectedElement(el.id)}
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{el.type}</Badge>
                      <span className="text-sm text-gray-600 truncate">{el.content.substring(0, 20)}...</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteElement(el.id)
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="styles" className="flex-1 p-4 space-y-4">
            {selectedEl ? (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">
                  Styling: {selectedEl.type} #{selectedEl.id}
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-600">Content</label>
                    <Textarea
                      value={selectedEl.content}
                      onChange={(e) => updateElementContent(selectedEl.id, e.target.value)}
                      className="mt-1"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-600">Background</label>
                      <input
                        type="color"
                        value={selectedEl.styles.backgroundColor || "#ffffff"}
                        onChange={(e) => updateElementStyle(selectedEl.id, "backgroundColor", e.target.value)}
                        className="w-full h-8 border rounded"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Text Color</label>
                      <input
                        type="color"
                        value={selectedEl.styles.color || "#000000"}
                        onChange={(e) => updateElementStyle(selectedEl.id, "color", e.target.value)}
                        className="w-full h-8 border rounded"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-600">Font Size</label>
                      <input
                        type="text"
                        value={selectedEl.styles.fontSize || "16px"}
                        onChange={(e) => updateElementStyle(selectedEl.id, "fontSize", e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm"
                        placeholder="16px"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Padding</label>
                      <input
                        type="text"
                        value={selectedEl.styles.padding || "8px"}
                        onChange={(e) => updateElementStyle(selectedEl.id, "padding", e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm"
                        placeholder="8px"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-600">Border Radius</label>
                    <input
                      type="text"
                      value={selectedEl.styles.borderRadius || "0px"}
                      onChange={(e) => updateElementStyle(selectedEl.id, "borderRadius", e.target.value)}
                      className="w-full px-2 py-1 border rounded text-sm"
                      placeholder="0px"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Select an element to edit its styles</p>
            )}
          </TabsContent>

          <TabsContent value="code" className="flex-1 p-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Custom CSS</label>
              <Textarea
                value={cssCode}
                onChange={(e) => setCssCode(e.target.value)}
                className="mt-2 font-mono text-sm"
                rows={10}
                placeholder="/* Add your custom CSS here */"
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="p-4 border-t border-gray-200 space-y-2">
          <div className="flex gap-2">
            <Button onClick={saveProject} variant="outline" size="sm" className="flex-1 bg-transparent">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button onClick={loadProject} variant="outline" size="sm" className="flex-1 bg-transparent">
              <Upload className="w-4 h-4 mr-2" />
              Load
            </Button>
          </div>

          <Button onClick={() => setPreviewMode(!previewMode)} variant="outline" className="w-full">
            <Eye className="w-4 h-4 mr-2" />
            {previewMode ? "Edit Mode" : "Preview Mode"}
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Canvas</h3>
          <div className="flex gap-2">
            <Button onClick={generateHTML} variant="outline" size="sm">
              <Code className="w-4 h-4 mr-2" />
              Generate HTML
            </Button>
            <ExportModal htmlCode={generateHTML()} cssCode={cssCode} elements={elements} />
          </div>
        </div>

        <div className="flex-1 bg-gray-50 overflow-auto">
          {previewMode ? (
            <div className="w-full h-full">
              <iframe srcDoc={generateHTML()} className="w-full h-full border-none" title="Preview" />
            </div>
          ) : (
            <div
              ref={canvasRef}
              className="relative w-full h-full min-h-[600px] bg-white m-4 border-2 border-dashed border-gray-300"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {elements.map((el) => (
                <div
                  key={el.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, el.id)}
                  onClick={() => setSelectedElement(el.id)}
                  style={{
                    ...el.styles,
                    left: el.x,
                    top: el.y,
                    border: selectedElement === el.id ? "2px solid #3b82f6" : el.styles.border,
                  }}
                  className={`${selectedElement === el.id ? "ring-2 ring-blue-500" : ""}`}
                >
                  {el.type === "img" ? (
                    <img src={el.content || "/placeholder.svg"} alt="Element" className="max-w-full h-auto" />
                  ) : (
                    el.content
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
