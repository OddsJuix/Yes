"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, Copy, FileText, Archive } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface ExportModalProps {
  htmlCode: string
  cssCode: string
  elements: any[]
}

export function ExportModal({ htmlCode, cssCode, elements }: ExportModalProps) {
  const [projectName, setProjectName] = useState("my-website")
  const [includeBootstrap, setIncludeBootstrap] = useState(false)
  const [includeJQuery, setIncludeJQuery] = useState(false)

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied to clipboard",
        description: "The code has been copied to your clipboard.",
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard. Please copy manually.",
        variant: "destructive",
      })
    }
  }

  const generateEnhancedHTML = () => {
    const bootstrapCSS = includeBootstrap
      ? '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">'
      : ""
    const jqueryJS = includeJQuery ? '<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>' : ""
    const bootstrapJS = includeBootstrap
      ? '<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>'
      : ""

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${projectName}</title>
    ${bootstrapCSS}
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
            return `<button id="${el.id}" class="btn">${el.content}</button>`
          default:
            return `<${el.type} id="${el.id}">${el.content}</${el.type}>`
        }
      })
      .join("\n    ")}
    
    ${jqueryJS}
    ${bootstrapJS}
</body>
</html>`
  }

  const generateSeparateCSS = () => {
    return `/* Generated CSS for ${projectName} */
${cssCode}

${elements
  .map(
    (el) => `
#${el.id} {
    ${Object.entries(el.styles)
      .map(([key, value]) => `${key.replace(/([A-Z])/g, "-$1").toLowerCase()}: ${value};`)
      .join("\n    ")}
    left: ${el.x}px;
    top: ${el.y}px;
}`,
  )
  .join("")}`
  }

  const generateProjectJSON = () => {
    return JSON.stringify(
      {
        projectName,
        version: "1.0.0",
        created: new Date().toISOString(),
        elements,
        customCSS: cssCode,
        settings: {
          includeBootstrap,
          includeJQuery,
        },
      },
      null,
      2,
    )
  }

  const downloadProject = () => {
    const html = generateEnhancedHTML()
    const css = generateSeparateCSS()
    const js = `// JavaScript for ${projectName}\n// Add your custom JavaScript here\n\nconsole.log('${projectName} loaded successfully!');`
    const json = generateProjectJSON()

    // Create a zip-like structure by downloading multiple files
    downloadFile(html, `${projectName}.html`, "text/html")
    setTimeout(() => downloadFile(css, `${projectName}.css`, "text/css"), 100)
    setTimeout(() => downloadFile(js, `${projectName}.js`, "text/javascript"), 200)
    setTimeout(() => downloadFile(json, `${projectName}-project.json`, "application/json"), 300)

    toast({
      title: "Project exported",
      description: "Your project files have been downloaded.",
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Project
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Export Your Project</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="my-website"
              />
            </div>
            <div className="space-y-2">
              <Label>Include Libraries</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeBootstrap}
                    onChange={(e) => setIncludeBootstrap(e.target.checked)}
                  />
                  Bootstrap 5
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={includeJQuery} onChange={(e) => setIncludeJQuery(e.target.checked)} />
                  jQuery
                </label>
              </div>
            </div>
          </div>

          <Tabs defaultValue="preview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="html">HTML</TabsTrigger>
              <TabsTrigger value="css">CSS</TabsTrigger>
              <TabsTrigger value="project">Project</TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="space-y-4">
              <div className="border rounded-lg p-4 bg-gray-50">
                <iframe srcDoc={generateEnhancedHTML()} className="w-full h-96 border rounded" title="Export Preview" />
              </div>
              <div className="flex gap-2">
                <Button onClick={downloadProject} className="flex items-center gap-2">
                  <Archive className="w-4 h-4" />
                  Download Complete Project
                </Button>
                <Button
                  variant="outline"
                  onClick={() => downloadFile(generateEnhancedHTML(), `${projectName}.html`, "text/html")}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Download HTML Only
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="html" className="space-y-4">
              <Textarea value={generateEnhancedHTML()} readOnly className="font-mono text-sm h-96" />
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => copyToClipboard(generateEnhancedHTML())}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy HTML
                </Button>
                <Button
                  variant="outline"
                  onClick={() => downloadFile(generateEnhancedHTML(), `${projectName}.html`, "text/html")}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download HTML
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="css" className="space-y-4">
              <Textarea value={generateSeparateCSS()} readOnly className="font-mono text-sm h-96" />
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => copyToClipboard(generateSeparateCSS())}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy CSS
                </Button>
                <Button
                  variant="outline"
                  onClick={() => downloadFile(generateSeparateCSS(), `${projectName}.css`, "text/css")}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download CSS
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="project" className="space-y-4">
              <Textarea value={generateProjectJSON()} readOnly className="font-mono text-sm h-96" />
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => copyToClipboard(generateProjectJSON())}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Project Data
                </Button>
                <Button
                  variant="outline"
                  onClick={() => downloadFile(generateProjectJSON(), `${projectName}-project.json`, "application/json")}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Project File
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
