"use client"

import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useBuilderStore } from "@/lib/store/builder-store"
import { Button } from "@/components/ui/button"
import { Plus, Minus } from "lucide-react"

interface CanvasProps {
  deviceMode: "desktop" | "tablet" | "mobile"
}

export function Canvas({ deviceMode }: CanvasProps) {
  const [zoom, setZoom] = useState(100)
  const [draggingElementId, setDraggingElementId] = useState<string | null>(null)
  const [resizingElementId, setResizingElementId] = useState<string | null>(null)
  const [resizeHandle, setResizeHandle] = useState<string>("")
  const canvasRef = useRef<HTMLDivElement>(null)
  const { elements, selectedElement, setSelectedElement, addElement, updateElement } = useBuilderStore()

  const getCanvasDimensions = () => {
    const deviceWidth = deviceMode === "mobile" ? 375 : deviceMode === "tablet" ? 768 : 1200
    const deviceHeight = 600

    if (elements.length === 0) {
      return { width: deviceWidth, height: deviceHeight }
    }

    const maxY = Math.max(...elements.map(el => (el.properties.y || 0) + (el.properties.height || 0)))
    const requiredHeight = Math.max(deviceHeight, maxY + 100)

    return {
      width: deviceWidth,
      height: requiredHeight
    }
  }

  const canvasDimensions = getCanvasDimensions()

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    
    try {
      const data = e.dataTransfer.getData("application/json")
      if (!data) return
      
      const componentData = JSON.parse(data)
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return

      const canvasLeft = rect.left
      const canvasTop = rect.top
      const scrollContainer = document.getElementById('canvas-scroll-container')
      const scrollTop = scrollContainer?.scrollTop || 0
      const scrollLeft = scrollContainer?.scrollLeft || 0
      
      // Calculate position relative to canvas, accounting for zoom and scroll
      const x = ((e.clientX - canvasLeft + scrollLeft) / (zoom / 100))
      const y = ((e.clientY - canvasTop + scrollTop) / (zoom / 100))
      
      const canvasWidth = canvasDimensions.width
      const canvasHeight = canvasDimensions.height
      
      let width = 200
      let height = 100
      
      if (componentData.id === "section") {
        width = Math.min(canvasWidth - 40, 600)
        height = 200
      } else if (componentData.id === "image") {
        width = 250
        height = 200
      } else if (componentData.id === "navigation") {
        width = canvasWidth - 40
        height = 80
      } else if (componentData.id === "hero") {
        width = canvasWidth - 40
        height = 400
      } else if (componentData.id === "footer") {
        width = canvasWidth - 40
        height = 150
      } else if (componentData.id === "heading") {
        width = 400
        height = 80
      } else if (componentData.id === "paragraph") {
        width = 500
        height = 120
      } else if (componentData.id === "button") {
        width = 150
        height = 50
      } else if (componentData.id === "card") {
        width = 350
        height = 300
      }
      
      // Constrain position to ensure component fits within canvas
      const constrainedX = Math.max(20, Math.min(x, canvasWidth - width - 20))
      const constrainedY = Math.max(20, Math.min(y, canvasHeight - height - 20))

      const newElement = {
        id: `${componentData.id}-${Date.now()}`,
        type: componentData.id,
        properties: {
          x: constrainedX,
          y: constrainedY,
          width,
          height,
          backgroundColor: "#ffffff",
          color: "#000000",
          fontSize: 16,
          padding: 16,
          borderRadius: 8,
          borderWidth: 0,
          borderColor: "#000000",
          shadow: "none",
          zIndex: 1,
          text: componentData.id === "text" ? "Your text here" : 
                componentData.id === "button" ? "Click me" :
                componentData.id === "heading" ? "Your Heading" :
                componentData.id === "paragraph" ? "Your paragraph text goes here. This is a longer text block." :
                componentData.id === "link" ? "Click here" : "",
          headingLevel: componentData.id === "heading" ? "h1" : undefined,
          buttonStyle: componentData.id === "button" ? "primary" : undefined,
          linkStyle: componentData.id === "link" ? "default" : undefined,
          dividerStyle: componentData.id === "divider" ? "solid" : undefined,
          sectionStyle: componentData.id === "section" ? "default" : undefined,
          sectionContent: componentData.id === "section" ? "default" : undefined,
          cardStyle: componentData.id === "card" ? "default" : undefined,
          cardContent: componentData.id === "card" ? "default" : undefined,
          cardTitle: componentData.id === "card" ? "Card Title" : undefined,
          cardDescription: componentData.id === "card" ? "This is a beautiful card component." : undefined,
          heroStyle: componentData.id === "hero" ? "default" : undefined,
          heroContent: componentData.id === "hero" ? "default" : undefined,
          navContent: componentData.id === "navigation" ? "default" : undefined,
          footerContent: componentData.id === "footer" ? "default" : undefined,
          fontFamily: "Inter",
          fontWeight: componentData.id === "heading" ? "bold" : "normal",
          textAlign: "left",
          lineHeight: "1.5",
        },
      }

      addElement(newElement)
      setSelectedElement(newElement)
    } catch (error) {
      console.error("Error handling drop:", error)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "copy"
  }

  const handleElementClick = (element: any, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedElement(element)
  }

  const handleCanvasClick = () => {
    setSelectedElement(null)
  }

  const handleElementDragStart = useCallback((element: any, e: React.MouseEvent) => {
    if (resizingElementId) return
    
    e.stopPropagation()
    setDraggingElementId(element.id)
    setSelectedElement(element)

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const scrollContainer = document.getElementById('canvas-scroll-container')
    const scrollTop = scrollContainer?.scrollTop || 0
    const scrollLeft = scrollContainer?.scrollLeft || 0

    const startX = e.clientX
    const startY = e.clientY
    const initialX = element.properties.x || 0
    const initialY = element.properties.y || 0

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = (moveEvent.clientX - startX) / (zoom / 100)
      const deltaY = (moveEvent.clientY - startY) / (zoom / 100)
      
      let newX = initialX + deltaX
      let newY = initialY + deltaY
      
      // Constrain to canvas boundaries
      const canvasWidth = canvasDimensions.width
      const canvasHeight = canvasDimensions.height
      newX = Math.max(0, Math.min(newX, canvasWidth - element.properties.width))
      newY = Math.max(0, Math.min(newY, canvasHeight - element.properties.height))
      
      updateElement(element.id, { x: newX, y: newY })
    }

    const handleMouseUp = () => {
      setDraggingElementId(null)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }, [zoom, canvasDimensions, updateElement, resizingElementId, setSelectedElement])

  const handleResizeStart = useCallback((element: any, handle: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setResizingElementId(element.id)
    setResizeHandle(handle)
    setSelectedElement(element)
    
    const startX = e.clientX
    const startY = e.clientY
    const startWidth = element.properties.width
    const startHeight = element.properties.height
    const startLeft = element.properties.x
    const startTop = element.properties.y

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = (moveEvent.clientX - startX) / (zoom / 100)
      const deltaY = (moveEvent.clientY - startY) / (zoom / 100)

      let newWidth = startWidth
      let newHeight = startHeight
      let newX = startLeft
      let newY = startTop

      const canvasWidth = canvasDimensions.width
      const canvasHeight = canvasDimensions.height

      if (handle.includes('e')) {
        newWidth = Math.max(50, Math.min(startWidth + deltaX, canvasWidth - startLeft - 20))
      }
      if (handle.includes('w')) {
        const possibleWidth = startWidth - deltaX
        if (possibleWidth >= 50 && startLeft + deltaX >= 0) {
          newWidth = possibleWidth
          newX = startLeft + deltaX
        }
      }
      if (handle.includes('s')) {
        newHeight = Math.max(50, Math.min(startHeight + deltaY, canvasHeight - startTop - 20))
      }
      if (handle.includes('n')) {
        const possibleHeight = startHeight - deltaY
        if (possibleHeight >= 50 && startTop + deltaY >= 0) {
          newHeight = possibleHeight
          newY = startTop + deltaY
        }
      }

      updateElement(element.id, {
        width: newWidth,
        height: newHeight,
        x: newX,
        y: newY,
      })
    }

    const handleMouseUp = () => {
      setResizingElementId(null)
      setResizeHandle("")
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }, [zoom, canvasDimensions, updateElement, setSelectedElement])

  const renderComponent = (element: any) => {
    const getShadowStyle = (shadow: string) => {
      switch (shadow) {
        case "sm":
          return "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
        case "md":
          return "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
        case "lg":
          return "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
        case "xl":
          return "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        default:
          return "none"
      }
    }

    const style = {
      width: "100%",
      height: "100%",
      backgroundColor: element.properties.backgroundColor,
      color: element.properties.color,
      fontSize: element.properties.fontSize,
      padding: element.properties.padding,
      borderRadius: element.properties.borderRadius,
      borderWidth: element.properties.borderWidth,
      borderColor: element.properties.borderColor,
      borderStyle: element.properties.borderWidth > 0 ? "solid" : "none",
      boxShadow: getShadowStyle(element.properties.shadow),
      fontFamily: element.properties.fontFamily || 'Inter, sans-serif',
      fontWeight: element.properties.fontWeight || 'normal',
      textAlign: element.properties.textAlign || 'left',
      lineHeight: element.properties.lineHeight || '1.5',
    }

    switch (element.type) {
      case "text":
        return (
          <div style={style} className="flex items-center justify-center">
            <div className="text-center leading-relaxed">
              {element.properties.text || "Your text here"}
            </div>
          </div>
        )

      case "heading":
        const headingLevel = element.properties.headingLevel || "h1"
        const HeadingTag = headingLevel as keyof JSX.IntrinsicElements
        const headingSizes: Record<string, string> = {
          h1: '2.5rem',
          h2: '2rem',
          h3: '1.5rem',
          h4: '1.25rem',
          h5: '1.125rem',
          h6: '1rem'
        }
        return (
          <div style={style} className="flex items-center justify-center">
            <HeadingTag 
              className="font-bold"
              style={{ fontSize: headingSizes[headingLevel] || '2.5rem' }}
            >
              {element.properties.text || "Your Heading"}
            </HeadingTag>
          </div>
        )

      case "paragraph":
        return (
          <div style={style} className="flex items-center justify-center p-4">
            <p className="leading-relaxed">
              {element.properties.text || "Your paragraph text goes here."}
            </p>
          </div>
        )

      case "button":
        const buttonStyle = element.properties.buttonStyle || "primary"
        const buttonVariants: Record<string, string> = {
          primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-md",
          secondary: "bg-gray-600 hover:bg-gray-700 text-white shadow-md",
          outline: "bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white",
          ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
          success: "bg-green-600 hover:bg-green-700 text-white shadow-md",
          danger: "bg-red-600 hover:bg-red-700 text-white shadow-md",
        }
        return (
          <div style={style} className="flex items-center justify-center">
            <button 
              className={`px-6 py-3 rounded-lg font-medium transition-all ${buttonVariants[buttonStyle]}`}
            >
              {element.properties.text || "Click me"}
            </button>
          </div>
        )

      case "image":
        return (
          <div style={style} className="flex items-center justify-center bg-gray-100">
            {element.properties.src ? (
              <img
                src={element.properties.src}
                alt={element.properties.alt || "Image"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-gray-400 text-center">
                <div className="text-4xl mb-2">🖼️</div>
                <div className="text-sm">Image Placeholder</div>
              </div>
            )}
          </div>
        )

      case "divider":
        return (
          <div style={style} className="w-full flex items-center">
            <div className="w-full border-t-2 border-gray-300"></div>
          </div>
        )

      case "section":
        return (
          <div style={style} className="border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-semibold mb-2">
                {element.properties.sectionTitle || "Section Container"}
              </div>
              <div className="text-sm text-gray-600">
                {element.properties.sectionDescription || "Perfect for organizing your content"}
              </div>
            </div>
          </div>
        )

      case "card":
        return (
          <div style={style} className="bg-white border border-gray-200 shadow-sm rounded-lg p-6">
            <div className="text-center">
              <div className="text-xl font-bold mb-2">
                {element.properties.cardTitle || "Card Title"}
              </div>
              <div className="text-sm text-gray-600">
                {element.properties.cardDescription || "This is a beautiful card component."}
              </div>
            </div>
          </div>
        )

      case "hero":
        return (
          <div style={style} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">
                {element.properties.heroTitle || "Hero Section"}
              </h1>
              <p className="text-xl">
                {element.properties.heroDescription || "Create stunning hero sections"}
              </p>
            </div>
          </div>
        )

      case "navigation":
        return (
          <div style={style} className="bg-white border-b border-gray-200 flex items-center justify-between px-6">
            <div className="text-xl font-bold">
              {element.properties.navLogoText || "Logo"}
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-gray-900">Home</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">About</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Contact</a>
            </div>
          </div>
        )

      case "footer":
        return (
          <div style={style} className="bg-gray-800 text-white flex items-center justify-center">
            <div className="text-center">
              <div className="text-xl font-bold mb-2">
                {element.properties.footerCompanyName || "Your Company"}
              </div>
              <div className="text-sm opacity-75">
                {element.properties.footerCopyrightText || "© 2024 All rights reserved"}
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div style={style} className="flex items-center justify-center text-gray-500 bg-gray-50">
            <div className="text-center">
              <div className="text-lg font-semibold mb-2">{element.type}</div>
              <div className="text-sm">Component</div>
            </div>
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
          <span className="text-sm text-slate-600 dark:text-slate-400">
            {canvasDimensions.width} × {canvasDimensions.height}
          </span>
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
          <span className="text-sm text-slate-600 dark:text-slate-400">
            {elements.length} component{elements.length !== 1 ? 's' : ''}
          </span>
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

      {/* Canvas Area with Scroll */}
      <div 
        className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-800" 
        id="canvas-scroll-container"
      >
        <div className="p-8 flex justify-center items-start min-h-full">
          <div
            ref={canvasRef}
            className={cn(
              "bg-white dark:bg-slate-800 shadow-xl rounded-lg relative border-2 border-blue-300",
            )}
            style={{
              width: canvasDimensions.width,
              height: canvasDimensions.height,
              transform: `scale(${zoom / 100})`,
              transformOrigin: "top center",
            }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={handleCanvasClick}
          >
            {/* Grid Background */}
            <div
              className="absolute inset-0 opacity-5 pointer-events-none"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #000 1px, transparent 1px),
                  linear-gradient(to bottom, #000 1px, transparent 1px)
                `,
                backgroundSize: "20px 20px",
              }}
            />

            {/* Device Boundary Indicator */}
            <div className="absolute top-2 left-2 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium pointer-events-none z-50">
              {deviceMode.charAt(0).toUpperCase() + deviceMode.slice(1)} - {canvasDimensions.width}×{canvasDimensions.height}px
            </div>

            {/* Render Elements */}
            {elements.map((element) => {
              const isSelected = selectedElement?.id === element.id
              const isDragging = draggingElementId === element.id
              const isResizing = resizingElementId === element.id
              
              return (
                <div
                  key={element.id}
                  className={cn(
                    "absolute cursor-move transition-shadow",
                    isSelected && "ring-2 ring-blue-500 shadow-lg",
                    isDragging && "opacity-70",
                    isResizing && "ring-2 ring-orange-500"
                  )}
                  style={{
                    left: element.properties.x,
                    top: element.properties.y,
                    width: element.properties.width,
                    height: element.properties.height,
                    zIndex: element.properties.zIndex,
                  }}
                  onClick={(e) => handleElementClick(element, e)}
                  onMouseDown={(e) => handleElementDragStart(element, e)}
                >
                  {renderComponent(element)}

                  {/* Resize Handles */}
                  {isSelected && (
                    <>
                      <div
                        className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 border-2 border-white cursor-nw-resize z-10"
                        onMouseDown={(e) => handleResizeStart(element, "nw", e)}
                      />
                      <div
                        className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-500 border-2 border-white cursor-n-resize z-10"
                        onMouseDown={(e) => handleResizeStart(element, "n", e)}
                      />
                      <div
                        className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border-2 border-white cursor-ne-resize z-10"
                        onMouseDown={(e) => handleResizeStart(element, "ne", e)}
                      />
                      <div
                        className="absolute top-1/2 -translate-y-1/2 -right-1 w-3 h-3 bg-blue-500 border-2 border-white cursor-e-resize z-10"
                        onMouseDown={(e) => handleResizeStart(element, "e", e)}
                      />
                      <div
                        className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border-2 border-white cursor-se-resize z-10"
                        onMouseDown={(e) => handleResizeStart(element, "se", e)}
                      />
                      <div
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-500 border-2 border-white cursor-s-resize z-10"
                        onMouseDown={(e) => handleResizeStart(element, "s", e)}
                      />
                      <div
                        className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 border-2 border-white cursor-sw-resize z-10"
                        onMouseDown={(e) => handleResizeStart(element, "sw", e)}
                      />
                      <div
                        className="absolute top-1/2 -translate-y-1/2 -left-1 w-3 h-3 bg-blue-500 border-2 border-white cursor-w-resize z-10"
                        onMouseDown={(e) => handleResizeStart(element, "w", e)}
                      />
                    </>
                  )}
                </div>
              )
            })}

            {/* Empty State */}
            {elements.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
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
