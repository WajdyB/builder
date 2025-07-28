"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"
import { useBuilderStore } from "@/lib/store/builder-store"
import { Button } from "@/components/ui/button"
import { Plus, Minus } from "lucide-react"

interface CanvasProps {
  deviceMode: "desktop" | "tablet" | "mobile"
}

export function Canvas({ deviceMode }: CanvasProps) {
  const [zoom, setZoom] = useState(100)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeHandle, setResizeHandle] = useState<string>("")
  const canvasRef = useRef<HTMLDivElement>(null)
  const { elements, selectedElement, setSelectedElement, addElement, updateElement } = useBuilderStore()

  const getCanvasWidth = () => {
    switch (deviceMode) {
      case "mobile":
        return "375px"
      case "tablet":
        return "768px"
      default:
        return "100%"
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    
    try {
      const data = e.dataTransfer.getData("application/json")
      if (!data) return
      
      const componentData = JSON.parse(data)
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return

      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Set default dimensions based on component type
      let width = 200
      let height = 100
      
      if (componentData.id === "section") {
        width = rect.width
        height = 200
      } else if (componentData.id === "image") {
        width = 300
        height = 200
      } else if (componentData.id === "button") {
        width = 120
        height = 40
      } else if (componentData.id === "text") {
        width = 200
        height = 60
      }

      const newElement = {
        id: `${componentData.id}-${Date.now()}`,
        type: componentData.id,
        properties: {
          x,
          y,
          width,
          height,
          text: componentData.name || "New Element",
          backgroundColor: "#ffffff",
          color: "#000000",
          fontSize: 16,
          padding: 8,
          borderRadius: 0,
          zIndex: 1,
        },
      }

      addElement(newElement)
    } catch (error) {
      console.error("Error handling drop:", error)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "copy"
  }

  const handleElementClick = (element: any) => {
    setSelectedElement(element)
  }

  const handleResizeStart = useCallback((element: any, handle: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setIsResizing(true)
    setResizeHandle(handle)
    
    const startX = e.clientX
    const startY = e.clientY
    const startWidth = element.properties.width
    const startHeight = element.properties.height
    const startLeft = element.properties.x
    const startTop = element.properties.y

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX
      const deltaY = moveEvent.clientY - startY

      let newWidth = startWidth
      let newHeight = startHeight
      let newX = startLeft
      let newY = startTop

      // Handle different resize directions
      if (handle.includes('e')) {
        newWidth = Math.max(50, startWidth + deltaX)
      }
      if (handle.includes('w')) {
        const maxDelta = startWidth - 50
        const actualDelta = Math.min(deltaX, maxDelta)
        newWidth = Math.max(50, startWidth - actualDelta)
        newX = startLeft + actualDelta
      }
      if (handle.includes('s')) {
        newHeight = Math.max(50, startHeight + deltaY)
      }
      if (handle.includes('n')) {
        const maxDelta = startHeight - 50
        const actualDelta = Math.min(deltaY, maxDelta)
        newHeight = Math.max(50, startHeight - actualDelta)
        newY = startTop + actualDelta
      }

      updateElement(element.id, {
        width: newWidth,
        height: newHeight,
        x: newX,
        y: newY,
      })
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      setResizeHandle("")
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }, [updateElement])

  const renderComponent = (element: any) => {
    const style = {
      width: element.properties.width,
      height: element.properties.height,
      backgroundColor: element.properties.backgroundColor,
      color: element.properties.color,
      fontSize: element.properties.fontSize,
      padding: element.properties.padding,
      borderRadius: element.properties.borderRadius,
      position: "absolute",
      zIndex: element.properties.zIndex,
    }

    switch (element.type) {
      case "text":
        return (
          <div className="w-full h-full flex items-center justify-center p-4">
            <div className="text-center">
              {element.properties.text || "Text Element"}
            </div>
          </div>
        )

      case "button":
        return (
          <div className="w-full h-full flex items-center justify-center">
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              style={{ fontSize: element.properties.fontSize }}
            >
              {element.properties.text || "Button"}
            </button>
          </div>
        )

      case "image":
        return (
          <div className="w-full h-full">
            <img
              src={element.properties.src || "/placeholder.svg"}
              alt={element.properties.alt || "Image"}
              className="w-full h-full object-cover"
            />
          </div>
        )

      case "divider":
        return (
          <div className="w-full h-full flex items-center justify-center">
            <hr className="w-full border-t border-slate-300 dark:border-slate-600" />
          </div>
        )

      case "section":
        return (
          <div className="w-full h-full border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 flex items-center justify-center">
            <div className="text-center text-slate-500 dark:text-slate-400">
              <div className="text-lg font-semibold mb-2">Section Container</div>
              <div className="text-sm opacity-75">Drag other elements here</div>
            </div>
          </div>
        )

      case "input":
        return (
          <div className="w-full h-full flex items-center justify-center p-4">
            <input
              type={element.properties.inputType || "text"}
              placeholder={element.properties.placeholder || "Input field"}
              className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )

      case "textarea":
        return (
          <div className="w-full h-full p-4">
            <textarea
              placeholder={element.properties.placeholder || "Textarea"}
              rows={element.properties.rows || 3}
              className="w-full h-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        )

      case "checkbox":
        return (
          <div className="w-full h-full flex items-center justify-center">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4" />
              <span>{element.properties.label || "Checkbox"}</span>
            </label>
          </div>
        )

      default:
        return (
          <div className="w-full h-full flex items-center justify-center text-slate-500">
            {element.type} Component
          </div>
        )
    }
  }

  const zoomIn = () => setZoom((prev) => Math.min(200, prev + 10))
  const zoomOut = () => setZoom((prev) => Math.max(25, prev - 10))

  return (
    <div className="flex-1 bg-slate-100 dark:bg-slate-900 flex flex-col">
      {/* Canvas Controls */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-600 dark:text-slate-400">
            {deviceMode.charAt(0).toUpperCase() + deviceMode.slice(1)} View
          </span>
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
          <span className="text-sm text-slate-600 dark:text-slate-400">{getCanvasWidth()}</span>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={zoomOut}>
            <Minus className="w-4 h-4" />
          </Button>
          <span className="text-sm text-slate-600 dark:text-slate-400 min-w-[60px] text-center">{zoom}%</span>
          <Button variant="ghost" size="sm" onClick={zoomIn}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 overflow-auto p-8">
        <div className="flex justify-center">
          <div
            ref={canvasRef}
            className={cn(
              "bg-white dark:bg-slate-800 shadow-lg rounded-lg min-h-[600px] relative overflow-hidden",
              deviceMode === "mobile" && "max-w-[375px]",
              deviceMode === "tablet" && "max-w-[768px]",
              deviceMode === "desktop" && "w-full max-w-none",
            )}
            style={{
              width: getCanvasWidth(),
              transform: `scale(${zoom / 100})`,
              transformOrigin: "top center",
            }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {/* Grid Background */}
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #000 1px, transparent 1px),
                  linear-gradient(to bottom, #000 1px, transparent 1px)
                `,
                backgroundSize: "20px 20px",
              }}
            />

            {/* Render Elements */}
            {elements.map((element) => {
              let isDragging = false
              let dragOffset = { x: 0, y: 0 }
              const isSelected = selectedElement?.id === element.id
              
              return (
                <div
                  key={element.id}
                  className={cn(
                    "absolute cursor-pointer border-2 border-transparent hover:border-blue-400 transition-all duration-200",
                    isSelected && "border-blue-500 ring-2 ring-blue-200",
                    isResizing && isSelected && "border-orange-500 ring-2 ring-orange-200"
                  )}
                  style={{
                    left: element.properties.x,
                    top: element.properties.y,
                    width: element.properties.width,
                    height: element.properties.height,
                    backgroundColor: element.properties.backgroundColor,
                    color: element.properties.color,
                    fontSize: element.properties.fontSize,
                    padding: element.properties.padding,
                    borderRadius: element.properties.borderRadius,
                    position: "absolute",
                    zIndex: element.properties.zIndex,
                  }}
                  onClick={() => handleElementClick(element)}
                  onMouseDown={(e) => {
                    if (e.button !== 0 || isResizing) return
                    isDragging = true
                    const rect = canvasRef.current?.getBoundingClientRect()
                    dragOffset = {
                      x: e.clientX - (rect?.left || 0) - (element.properties.x || 0),
                      y: e.clientY - (rect?.top || 0) - (element.properties.y || 0),
                    }
                    const handleMouseMove = (moveEvent: MouseEvent) => {
                      if (!isDragging) return
                      const newX = moveEvent.clientX - (rect?.left || 0) - dragOffset.x
                      const newY = moveEvent.clientY - (rect?.top || 0) - dragOffset.y
                      updateElement(element.id, { x: newX, y: newY })
                    }
                    const handleMouseUp = () => {
                      isDragging = false
                      document.removeEventListener("mousemove", handleMouseMove)
                      document.removeEventListener("mouseup", handleMouseUp)
                    }
                    document.addEventListener("mousemove", handleMouseMove)
                    document.addEventListener("mouseup", handleMouseUp)
                  }}
                >
                  {renderComponent(element)}

                  {/* Resize Handles */}
                  {isSelected && (
                    <>
                      {/* Top-left */}
                      <div
                        className="absolute top-0 left-0 w-3 h-3 bg-blue-500 border border-white cursor-nw-resize"
                        onMouseDown={(e) => handleResizeStart(element, "nw", e)}
                      />
                      {/* Top */}
                      <div
                        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 border border-white cursor-n-resize"
                        onMouseDown={(e) => handleResizeStart(element, "n", e)}
                      />
                      {/* Top-right */}
                      <div
                        className="absolute top-0 right-0 w-3 h-3 bg-blue-500 border border-white cursor-ne-resize"
                        onMouseDown={(e) => handleResizeStart(element, "ne", e)}
                      />
                      {/* Right */}
                      <div
                        className="absolute top-1/2 right-0 transform -translate-y-1/2 w-3 h-3 bg-blue-500 border border-white cursor-e-resize"
                        onMouseDown={(e) => handleResizeStart(element, "e", e)}
                      />
                      {/* Bottom-right */}
                      <div
                        className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 border border-white cursor-se-resize"
                        onMouseDown={(e) => handleResizeStart(element, "se", e)}
                      />
                      {/* Bottom */}
                      <div
                        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 border border-white cursor-s-resize"
                        onMouseDown={(e) => handleResizeStart(element, "s", e)}
                      />
                      {/* Bottom-left */}
                      <div
                        className="absolute bottom-0 left-0 w-3 h-3 bg-blue-500 border border-white cursor-sw-resize"
                        onMouseDown={(e) => handleResizeStart(element, "sw", e)}
                      />
                      {/* Left */}
                      <div
                        className="absolute top-1/2 left-0 transform -translate-y-1/2 w-3 h-3 bg-blue-500 border border-white cursor-w-resize"
                        onMouseDown={(e) => handleResizeStart(element, "w", e)}
                      />
                    </>
                  )}
                </div>
              )
            })}

            {/* Empty State */}
            {elements.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-slate-500 dark:text-slate-400">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Start Building</h3>
                  <p className="text-sm">Drag components from the left panel to get started</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
