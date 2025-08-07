"use client"

import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useBuilderStore } from "@/lib/store/builder-store"
import { Button } from "@/components/ui/button"
import { Plus, Minus, Play, ImageIcon, ChevronDown } from "lucide-react"

interface CanvasProps {
  deviceMode: "desktop" | "tablet" | "mobile"
}

export function Canvas({ deviceMode }: CanvasProps) {
  const [zoom, setZoom] = useState(100)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeHandle, setResizeHandle] = useState<string>("")
  const canvasRef = useRef<HTMLDivElement>(null)
  const { elements, selectedElement, setSelectedElement, addElement, updateElement } = useBuilderStore()

  // Canvas width is now handled in getCanvasDimensions

  // Dynamically calculate canvas dimensions based on content and minimum sizes
  const getCanvasDimensions = () => {
    if (elements.length === 0) {
      return {
        width: deviceMode === "mobile" ? 375 : deviceMode === "tablet" ? 768 : 800,
        height: 300
      }
    }

    // Find the boundaries of all elements
    const minX = Math.min(...elements.map(el => el.properties.x || 0))
    const maxX = Math.max(...elements.map(el => (el.properties.x || 0) + (el.properties.width || 0)))
    const minY = Math.min(...elements.map(el => el.properties.y || 0))
    const maxY = Math.max(...elements.map(el => (el.properties.y || 0) + (el.properties.height || 0)))

    // Calculate required dimensions with padding
    const requiredWidth = Math.max(
      deviceMode === "mobile" ? 375 : deviceMode === "tablet" ? 768 : 800,
      maxX + 100 // Add 100px padding
    )
    const requiredHeight = Math.max(300, maxY + 100) // Add 100px padding

    return {
      width: requiredWidth,
      height: requiredHeight
    }
  }

  const canvasDimensions = getCanvasDimensions()

  // Monitor scroll container
  useEffect(() => {
    const scrollContainer = document.getElementById('canvas-scroll-container')
    if (scrollContainer) {
      console.log('Canvas dimensions:', canvasDimensions)
      console.log('Scroll container dimensions:', {
        scrollHeight: scrollContainer.scrollHeight,
        clientHeight: scrollContainer.clientHeight,
        scrollTop: scrollContainer.scrollTop,
        offsetHeight: scrollContainer.offsetHeight
      })
    }
  }, [canvasDimensions, elements.length])

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    
    try {
      const data = e.dataTransfer.getData("application/json")
      if (!data) return
      
      const componentData = JSON.parse(data)
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return

      // Calculate position relative to canvas, accounting for zoom and scroll
      const canvasLeft = rect.left
      const canvasTop = rect.top
      const x = (e.clientX - canvasLeft) / (zoom / 100)
      const y = (e.clientY - canvasTop) / (zoom / 100)
      
      // Ensure minimum position values and keep within canvas boundaries
      const canvasWidth = canvasDimensions.width
      const canvasHeight = canvasDimensions.height
      
      // Calculate component dimensions first to ensure proper boundary checking
      let width = 200
      let height = 100
      
      // Ensure all components fit within canvas boundaries with proper margins
      const maxWidth = canvasWidth - 40 // 20px margin on each side
      const maxHeight = canvasHeight - 40 // 20px margin on each side
      
      if (componentData.id === "section") {
        width = Math.min(maxWidth, 600)
        height = Math.min(maxHeight, 200)
      } else if (componentData.id === "image") {
        width = Math.min(maxWidth, 250)
        height = Math.min(maxHeight, 150)
      } else if (componentData.id === "button") {
        width = Math.min(maxWidth, 120)
        height = Math.min(maxHeight, 40)
      } else if (componentData.id === "text") {
        width = Math.min(maxWidth, 200)
        height = Math.min(maxHeight, 60)
      } else if (componentData.id === "heading") {
        width = Math.min(maxWidth, 300)
        height = Math.min(maxHeight, 80)
      } else if (componentData.id === "paragraph") {
        width = Math.min(maxWidth, 300)
        height = Math.min(maxHeight, 100)
      } else if (componentData.id === "link") {
        width = Math.min(maxWidth, 150)
        height = Math.min(maxHeight, 40)
      } else if (componentData.id === "hero") {
        width = Math.min(maxWidth, 700)
        height = Math.min(maxHeight, 300)
      } else if (componentData.id === "navigation") {
        width = Math.min(maxWidth, 700)
        height = Math.min(maxHeight, 60)
      } else if (componentData.id === "footer") {
        width = Math.min(maxWidth, 700)
        height = Math.min(maxHeight, 100)
      } else if (componentData.id === "card") {
        width = Math.min(maxWidth, 250)
        height = Math.min(maxHeight, 150)
      } else if (componentData.id === "input") {
        width = Math.min(maxWidth, 250)
        height = Math.min(maxHeight, 50)
      } else if (componentData.id === "textarea") {
        width = Math.min(maxWidth, 250)
        height = Math.min(maxHeight, 100)
      } else if (componentData.id === "checkbox") {
        width = Math.min(maxWidth, 200)
        height = Math.min(maxHeight, 40)
      } else if (componentData.id === "radio") {
        width = Math.min(maxWidth, 200)
        height = Math.min(maxHeight, 40)
      } else if (componentData.id === "select") {
        width = Math.min(maxWidth, 200)
        height = Math.min(maxHeight, 50)
      } else if (componentData.id === "label") {
        width = Math.min(maxWidth, 150)
        height = Math.min(maxHeight, 30)
      } else if (componentData.id === "divider") {
        width = Math.min(maxWidth, 300)
        height = Math.min(maxHeight, 20)
      } else if (componentData.id === "form") {
        width = Math.min(maxWidth, 300)
        height = Math.min(maxHeight, 250)
      } else if (componentData.id === "tabs") {
        width = Math.min(maxWidth, 350)
        height = Math.min(maxHeight, 120)
      } else if (componentData.id === "accordion") {
        width = Math.min(maxWidth, 350)
        height = Math.min(maxHeight, 150)
      } else if (componentData.id === "modal") {
        width = Math.min(maxWidth, 300)
        height = Math.min(maxHeight, 200)
      } else if (componentData.id === "tooltip") {
        width = Math.min(maxWidth, 150)
        height = Math.min(maxHeight, 50)
      } else if (componentData.id === "dropdown") {
        width = Math.min(maxWidth, 200)
        height = Math.min(maxHeight, 50)
      } else if (componentData.id === "video") {
        width = Math.min(maxWidth, 300)
        height = Math.min(maxHeight, 200)
      } else if (componentData.id === "gallery") {
        width = Math.min(maxWidth, 300)
        height = Math.min(maxHeight, 200)
      } else if (componentData.id === "slider") {
        width = Math.min(maxWidth, 300)
        height = Math.min(maxHeight, 200)
      } else if (componentData.id === "icon") {
        width = Math.min(maxWidth, 100)
        height = Math.min(maxHeight, 100)
      } else if (componentData.id === "pricing") {
        width = Math.min(maxWidth, 200)
        height = Math.min(maxHeight, 250)
      } else if (componentData.id === "testimonial") {
        width = Math.min(maxWidth, 250)
        height = Math.min(maxHeight, 150)
      } else if (componentData.id === "contact") {
        width = Math.min(maxWidth, 300)
        height = Math.min(maxHeight, 200)
      } else if (componentData.id === "newsletter") {
        width = Math.min(maxWidth, 350)
        height = Math.min(maxHeight, 120)
      } else if (componentData.id === "social") {
        width = Math.min(maxWidth, 200)
        height = Math.min(maxHeight, 60)
      } else if (componentData.id === "container") {
        width = Math.min(maxWidth, 500)
        height = Math.min(maxHeight, 200)
      } else if (componentData.id === "grid") {
        width = Math.min(maxWidth, 400)
        height = Math.min(maxHeight, 200)
      } else if (componentData.id === "flex") {
        width = Math.min(maxWidth, 400)
        height = Math.min(maxHeight, 200)
      } else if (componentData.id === "sidebar") {
        width = Math.min(maxWidth, 200)
        height = Math.min(maxHeight, 300)
      }
      
      // Ensure position keeps component fully within canvas boundaries
      const finalX = Math.max(0, Math.min(x, canvasWidth - width))
      const finalY = Math.max(0, Math.min(y, canvasHeight - height))

      const newElement = {
        id: `${componentData.id}-${Date.now()}`,
        type: componentData.id,
        properties: {
          x: finalX,
          y: finalY,
          width,
          height,
          backgroundColor: "#ffffff",
          color: "#000000",
          fontSize: 16,
          padding: 8,
          borderRadius: 0,
          borderWidth: 0,
          borderColor: "#000000",
          shadow: "none",
          zIndex: 1,
          // Component-specific defaults
          text: componentData.id === "text" ? "" : 
                componentData.id === "button" ? "Click me" :
                componentData.id === "heading" ? "Your Heading" :
                componentData.id === "paragraph" ? "" :
                componentData.id === "link" ? "Click here" : "",
          headingLevel: componentData.id === "heading" ? "h1" : "h1",
          buttonStyle: componentData.id === "button" ? "primary" : "default",
          buttonSize: componentData.id === "button" ? "default" : "default",
          disabled: componentData.id === "button" ? false : false,
          loading: componentData.id === "button" ? false : false,
          href: componentData.id === "link" ? "#" : "#",
          target: componentData.id === "link" ? "_self" : "_self",
          linkStyle: componentData.id === "link" ? "default" : "default",
          dividerStyle: componentData.id === "divider" ? "solid" : "default",
          sectionStyle: componentData.id === "section" ? "default" : "default",
          sectionContent: componentData.id === "section" ? "default" : "default",
          sectionTitle: componentData.id === "section" ? "Section Container" : "",
          sectionDescription: componentData.id === "section" ? "Perfect for organizing your content" : "",
          heroContent: componentData.id === "hero" ? "default" : "default",
          heroTitle: componentData.id === "hero" ? "Hero Section" : "",
          heroDescription: componentData.id === "hero" ? "Create stunning hero sections for your website" : "",
          heroButtonText: componentData.id === "hero" ? "Get Started" : "",
          navContent: componentData.id === "navigation" ? "default" : "default",
          navLogoText: componentData.id === "navigation" ? "Logo" : "",
          customMenuItems: componentData.id === "navigation" ? "Home,About,Services,Contact" : "",
          footerContent: componentData.id === "footer" ? "default" : "default",
          footerCompanyName: componentData.id === "footer" ? "Your Company" : "",
          footerCopyrightText: componentData.id === "footer" ? "© 2024 All rights reserved" : "",
          footerAdditionalText: componentData.id === "footer" ? "" : "",
          cardStyle: componentData.id === "card" ? "default" : "default",
          heroStyle: componentData.id === "hero" ? "default" : "default",
          imageStyle: componentData.id === "image" ? "default" : "default",
          objectFit: componentData.id === "image" ? "cover" : "cover",
          lazy: componentData.id === "image" ? false : false,
          inputStyle: componentData.id === "input" ? "default" : "default",
          textareaStyle: componentData.id === "textarea" ? "default" : "default",
          checkboxStyle: componentData.id === "checkbox" ? "default" : "default",
          // New styling properties
          fontFamily: "Inter",
          fontWeight: "normal",
          textAlign: "left",
          lineHeight: "1.5",
          opacity: 100,
          transform: "none",
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

      // Get canvas boundaries
      const canvasWidth = canvasDimensions.width
      const canvasHeight = canvasDimensions.height

      // Handle different resize directions with boundary constraints
      if (handle.includes('e')) {
        newWidth = Math.max(50, Math.min(startWidth + deltaX, canvasWidth - startLeft))
      }
      if (handle.includes('w')) {
        const maxDelta = startWidth - 50
        const actualDelta = Math.min(deltaX, maxDelta)
        newWidth = Math.max(50, startWidth - actualDelta)
        newX = Math.max(0, startLeft + actualDelta)
      }
      if (handle.includes('s')) {
        newHeight = Math.max(50, Math.min(startHeight + deltaY, canvasHeight - startTop))
      }
      if (handle.includes('n')) {
        const maxDelta = startHeight - 50
        const actualDelta = Math.min(deltaY, maxDelta)
        newHeight = Math.max(50, startHeight - actualDelta)
        newY = Math.max(0, startTop + actualDelta)
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
  }, [updateElement, canvasDimensions])

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
        case "inner":
          return "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)"
        case "glow":
          return "0 0 20px rgba(59, 130, 246, 0.5)"
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
      opacity: element.properties.opacity ? element.properties.opacity / 100 : 1,
      transform: element.properties.transform || "none",
      display: element.properties.display,
      flexDirection: element.properties.flexDirection,
      justifyContent: element.properties.justifyContent,
      alignItems: element.properties.alignItems,
    }

    switch (element.type) {
      case "text":
        return (
          <div style={style} className="flex items-center justify-center p-4">
            <div 
              className="text-center leading-relaxed"
              style={{ 
                fontFamily: element.properties.fontFamily || 'Inter, sans-serif',
                fontWeight: element.properties.fontWeight || 'normal',
                textAlign: element.properties.textAlign || 'center',
                lineHeight: element.properties.lineHeight || '1.5'
              }}
            >
              {element.properties.text || ""}
            </div>
          </div>
        )

      case "heading":
        const headingLevel = element.properties.headingLevel || "h1"
        const HeadingTag = headingLevel as keyof JSX.IntrinsicElements
        console.log('Rendering heading with level:', headingLevel, 'properties:', element.properties)
        return (
          <div style={style} className="flex items-center justify-center p-4">
            <div className="text-center">
                          <HeadingTag 
              className="text-center font-bold"
              style={{ 
                fontFamily: element.properties.fontFamily || 'Inter, sans-serif',
                fontWeight: element.properties.fontWeight || 'bold',
                textAlign: element.properties.textAlign || 'center',
                lineHeight: element.properties.lineHeight || '1.2',
                fontSize: headingLevel === 'h1' ? '2.5rem' :
                         headingLevel === 'h2' ? '2rem' :
                         headingLevel === 'h3' ? '1.5rem' :
                         headingLevel === 'h4' ? '1.25rem' :
                         headingLevel === 'h5' ? '1.125rem' :
                         headingLevel === 'h6' ? '1rem' : '2.5rem'
              }}
            >
              {element.properties.text || ""}
            </HeadingTag>
              <div className="text-xs text-gray-500 mt-1">Level: {headingLevel}</div>
            </div>
          </div>
        )

      case "paragraph":
        return (
          <div style={style} className="flex items-center justify-center p-4">
            <p 
              className="text-center leading-relaxed"
              style={{ 
                fontFamily: element.properties.fontFamily || 'Inter, sans-serif',
                fontWeight: element.properties.fontWeight || 'normal',
                textAlign: element.properties.textAlign || 'left',
                lineHeight: element.properties.lineHeight || '1.6'
              }}
            >
              {element.properties.text || ""}
            </p>
          </div>
        )

      case "link":
        const linkStyle = element.properties.linkStyle || "default"
        const linkVariants = {
          default: "text-blue-600 hover:text-blue-800 underline transition-colors",
          button: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors",
          outline: "border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-lg transition-colors",
          minimal: "text-gray-600 hover:text-gray-900 underline transition-colors",
          accent: "text-purple-600 hover:text-purple-800 underline transition-colors"
        }
        
        return (
          <div style={style} className="flex items-center justify-center p-4">
            <a 
              href={element.properties.href || "#"}
              className={`font-medium ${linkVariants[String(linkStyle) as keyof typeof linkVariants]}`}
              target={element.properties.target || "_self"}
              style={{
                fontFamily: element.properties.fontFamily || 'Inter, sans-serif',
                fontWeight: element.properties.fontWeight || 'normal',
                fontSize: element.properties.fontSize || 16,
                textAlign: element.properties.textAlign || 'left'
              }}
            >
              {element.properties.text || "Click here"}
            </a>
          </div>
        )

      case "button":
        const buttonStyle = element.properties.buttonStyle || "primary"
        const buttonSize = element.properties.buttonSize || "default"
        const buttonVariants = {
          primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl",
          secondary: "bg-gray-600 hover:bg-gray-700 text-white shadow-lg hover:shadow-xl",
          outline: "bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white",
          ghost: "bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900",
          success: "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl",
          danger: "bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl",
          warning: "bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg hover:shadow-xl",
          info: "bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg hover:shadow-xl",
          gradient: "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl",
          glass: "bg-white/20 backdrop-blur-sm border border-white/30 text-white shadow-lg hover:shadow-xl",
          neon: "bg-transparent border-2 border-cyan-400 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)] hover:shadow-[0_0_20px_rgba(34,211,238,0.8)]"
        }
        const sizeClasses = {
          xs: "px-2 py-1 text-xs",
          small: "px-3 py-1 text-sm",
          default: "px-6 py-3",
          large: "px-8 py-4 text-lg",
          xl: "px-10 py-5 text-xl"
        }
        const radiusClasses = {
          none: "rounded-none",
          sm: "rounded-sm",
          default: "rounded-lg",
          lg: "rounded-xl",
          full: "rounded-full"
        }
        
        return (
          <button 
            style={style}
            className={`font-medium transition-all duration-200 transform hover:scale-105 ${buttonVariants[String(buttonStyle) as keyof typeof buttonVariants]} ${sizeClasses[String(buttonSize) as keyof typeof sizeClasses]} ${radiusClasses[String(element.properties.borderRadius || "default") as keyof typeof radiusClasses]} ${element.properties.disabled ? 'opacity-50 cursor-not-allowed' : ''} ${element.properties.loading ? 'animate-pulse' : ''}`}
            disabled={element.properties.disabled}
          >
            {element.properties.text || ""}
          </button>
        )

      case "image":
        const imageStyle = element.properties.imageStyle || "default"
        const imageClasses = {
          default: "",
          rounded: "rounded-lg",
          circle: "rounded-full",
          bordered: "border-2 border-gray-300",
          shadow: "shadow-lg"
        }
        return (
          <img
            style={{
              ...style,
              objectFit: element.properties.objectFit || "cover"
            }}
            src={element.properties.src || "/placeholder.svg"}
            alt={element.properties.alt || "Image"}
            className={`transition-transform duration-300 hover:scale-105 ${imageClasses[String(imageStyle) as keyof typeof imageClasses]}`}
            loading={element.properties.lazy ? "lazy" : "eager"}
          />
        )

      case "divider":
        const dividerStyle = element.properties.dividerStyle || "solid"
        const dividerVariants = {
          solid: "border-t-2 border-gray-300",
          dashed: "border-t-2 border-dashed border-gray-300",
          dotted: "border-t-2 border-dotted border-gray-300",
          gradient: "bg-gradient-to-r from-transparent via-gray-300 to-transparent h-px",
          fancy: "relative before:content-[''] before:absolute before:top-1/2 before:left-0 before:right-0 before:h-px before:bg-gray-300 before:transform before:-translate-y-1/2"
        }
        
        return (
          <div style={style} className={`w-full ${dividerVariants[String(dividerStyle) as keyof typeof dividerVariants]}`}></div>
        )

      case "section":
        const sectionStyle = element.properties.sectionStyle || "default"
        const sectionContent = element.properties.sectionContent || "default"
        const sectionVariants = {
          default: "border-2 border-dashed border-gray-300 bg-gray-50",
          card: "border border-gray-200 bg-white shadow-lg rounded-lg",
          hero: "bg-gradient-to-r from-blue-500 to-purple-600 text-white",
          dark: "bg-gray-800 text-white border border-gray-700",
          accent: "bg-gradient-to-r from-pink-500 to-orange-500 text-white"
        }
        
        const renderSectionContent = () => {
          switch (sectionContent) {
            case "custom":
              return (
                <div className="text-center">
                  <div className="text-2xl font-bold mb-4">{element.properties.sectionTitle || "Section Container"}</div>
                  <div className="text-sm opacity-75">{element.properties.sectionDescription || "Perfect for organizing your content"}</div>
                </div>
              )
            case "empty":
              return null
            case "default":
            default:
              return (
                <div className="text-center">
                  <div className="text-2xl font-bold mb-4">Section Container</div>
                  <div className="text-sm opacity-75">Perfect for organizing your content</div>
                </div>
              )
          }
        }
        
        return (
          <section style={style} className={`flex items-center justify-center p-8 ${sectionVariants[String(sectionStyle) as keyof typeof sectionVariants]}`}>
            {renderSectionContent()}
          </section>
        )

      case "card":
        const cardStyle = element.properties.cardStyle || "default"
        const cardVariants = {
          default: "bg-white border border-gray-200 shadow-sm",
          elevated: "bg-white shadow-lg hover:shadow-xl transition-shadow",
          gradient: "bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200",
          dark: "bg-gray-800 text-white border border-gray-700"
        }
        
        return (
          <div style={style} className={`p-6 rounded-lg ${cardVariants[String(cardStyle) as keyof typeof cardVariants]}`}>
            <div className="text-center">
              <div className="text-xl font-bold mb-2">Card Title</div>
              <div className="text-sm text-gray-600">This is a beautiful card component with customizable styling.</div>
            </div>
          </div>
        )

      case "hero":
        const heroStyle = element.properties.heroStyle || "default"
        const heroContent = element.properties.heroContent || "default"
        const heroVariants = {
          default: "bg-gradient-to-r from-blue-600 to-purple-600 text-white",
          modern: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white",
          dark: "bg-gray-900 text-white",
          light: "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800",
          gradient: "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
        }
        
        const heroBackgroundStyle = element.properties.backgroundImage ? {
          backgroundImage: `url(${element.properties.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : {}
        
        const renderHeroContent = () => {
          switch (heroContent) {
            case "custom":
              return (
                <div className="text-center">
                  <h1 className="text-4xl font-bold mb-4">{element.properties.heroTitle || "Hero Section"}</h1>
                  <p className="text-xl mb-6">{element.properties.heroDescription || "Create stunning hero sections for your website"}</p>
                  {element.properties.heroButtonText && (
                    <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                      {element.properties.heroButtonText}
                    </button>
                  )}
                </div>
              )
            case "empty":
              return null
            case "default":
            default:
              return (
                <div className="text-center">
                  <h1 className="text-4xl font-bold mb-4">{element.properties.heading || "Hero Section"}</h1>
                  <p className="text-xl mb-6">{element.properties.subheading || "Create stunning hero sections for your website"}</p>
                  {element.properties.buttonText && (
                    <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                      {element.properties.buttonText}
                    </button>
                  )}
                </div>
              )
          }
        }
        
        return (
          <div style={{...style, ...heroBackgroundStyle}} className={`flex items-center justify-center ${heroVariants[String(heroStyle) as keyof typeof heroVariants]}`}>
            {renderHeroContent()}
          </div>
        )

      case "navigation":
        const navStyle = element.properties.navStyle || "default"
        const navContent = element.properties.navContent || "default"
        const navVariants = {
          default: "bg-white border-b border-gray-200",
          centered: "bg-white border-b border-gray-200",
          minimal: "bg-transparent",
          dark: "bg-gray-900 text-white border-b border-gray-700"
        }
        
        const renderNavContent = () => {
          switch (navContent) {
            case "custom":
              const customMenuItems = element.properties.customMenuItems ? 
                element.properties.customMenuItems.split(',').map((item: string) => item.trim()) : 
                ['Home', 'About', 'Services', 'Contact']
              return (
                <div className="flex items-center justify-between px-6 py-4">
                  <div className="text-xl font-bold text-gray-800">{element.properties.navLogoText || "Logo"}</div>
                  <nav className="flex space-x-6">
                    {customMenuItems.map((item: string, index: number) => (
                      <a key={index} href="#" className="text-gray-600 hover:text-gray-900 transition-colors">{item}</a>
                    ))}
                  </nav>
                </div>
              )
            case "empty":
              return null
            case "default":
            default:
              const menuItems = element.properties.menuItems ? 
                element.properties.menuItems.split(',').map((item: string) => item.trim()) : 
                ['Home', 'About', 'Services', 'Contact']
              return (
                <div className="flex items-center justify-between px-6 py-4">
                  <div className="text-xl font-bold text-gray-800">{element.properties.logoText || "Logo"}</div>
                  <nav className="flex space-x-6">
                    {menuItems.map((item: string, index: number) => (
                      <a key={index} href="#" className="text-gray-600 hover:text-gray-900 transition-colors">{item}</a>
                    ))}
                  </nav>
                </div>
              )
          }
        }
        
        return (
          <nav style={style} className={`${navVariants[String(navStyle) as keyof typeof navVariants]} ${element.properties.sticky ? 'sticky top-0 z-50' : ''}`}>
            {renderNavContent()}
          </nav>
        )

      case "footer":
        const footerStyle = element.properties.footerStyle || "default"
        const footerContent = element.properties.footerContent || "default"
        const footerVariants = {
          default: "bg-gray-800 text-white",
          minimal: "bg-gray-100 text-gray-800 border-t border-gray-200",
          modern: "bg-gradient-to-r from-gray-900 to-gray-800 text-white",
          dark: "bg-black text-white"
        }
        
        const renderFooterContent = () => {
          switch (footerContent) {
            case "custom":
              return (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="text-xl font-bold mb-2">{element.properties.footerCompanyName || "Your Company"}</div>
                    <div className="text-sm opacity-75">{element.properties.footerCopyrightText || "© 2024 All rights reserved"}</div>
                    {element.properties.footerAdditionalText && (
                      <div className="text-xs mt-2 opacity-60">{element.properties.footerAdditionalText}</div>
                    )}
                  </div>
                </div>
              )
            case "empty":
              return null
            case "default":
            default:
              return (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="text-xl font-bold mb-2">{element.properties.companyName || "Your Company"}</div>
                    <div className="text-sm opacity-75">{element.properties.copyrightText || "© 2024 All rights reserved"}</div>
                    {element.properties.additionalText && (
                      <div className="text-xs mt-2 opacity-60">{element.properties.additionalText}</div>
                    )}
                  </div>
                </div>
              )
          }
        }
        
        return (
          <footer style={style} className={footerVariants[String(footerStyle) as keyof typeof footerVariants]}>
            {renderFooterContent()}
          </footer>
        )

      // Form Components
      case "input":
        const inputStyle = element.properties.inputStyle || "default"
        const inputVariants = {
          default: "border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
          modern: "border-b-2 border-gray-300 bg-transparent px-3 py-2 focus:outline-none focus:border-blue-500",
          rounded: "border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500",
          filled: "border-none bg-gray-100 px-3 py-2 rounded-md focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
        }
        
        return (
          <div style={style} className="flex items-center justify-center p-4">
            <input
              type={element.properties.inputType || "text"}
              placeholder={element.properties.placeholder || "Enter your text..."}
              className={`w-full ${inputVariants[String(inputStyle) as keyof typeof inputVariants]}`}
              style={{
                backgroundColor: element.properties.backgroundColor || 'transparent',
                color: element.properties.color || '#000000',
                fontSize: element.properties.fontSize || 16,
              }}
            />
          </div>
        )

      case "textarea":
        const textareaStyle = element.properties.textareaStyle || "default"
        const textareaVariants = {
          default: "border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none",
          modern: "border-b-2 border-gray-300 bg-transparent px-3 py-2 focus:outline-none focus:border-blue-500 resize-none",
          filled: "border-none bg-gray-100 px-3 py-2 rounded-md focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 resize-none"
        }
        
        return (
          <div style={style} className="flex items-center justify-center p-4">
            <textarea
              placeholder={element.properties.placeholder || "Write your message here..."}
              rows={element.properties.rows || 4}
              className={`w-full ${textareaVariants[String(textareaStyle) as keyof typeof textareaVariants]}`}
              style={{
                backgroundColor: element.properties.backgroundColor || 'transparent',
                color: element.properties.color || '#000000',
                fontSize: element.properties.fontSize || 16,
              }}
            />
          </div>
        )

      case "checkbox":
        const checkboxStyle = element.properties.checkboxStyle || "default"
        const checkboxVariants = {
          default: "flex items-center space-x-3 cursor-pointer",
          modern: "flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors",
          card: "flex items-center space-x-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
        }
        
        return (
          <div style={style} className="flex items-center justify-center p-4">
            <label className={checkboxVariants[String(checkboxStyle) as keyof typeof checkboxVariants]}>
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                style={{
                  accentColor: element.properties.accentColor || '#3b82f6'
                }}
              />
              <span className="font-medium" style={{ color: element.properties.color || '#000000' }}>
                {element.properties.label || "Check this option"}
              </span>
            </label>
          </div>
        )

      case "radio":
        const radioStyle = element.properties.radioStyle || "default"
        const radioVariants = {
          default: "flex items-center space-x-3 cursor-pointer",
          modern: "flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors",
          card: "flex items-center space-x-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
        }
        
        return (
          <div style={style} className="flex items-center justify-center p-4">
            <label className={radioVariants[String(radioStyle) as keyof typeof radioVariants]}>
              <input
                type="radio"
                name={element.properties.name || "radio-group"}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                style={{
                  accentColor: element.properties.accentColor || '#3b82f6'
                }}
              />
              <span className="font-medium" style={{ color: element.properties.color || '#000000' }}>
                {element.properties.label || "Radio option"}
              </span>
            </label>
          </div>
        )

      case "select":
        const selectStyle = element.properties.selectStyle || "default"
        const selectVariants = {
          default: "border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
          modern: "border-b-2 border-gray-300 bg-transparent px-3 py-2 focus:outline-none focus:border-blue-500",
          rounded: "border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        }
        
        return (
          <div style={style} className="flex items-center justify-center p-4">
            <select className={`w-full ${selectVariants[String(selectStyle) as keyof typeof selectVariants]}`} style={{
              backgroundColor: element.properties.backgroundColor || 'transparent',
              color: element.properties.color || '#000000',
              fontSize: element.properties.fontSize || 16,
            }}>
              <option value="">{element.properties.placeholder || "Select an option"}</option>
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </select>
          </div>
        )

      case "label":
        return (
          <div style={style} className="flex items-center justify-center p-4">
            <label className="text-sm font-medium" style={{ color: element.properties.color || '#374151' }}>
              {element.properties.text || "Label"}
            </label>
          </div>
        )

      case "form":
        const formStyle = element.properties.formStyle || "default"
        const formVariants = {
          default: "bg-white border border-gray-200 rounded-lg",
          card: "bg-white shadow-lg rounded-lg",
          minimal: "bg-transparent border border-gray-200 rounded-lg",
          floating: "bg-white border border-gray-200 rounded-lg shadow-lg"
        }
        
        const formFieldList = element.properties.formFields ? 
          element.properties.formFields.split(',').map((field: string) => field.trim()) : 
          ['Name', 'Email', 'Message']
        
        // Calculate dynamic sizing based on component dimensions
        const formWidth = parseInt(element.properties.width) || 400
        const formHeight = parseInt(element.properties.height) || 300
        
        // Scale padding and font sizes based on component size
        const formPaddingScale = Math.min(formWidth / 400, formHeight / 300, 1.5)
        const formPadding = Math.max(8, Math.floor(16 * formPaddingScale))
        const formTitleSize = Math.max(12, Math.floor(18 * formPaddingScale))
        const formLabelSize = Math.max(10, Math.floor(14 * formPaddingScale))
        const formInputPadding = Math.max(6, Math.floor(12 * formPaddingScale))
        const formButtonPadding = Math.max(4, Math.floor(8 * formPaddingScale))
        const formFieldSpacing = Math.max(8, Math.floor(16 * formPaddingScale))
        
        return (
          <div style={style} className="flex items-center justify-center">
            <div 
              className={formVariants[String(formStyle) as keyof typeof formVariants]}
              style={{
                padding: `${formPadding}px`,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <h3 
                className="font-semibold mb-4"
                style={{ fontSize: `${formTitleSize}px` }}
              >
                {element.properties.formTitle || "Contact Form"}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: `${formFieldSpacing}px` }}>
                {formFieldList.map((field: string, index: number) => (
                  <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label 
                      className="font-medium text-gray-700"
                      style={{ fontSize: `${formLabelSize}px` }}
                    >
                      {field}
                    </label>
                    {field.toLowerCase() === 'message' ? (
                      <textarea 
                        placeholder={`Enter your ${field.toLowerCase()}`}
                        rows={Math.max(2, Math.floor(3 * formPaddingScale))}
                        className="w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        style={{
                          padding: `${formInputPadding}px`,
                          fontSize: `${formLabelSize}px`
                        }}
                      />
                    ) : (
                      <input 
                        type={field.toLowerCase() === 'email' ? 'email' : 'text'} 
                        placeholder={`Enter your ${field.toLowerCase()}`}
                        className="w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        style={{
                          padding: `${formInputPadding}px`,
                          fontSize: `${formLabelSize}px`
                        }}
                      />
                    )}
                  </div>
                ))}
                <button 
                  className="w-full bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
                  style={{
                    padding: `${formButtonPadding}px ${formButtonPadding * 2}px`,
                    fontSize: `${formLabelSize}px`,
                    marginTop: `${formFieldSpacing}px`
                  }}
                >
                  {element.properties.submitText || "Submit"}
                </button>
              </div>
            </div>
          </div>
        )

      // Interactive Components
      case "tabs":
        const tabsStyle = element.properties.tabsStyle || "default"
        const tabsVariants = {
          default: "border-b border-gray-200",
          modern: "bg-gray-50 rounded-lg",
          card: "bg-white border border-gray-200 rounded-lg"
        }
        
        const tabItems = element.properties.tabItems ? 
          element.properties.tabItems.split(',').map((item: string) => item.trim()) : 
          ['Tab 1', 'Tab 2', 'Tab 3']
        
        // Calculate dynamic sizing based on component dimensions
        const tabsWidth = parseInt(element.properties.width) || 400
        const tabsHeight = parseInt(element.properties.height) || 150
        
        // Scale padding and font sizes based on component size
        const tabsPaddingScale = Math.min(tabsWidth / 400, tabsHeight / 150, 1.5)
        const tabsPadding = Math.max(4, Math.floor(8 * tabsPaddingScale))
        const tabsFontSize = Math.max(10, Math.floor(14 * tabsPaddingScale))
        const tabsButtonPadding = Math.max(8, Math.floor(16 * tabsPaddingScale))
        const tabsSpacing = Math.max(2, Math.floor(4 * tabsPaddingScale))
        
        return (
          <div style={style} className="flex items-center justify-center">
            <div 
              className={tabsVariants[String(tabsStyle) as keyof typeof tabsVariants]}
              style={{
                padding: `${tabsPadding}px`,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <div style={{ display: 'flex', gap: `${tabsSpacing}px` }}>
                {tabItems.map((item: string, index: number) => (
                  <button
                    key={index}
                    className={`font-medium rounded-md transition-colors ${
                      index === 0 ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}
                    style={{
                      padding: `${tabsButtonPadding}px ${tabsButtonPadding * 1.5}px`,
                      fontSize: `${tabsFontSize}px`
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case "accordion":
        const accordionStyle = element.properties.accordionStyle || "default"
        const accordionVariants = {
          default: "border border-gray-200 rounded-lg",
          modern: "bg-white shadow-sm rounded-lg",
          card: "bg-white border border-gray-200 rounded-lg shadow-sm"
        }
        
        const accordionItems = element.properties.accordionItems ? 
          element.properties.accordionItems.split(',').map((item: string) => item.trim()) : 
          ['Section 1', 'Section 2', 'Section 3']
        
        // Calculate dynamic sizing based on component dimensions
        const accordionWidth = parseInt(element.properties.width) || 400
        const accordionHeight = parseInt(element.properties.height) || 200
        
        // Scale padding and font sizes based on component size
        const accordionPaddingScale = Math.min(accordionWidth / 400, accordionHeight / 200, 1.5)
        const accordionPadding = Math.max(4, Math.floor(8 * accordionPaddingScale))
        const accordionFontSize = Math.max(10, Math.floor(14 * accordionPaddingScale))
        const accordionButtonPadding = Math.max(8, Math.floor(16 * accordionPaddingScale))
        const accordionIconSize = Math.max(12, Math.floor(16 * accordionPaddingScale))
        
        return (
          <div style={style} className="flex items-center justify-center">
            <div 
              className={accordionVariants[String(accordionStyle) as keyof typeof accordionVariants]}
              style={{
                padding: `${accordionPadding}px`,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              {accordionItems.map((item: string, index: number) => (
                <div key={index} className="border-b border-gray-200 last:border-b-0">
                  <button 
                    className="w-full text-left font-medium hover:bg-gray-50 transition-colors flex items-center justify-between"
                    style={{
                      padding: `${accordionButtonPadding}px`,
                      fontSize: `${accordionFontSize}px`
                    }}
                  >
                    <span>{item}</span>
                    <ChevronDown 
                      className="w-4 h-4" 
                      style={{ width: `${accordionIconSize}px`, height: `${accordionIconSize}px` }}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )

      case "modal":
        const modalStyle = element.properties.modalStyle || "default"
        const modalVariants = {
          default: "bg-white border border-gray-200 rounded-lg shadow-lg",
          modern: "bg-white rounded-lg shadow-xl",
          card: "bg-white border border-gray-200 rounded-lg shadow-lg"
        }
        
        return (
          <div style={style} className="flex items-center justify-center p-4">
            <div className={`max-w-sm w-full ${modalVariants[String(modalStyle) as keyof typeof modalVariants]}`}>
              <div className="p-6">
                <div className="text-center">
                  <div className="text-lg font-semibold mb-2">{element.properties.title || "Modal Dialog"}</div>
                  <div className="text-sm text-gray-600 mb-4">{element.properties.content || "This is a modal dialog component"}</div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition-colors">
                    {element.properties.buttonText || "Close"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )

      case "tooltip":
        const tooltipStyle = element.properties.tooltipStyle || "default"
        const tooltipVariants = {
          default: "bg-gray-900 text-white text-sm rounded px-2 py-1",
          modern: "bg-blue-600 text-white text-sm rounded-lg px-3 py-2 shadow-lg",
          light: "bg-white text-gray-900 text-sm rounded border border-gray-200 px-3 py-2 shadow-lg"
        }
        
        return (
          <div style={style} className="flex items-center justify-center p-4">
            <div className="relative group">
              <button className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition-colors">
                {element.properties.triggerText || "Hover me"}
              </button>
              <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity ${tooltipVariants[String(tooltipStyle) as keyof typeof tooltipVariants]}`}>
                {element.properties.tooltipText || "Tooltip content"}
              </div>
            </div>
          </div>
        )

      case "dropdown":
        const dropdownStyle = element.properties.dropdownStyle || "default"
        const dropdownVariants = {
          default: "bg-white border border-gray-200 rounded-lg shadow-lg",
          modern: "bg-white rounded-lg shadow-xl",
          minimal: "bg-white border border-gray-200 rounded-md shadow-sm"
        }
        
        const dropdownItems = element.properties.dropdownItems ? 
          element.properties.dropdownItems.split(',').map((item: string) => item.trim()) : 
          ['Option 1', 'Option 2', 'Option 3']
        
        return (
          <div style={style} className="flex items-center justify-center p-4">
            <div className="relative">
              <button className="bg-white border border-gray-300 rounded-lg px-4 py-2 flex items-center space-x-2 hover:bg-gray-50 transition-colors">
                <span>{element.properties.triggerText || "Dropdown"}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className={`absolute top-full left-0 mt-1 w-full ${dropdownVariants[String(dropdownStyle) as keyof typeof dropdownVariants]}`}>
                {dropdownItems.map((item: string, index: number) => (
                  <button
                    key={index}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      // Media Components
      case "video":
        const videoStyle = element.properties.videoStyle || "default"
        const videoVariants = {
          default: "bg-gray-200 rounded-lg",
          modern: "bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg",
          card: "bg-white border border-gray-200 rounded-lg shadow-sm"
        }
        
        return (
          <div style={style} className="flex items-center justify-center p-4">
            <div className={`w-full h-full flex items-center justify-center ${videoVariants[String(videoStyle) as keyof typeof videoVariants]}`}>
              <div className="text-center">
                <Play className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <div className="text-sm text-gray-600">{element.properties.videoTitle || "Video Player"}</div>
                {element.properties.videoDescription && (
                  <div className="text-xs text-gray-500 mt-1">{element.properties.videoDescription}</div>
                )}
              </div>
            </div>
          </div>
        )

      case "gallery":
        const galleryStyle = element.properties.galleryStyle || "default"
        const galleryVariants = {
          default: "grid grid-cols-2 gap-4",
          modern: "grid grid-cols-3 gap-3",
          masonry: "columns-2 gap-4"
        }
        
        return (
          <div style={style} className="p-4">
            <div className={galleryVariants[String(galleryStyle) as keyof typeof galleryVariants]}>
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="bg-gray-200 rounded-lg aspect-square flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        )

      case "slider":
        const sliderStyle = element.properties.sliderStyle || "default"
        const sliderVariants = {
          default: "bg-gray-200 rounded-lg",
          modern: "bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg",
          card: "bg-white border border-gray-200 rounded-lg shadow-sm"
        }
        
        return (
          <div style={style} className="flex items-center justify-center p-4">
            <div className={`w-full h-full flex items-center justify-center ${sliderVariants[String(sliderStyle) as keyof typeof sliderVariants]}`}>
              <div className="text-center">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <div className="text-sm text-gray-600">{element.properties.sliderTitle || "Image Slider"}</div>
                {element.properties.sliderDescription && (
                  <div className="text-xs text-gray-500 mt-1">{element.properties.sliderDescription}</div>
                )}
              </div>
            </div>
          </div>
        )

      case "icon":
        const iconStyle = element.properties.iconStyle || "default"
        const iconVariants = {
          default: "text-gray-600",
          primary: "text-blue-600",
          secondary: "text-gray-500",
          accent: "text-purple-600",
          success: "text-green-600",
          warning: "text-yellow-600",
          danger: "text-red-600"
        }
        
        const iconSize = element.properties.iconSize || "default"
        const iconSizeClasses = {
          small: "w-4 h-4",
          default: "w-6 h-6",
          large: "w-8 h-8",
          xl: "w-12 h-12"
        }
        
        return (
          <div style={style} className="flex items-center justify-center p-4">
            <div className={`${iconVariants[String(iconStyle) as keyof typeof iconVariants]} ${iconSizeClasses[String(iconSize) as keyof typeof iconSizeClasses]}`}>
              {element.properties.iconName ? (
                <span className="text-2xl">{element.properties.iconName}</span>
              ) : (
                <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">Icon</span>
                </div>
              )}
            </div>
          </div>
        )

      // Business Components
      case "pricing":
        const pricingStyle = element.properties.pricingStyle || "default"
        const pricingVariants = {
          default: "bg-white border border-gray-200 rounded-lg text-center shadow-sm hover:shadow-md transition-shadow",
          featured: "bg-gradient-to-br from-blue-600 to-blue-700 text-white border border-blue-600 rounded-lg text-center transform scale-105 shadow-lg hover:shadow-xl transition-all duration-300",
          minimal: "bg-transparent border border-gray-200 rounded-lg text-center hover:border-gray-300 transition-colors",
          card: "bg-white shadow-lg rounded-lg text-center hover:shadow-xl transition-shadow",
          modern: "bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl text-center shadow-sm hover:shadow-lg transition-all duration-300",
          dark: "bg-gray-800 text-white border border-gray-700 rounded-lg text-center hover:bg-gray-700 transition-colors"
        }
        
        const features = element.properties.features ? 
          element.properties.features.split(',').map((feature: string) => feature.trim()) : 
          ['Feature 1', 'Feature 2', 'Feature 3']
        
        // Calculate dynamic sizing based on component dimensions
        const pricingWidth = parseInt(element.properties.width) || 250
        const pricingHeight = parseInt(element.properties.height) || 300
        
        // Scale padding and font sizes based on component size
        const pricingPaddingScale = Math.min(pricingWidth / 250, pricingHeight / 300, 1.5)
        const pricingPadding = Math.max(8, Math.floor(16 * pricingPaddingScale))
        const pricingPriceSize = Math.max(16, Math.floor(24 * pricingPaddingScale))
        const pricingPlanNameSize = Math.max(14, Math.floor(18 * pricingPaddingScale))
        const pricingFeatureSize = Math.max(10, Math.floor(14 * pricingPaddingScale))
        const pricingButtonPadding = Math.max(4, Math.floor(8 * pricingPaddingScale))
        const pricingSpacing = Math.max(4, Math.floor(8 * pricingPaddingScale))
        
        // Get additional properties
        const isPopular = element.properties.isPopular === 'true'
        const currency = element.properties.currency || '$'
        const period = element.properties.period || '/month'
        const pricingButtonVariant = element.properties.buttonVariant || 'primary'
        
        const pricingButtonVariants = {
          primary: "bg-blue-600 text-white hover:bg-blue-700",
          secondary: "bg-gray-600 text-white hover:bg-gray-700",
          outline: "border border-blue-600 text-blue-600 hover:bg-blue-50",
          gradient: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
        }
        
        return (
          <div style={style} className="flex items-center justify-center relative">
            {isPopular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-semibold z-10">
                Most Popular
              </div>
            )}
            <div 
              className={`${pricingVariants[String(pricingStyle) as keyof typeof pricingVariants]} ${isPopular ? 'ring-2 ring-yellow-400' : ''}`}
              style={{
                padding: `${pricingPadding}px`,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                position: 'relative'
              }}
            >
              <div 
                className="font-bold mb-2"
                style={{ fontSize: `${pricingPriceSize}px` }}
              >
                <span className="text-sm font-normal">{currency}</span>
                {element.properties.price || "29"}
                <span className="text-sm font-normal">{period}</span>
              </div>
              <div 
                className="font-semibold mb-4"
                style={{ fontSize: `${pricingPlanNameSize}px` }}
              >
                {element.properties.planName || "Pro Plan"}
              </div>
              {element.properties.description && (
                <div 
                  className="text-gray-600 mb-4"
                  style={{ fontSize: `${Math.max(10, Math.floor(12 * pricingPaddingScale))}px` }}
                >
                  {element.properties.description}
                </div>
              )}
              <ul 
                className="space-y-2 mb-6 flex-1"
                style={{ fontSize: `${pricingFeatureSize}px` }}
              >
                {features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button 
                className={`rounded-lg font-medium transition-all duration-200 ${pricingButtonVariants[String(pricingButtonVariant) as keyof typeof pricingButtonVariants]}`}
                style={{
                  padding: `${pricingButtonPadding}px ${pricingButtonPadding * 2}px`,
                  fontSize: `${pricingFeatureSize}px`
                }}
              >
                {element.properties.buttonText || "Choose Plan"}
              </button>
            </div>
          </div>
        )

      case "testimonial":
        const testimonialStyle = element.properties.testimonialStyle || "default"
        const testimonialVariants = {
          default: "bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow",
          card: "bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow",
          minimal: "bg-transparent border border-gray-200 rounded-lg hover:border-gray-300 transition-colors",
          quote: "bg-gray-50 border-l-4 border-blue-500 hover:bg-gray-100 transition-colors",
          modern: "bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300",
          dark: "bg-gray-800 text-white border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors",
          featured: "bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        }
        
        // Calculate dynamic sizing based on component dimensions
        const testimonialWidth = parseInt(element.properties.width) || 300
        const testimonialHeight = parseInt(element.properties.height) || 200
        
        // Scale padding and font sizes based on component size
        const testimonialPaddingScale = Math.min(testimonialWidth / 300, testimonialHeight / 200, 1.5)
        const testimonialPadding = Math.max(8, Math.floor(16 * testimonialPaddingScale))
        const testimonialQuoteSize = Math.max(12, Math.floor(16 * testimonialPaddingScale))
        const testimonialAuthorSize = Math.max(12, Math.floor(14 * testimonialPaddingScale))
        const testimonialTitleSize = Math.max(10, Math.floor(12 * testimonialPaddingScale))
        const testimonialAvatarSize = Math.max(24, Math.floor(40 * testimonialPaddingScale))
        
        // Get additional properties
        const rating = parseInt(element.properties.rating) || 5
        const showRating = element.properties.showRating === 'true'
        const showAvatar = element.properties.showAvatar !== 'false'
        
        const renderStars = (rating: number) => {
          return Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>
              ★
            </span>
          ))
        }
        
        return (
          <div style={style} className="flex items-center justify-center">
            <div 
              className={testimonialVariants[String(testimonialStyle) as keyof typeof testimonialVariants]}
              style={{
                padding: `${testimonialPadding}px`,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              {showRating && (
                <div className="flex justify-center mb-3" style={{ fontSize: `${Math.max(10, Math.floor(12 * testimonialPaddingScale))}px` }}>
                  {renderStars(rating)}
                </div>
              )}
              <div 
                className="italic mb-4 text-gray-700"
                style={{ fontSize: `${testimonialQuoteSize}px` }}
              >
                "{element.properties.quote || "This is an amazing product that has transformed our business. Highly recommended!"}"
              </div>
              <div className="flex items-center">
                {showAvatar && (
                  <div 
                    className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3"
                    style={{ width: `${testimonialAvatarSize}px`, height: `${testimonialAvatarSize}px` }}
                  >
                    <span className="text-gray-600 font-semibold">
                      {element.properties.authorName ? element.properties.authorName.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>
                )}
                <div>
                  <div 
                    className="font-semibold text-gray-900"
                    style={{ fontSize: `${testimonialAuthorSize}px` }}
                  >
                    {element.properties.authorName || "John Doe"}
                  </div>
                  {element.properties.authorTitle && (
                    <div 
                      className="text-gray-600"
                      style={{ fontSize: `${testimonialTitleSize}px` }}
                    >
                      {element.properties.authorTitle}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )

      case "contact":
        const contactStyle = element.properties.contactStyle || "default"
        const contactVariants = {
          default: "bg-white border border-gray-200 rounded-lg shadow-sm",
          card: "bg-white shadow-lg rounded-lg",
          minimal: "bg-transparent border border-gray-200 rounded-lg",
          modern: "bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl shadow-sm",
          dark: "bg-gray-800 text-white border border-gray-700 rounded-lg",
          featured: "bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg shadow-md"
        }
        
        // Calculate dynamic sizing based on component dimensions
        const contactWidth = parseInt(element.properties.width) || 400
        const contactHeight = parseInt(element.properties.height) || 300
        
        // Scale padding and font sizes based on component size
        const contactPaddingScale = Math.min(contactWidth / 400, contactHeight / 300, 1.5)
        const contactPadding = Math.max(8, Math.floor(16 * contactPaddingScale))
        const contactTitleSize = Math.max(16, Math.floor(20 * contactPaddingScale))
        const contactLabelSize = Math.max(12, Math.floor(14 * contactPaddingScale))
        const contactInputSize = Math.max(12, Math.floor(14 * contactPaddingScale))
        const contactInputPadding = Math.max(6, Math.floor(12 * contactPaddingScale))
        const contactButtonPadding = Math.max(4, Math.floor(8 * contactPaddingScale))
        const contactSpacing = Math.max(4, Math.floor(8 * contactPaddingScale))
        
        // Get additional properties
        const contactShowTitle = element.properties.showTitle !== 'false'
        const contactShowDescription = element.properties.showDescription === 'true'
        const contactButtonVariant = element.properties.buttonVariant || 'primary'
        
        const contactButtonVariants = {
          primary: "bg-blue-600 text-white hover:bg-blue-700",
          secondary: "bg-gray-600 text-white hover:bg-gray-700",
          outline: "border border-blue-600 text-blue-600 hover:bg-blue-50",
          gradient: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
        }
        
        return (
          <div style={style} className="flex items-center justify-center">
            <div 
              className={contactVariants[String(contactStyle) as keyof typeof contactVariants]}
              style={{
                padding: `${contactPadding}px`,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              {contactShowTitle && (
                <div 
                  className="font-bold mb-2 text-center"
                  style={{ fontSize: `${contactTitleSize}px` }}
                >
                  {element.properties.title || "Contact Us"}
                </div>
              )}
              {contactShowDescription && element.properties.description && (
                <div 
                  className="text-gray-600 mb-4 text-center"
                  style={{ fontSize: `${Math.max(10, Math.floor(12 * contactPaddingScale))}px` }}
                >
                  {element.properties.description}
                </div>
              )}
              <div className="space-y-3">
                <div>
                  <label 
                    className="block text-sm font-medium mb-1"
                    style={{ fontSize: `${contactLabelSize}px` }}
                  >
                    {element.properties.nameLabel || "Name"}
                  </label>
                  <input 
                    type="text" 
                    placeholder={element.properties.namePlaceholder || "Enter your name"}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{ 
                      fontSize: `${contactInputSize}px`,
                      padding: `${contactInputPadding}px`
                    }}
                  />
                </div>
                <div>
                  <label 
                    className="block text-sm font-medium mb-1"
                    style={{ fontSize: `${contactLabelSize}px` }}
                  >
                    {element.properties.emailLabel || "Email"}
                  </label>
                  <input 
                    type="email" 
                    placeholder={element.properties.emailPlaceholder || "Enter your email"}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{ 
                      fontSize: `${contactInputSize}px`,
                      padding: `${contactInputPadding}px`
                    }}
                  />
                </div>
                <div>
                  <label 
                    className="block text-sm font-medium mb-1"
                    style={{ fontSize: `${contactLabelSize}px` }}
                  >
                    {element.properties.messageLabel || "Message"}
                  </label>
                  <textarea 
                    placeholder={element.properties.messagePlaceholder || "Enter your message"}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    style={{ 
                      fontSize: `${contactInputSize}px`,
                      padding: `${contactInputPadding}px`
                    }}
                  />
                </div>
                <button 
                  className={`w-full rounded-md font-medium transition-all duration-200 ${contactButtonVariants[String(contactButtonVariant) as keyof typeof contactButtonVariants]}`}
                  style={{
                    padding: `${contactButtonPadding}px ${contactButtonPadding * 2}px`,
                    fontSize: `${contactInputSize}px`,
                    marginTop: `${contactSpacing}px`
                  }}
                >
                  {element.properties.submitText || "Send Message"}
                </button>
              </div>
            </div>
          </div>
        )

      case "newsletter":
        const newsletterStyle = element.properties.newsletterStyle || "default"
        const newsletterVariants = {
          default: "bg-white border border-gray-200 rounded-lg shadow-sm",
          card: "bg-white shadow-lg rounded-lg",
          minimal: "bg-transparent border border-gray-200 rounded-lg",
          modern: "bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl shadow-sm",
          dark: "bg-gray-800 text-white border border-gray-700 rounded-lg",
          featured: "bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg shadow-md",
          gradient: "bg-gradient-to-br from-blue-600 to-purple-600 text-white border border-blue-500 rounded-lg shadow-lg"
        }
        
        // Calculate dynamic sizing based on component dimensions
        const newsletterWidth = parseInt(element.properties.width) || 400
        const newsletterHeight = parseInt(element.properties.height) || 200
        
        // Scale padding and font sizes based on component size
        const newsletterPaddingScale = Math.min(newsletterWidth / 400, newsletterHeight / 200, 1.5)
        const newsletterPadding = Math.max(8, Math.floor(16 * newsletterPaddingScale))
        const newsletterTitleSize = Math.max(16, Math.floor(20 * newsletterPaddingScale))
        const newsletterDescriptionSize = Math.max(12, Math.floor(14 * newsletterPaddingScale))
        const newsletterInputSize = Math.max(12, Math.floor(14 * newsletterPaddingScale))
        const newsletterInputPadding = Math.max(6, Math.floor(12 * newsletterPaddingScale))
        const newsletterButtonPadding = Math.max(4, Math.floor(8 * newsletterPaddingScale))
        const newsletterSpacing = Math.max(4, Math.floor(8 * newsletterPaddingScale))
        
        // Get additional properties
        const showTitle = element.properties.showTitle !== 'false'
        const showDescription = element.properties.showDescription !== 'false'
        const showSocialLinks = element.properties.showSocialLinks === 'true'
        const buttonVariant = element.properties.buttonVariant || 'primary'
        
        const newsletterButtonVariants = {
          primary: "bg-blue-600 text-white hover:bg-blue-700",
          secondary: "bg-gray-600 text-white hover:bg-gray-700",
          outline: "border border-blue-600 text-blue-600 hover:bg-blue-50",
          gradient: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700",
          white: "bg-white text-blue-600 hover:bg-gray-50"
        }
        
        return (
          <div style={style} className="flex items-center justify-center">
            <div 
              className={newsletterVariants[String(newsletterStyle) as keyof typeof newsletterVariants]}
              style={{
                padding: `${newsletterPadding}px`,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              {showTitle && (
                <div 
                  className="font-bold mb-2 text-center"
                  style={{ fontSize: `${newsletterTitleSize}px` }}
                >
                  {element.properties.title || "Subscribe to Our Newsletter"}
                </div>
              )}
              {showDescription && (
                <div 
                  className="text-gray-600 mb-4 text-center"
                  style={{ fontSize: `${newsletterDescriptionSize}px` }}
                >
                  {element.properties.description || "Stay updated with our latest news and updates"}
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <input 
                  type="email" 
                  placeholder={element.properties.emailPlaceholder || "Enter your email"}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ 
                    fontSize: `${newsletterInputSize}px`,
                    padding: `${newsletterInputPadding}px`
                  }}
                />
                <button 
                  className={`rounded-md font-medium transition-all duration-200 ${newsletterButtonVariants[String(buttonVariant) as keyof typeof newsletterButtonVariants]}`}
                  style={{
                    padding: `${newsletterButtonPadding}px ${newsletterButtonPadding * 2}px`,
                    fontSize: `${newsletterInputSize}px`
                  }}
                >
                  {element.properties.buttonText || "Subscribe"}
                </button>
              </div>
              {showSocialLinks && (
                <div className="flex justify-center space-x-4 mt-4">
                  <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                    <span className="text-lg">📧</span>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                    <span className="text-lg">📱</span>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                    <span className="text-lg">💬</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        )

      case "social":
        const socialStyle = element.properties.socialStyle || "default"
        const socialSize = element.properties.socialSize || "default"
        const socialVariants = {
          default: "w-10 h-10",
          minimal: "w-8 h-8",
          rounded: "w-10 h-10 rounded-full",
          square: "w-10 h-10"
        }
        const socialSizeClasses = {
          small: "w-8 h-8",
          default: "w-10 h-10",
          large: "w-12 h-12"
        }
        
        const socialPlatforms = []
        if (element.properties.facebook) socialPlatforms.push({ name: 'Facebook', bg: 'bg-blue-600', text: 'f' })
        if (element.properties.twitter) socialPlatforms.push({ name: 'Twitter', bg: 'bg-blue-400', text: 't' })
        if (element.properties.linkedin) socialPlatforms.push({ name: 'LinkedIn', bg: 'bg-blue-700', text: 'in' })
        if (element.properties.instagram) socialPlatforms.push({ name: 'Instagram', bg: 'bg-pink-600', text: 'ig' })
        if (element.properties.youtube) socialPlatforms.push({ name: 'YouTube', bg: 'bg-red-600', text: 'yt' })
        
        return (
          <div style={style} className="flex items-center justify-center p-4">
            <div className="flex space-x-4">
              {socialPlatforms.length > 0 ? socialPlatforms.map((platform, index) => (
                <a key={index} href="#" className={`${socialVariants[String(socialStyle) as keyof typeof socialVariants]} ${socialSizeClasses[String(socialSize) as keyof typeof socialSizeClasses]} ${platform.bg} rounded-full flex items-center justify-center text-white hover:opacity-80 transition-opacity`}>
                  <span className="text-sm font-bold">{platform.text}</span>
                </a>
              )) : (
                <>
                  <a href="#" className={`${socialVariants[String(socialStyle) as keyof typeof socialVariants]} ${socialSizeClasses[String(socialSize) as keyof typeof socialSizeClasses]} bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700`}>
                    <span className="text-sm font-bold">f</span>
                  </a>
                  <a href="#" className={`${socialVariants[String(socialStyle) as keyof typeof socialVariants]} ${socialSizeClasses[String(socialSize) as keyof typeof socialSizeClasses]} bg-blue-400 rounded-full flex items-center justify-center text-white hover:bg-blue-500`}>
                    <span className="text-sm font-bold">t</span>
                  </a>
                  <a href="#" className={`${socialVariants[String(socialStyle) as keyof typeof socialVariants]} ${socialSizeClasses[String(socialSize) as keyof typeof socialSizeClasses]} bg-pink-600 rounded-full flex items-center justify-center text-white hover:bg-pink-700`}>
                    <span className="text-sm font-bold">in</span>
                  </a>
                </>
              )}
            </div>
          </div>
        )

      // Layout Components
      case "container":
        return (
          <div style={style} className="border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-semibold mb-2">Container</div>
              <div className="text-sm text-gray-600">Content wrapper with max-width</div>
            </div>
          </div>
        )

      case "grid":
        return (
          <div style={style} className="border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-semibold mb-2">Grid Layout</div>
              <div className="text-sm text-gray-600">CSS Grid container</div>
            </div>
          </div>
        )

      case "flex":
        return (
          <div style={style} className="border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-semibold mb-2">Flex Layout</div>
              <div className="text-sm text-gray-600">Flexbox container</div>
            </div>
          </div>
        )

      case "sidebar":
        return (
          <div style={style} className="bg-gray-100 border-r border-gray-200">
            <div className="p-4">
              <div className="text-lg font-semibold mb-4">Sidebar</div>
              <nav className="space-y-2">
                <a href="#" className="block text-gray-700 hover:text-blue-600 transition-colors">Home</a>
                <a href="#" className="block text-gray-700 hover:text-blue-600 transition-colors">About</a>
                <a href="#" className="block text-gray-700 hover:text-blue-600 transition-colors">Services</a>
                <a href="#" className="block text-gray-700 hover:text-blue-600 transition-colors">Contact</a>
              </nav>
            </div>
          </div>
        )

      case "statistics":
        const statsStyle = element.properties.statsStyle || "default"
        const statsVariants = {
          default: "bg-white border border-gray-200 rounded-lg shadow-sm",
          card: "bg-white shadow-lg rounded-lg",
          minimal: "bg-transparent border border-gray-200 rounded-lg",
          modern: "bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl shadow-sm",
          dark: "bg-gray-800 text-white border border-gray-700 rounded-lg",
          featured: "bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg shadow-md",
          gradient: "bg-gradient-to-br from-blue-600 to-purple-600 text-white border border-blue-500 rounded-lg shadow-lg"
        }
        
        // Calculate dynamic sizing based on component dimensions
        const statsWidth = parseInt(element.properties.width) || 400
        const statsHeight = parseInt(element.properties.height) || 200
        
        // Scale padding and font sizes based on component size
        const statsPaddingScale = Math.min(statsWidth / 400, statsHeight / 200, 1.5)
        const statsPadding = Math.max(8, Math.floor(16 * statsPaddingScale))
        const statsTitleSize = Math.max(16, Math.floor(20 * statsPaddingScale))
        const statsNumberSize = Math.max(20, Math.floor(32 * statsPaddingScale))
        const statsLabelSize = Math.max(12, Math.floor(14 * statsPaddingScale))
        const statsDescriptionSize = Math.max(10, Math.floor(12 * statsPaddingScale))
        
        // Get additional properties
        const statsShowTitle = element.properties.showTitle !== 'false'
        const statsShowDescription = element.properties.showDescription === 'true'
        const statsLayout = element.properties.layout || 'grid'
        
        const stats = [
          {
            number: element.properties.stat1Number || "1000+",
            label: element.properties.stat1Label || "Happy Customers",
            description: element.properties.stat1Description || "Satisfied clients worldwide"
          },
          {
            number: element.properties.stat2Number || "50+",
            label: element.properties.stat2Label || "Projects Completed",
            description: element.properties.stat2Description || "Successful project deliveries"
          },
          {
            number: element.properties.stat3Number || "24/7",
            label: element.properties.stat3Label || "Support Available",
            description: element.properties.stat3Description || "Round the clock assistance"
          },
          {
            number: element.properties.stat4Number || "99%",
            label: element.properties.stat4Label || "Satisfaction Rate",
            description: element.properties.stat4Description || "Customer satisfaction score"
          }
        ]
        
        const layoutClasses = {
          grid: "grid grid-cols-2 gap-4",
          list: "space-y-4",
          horizontal: "flex flex-wrap gap-4"
        }
        
        return (
          <div style={style} className="flex items-center justify-center">
            <div 
              className={statsVariants[String(statsStyle) as keyof typeof statsVariants]}
              style={{
                padding: `${statsPadding}px`,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              {statsShowTitle && (
                <div 
                  className="font-bold mb-4 text-center"
                  style={{ fontSize: `${statsTitleSize}px` }}
                >
                  {element.properties.title || "Our Statistics"}
                </div>
              )}
              {statsShowDescription && element.properties.description && (
                <div 
                  className="text-gray-600 mb-6 text-center"
                  style={{ fontSize: `${statsDescriptionSize}px` }}
                >
                  {element.properties.description}
                </div>
              )}
              <div className={layoutClasses[String(statsLayout) as keyof typeof layoutClasses]}>
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div 
                      className="font-bold text-blue-600 mb-1"
                      style={{ fontSize: `${statsNumberSize}px` }}
                    >
                      {stat.number}
                    </div>
                    <div 
                      className="font-semibold mb-1"
                      style={{ fontSize: `${statsLabelSize}px` }}
                    >
                      {stat.label}
                    </div>
                    {stat.description && (
                      <div 
                        className="text-gray-600 text-xs"
                        style={{ fontSize: `${Math.max(8, Math.floor(10 * statsPaddingScale))}px` }}
                      >
                        {stat.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case "faq":
        const faqStyle = element.properties.faqStyle || "default"
        const faqVariants = {
          default: "bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow",
          card: "bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow",
          minimal: "bg-transparent border border-gray-200 rounded-lg hover:border-gray-300 transition-colors",
          modern: "bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300",
          dark: "bg-gray-800 text-white border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors",
          featured: "bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        }
        
        // Calculate dynamic sizing based on component dimensions
        const faqWidth = parseInt(element.properties.width) || 300
        const faqHeight = parseInt(element.properties.height) || 200
        
        // Scale padding and font sizes based on component size
        const faqPaddingScale = Math.min(faqWidth / 300, faqHeight / 200, 1.5)
        const faqPadding = Math.max(8, Math.floor(16 * faqPaddingScale))
        const faqQuestionSize = Math.max(12, Math.floor(16 * faqPaddingScale))
        const faqAnswerSize = Math.max(12, Math.floor(14 * faqPaddingScale))
        const faqTitleSize = Math.max(10, Math.floor(12 * faqPaddingScale))
        const faqIconSize = Math.max(24, Math.floor(40 * faqPaddingScale))
        
        // Get additional properties
        const showAnswers = element.properties.showAnswers === 'true'
        const showIcons = element.properties.showIcons !== 'false'
        
        const renderQuestions = (questions: string[]) => {
          return questions.map((question, index) => (
            <div key={index} className="border-b border-gray-200 last:border-b-0">
              <button 
                className="w-full text-left font-medium hover:bg-gray-50 transition-colors flex items-center justify-between"
                style={{
                  padding: `${faqPadding}px`,
                  fontSize: `${faqQuestionSize}px`
                }}
              >
                <span>{question}</span>
                {showIcons && (
                  <div 
                    className="w-6 h-6 text-gray-400"
                    style={{ width: `${faqIconSize}px`, height: `${faqIconSize}px` }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12.75c1.657 0 2.992.903 2.992 2.008 0 1.104-1.335 2.007-2.992 2.007-1.658 0-2.993-.903-2.993-2.007 0-1.105 1.335-2.008 2.993-2.008zM12 16.5c.966 0 1.75.784 1.75 1.75 0 .965-.783 1.75-1.75 1.75-.966 0-1.75-.785-1.75-1.75 0-.966.784-1.75 1.75-1.75zM12 10c.966 0 1.75.784 1.75 1.75 0 .965-.783 1.75-1.75 1.75-.966 0-1.75-.785-1.75-1.75 0-.966.784-1.75 1.75-1.75z" />
                    </svg>
                  </div>
                )}
              </button>
              {showAnswers && (
                <div 
                  className="text-gray-600"
                  style={{ fontSize: `${faqAnswerSize}px`, padding: `${faqPadding}px` }}
                >
                  {element.properties.answers[index] || "This is the answer to the question."}
                </div>
              )}
            </div>
          ))
        }
        
        return (
          <div style={style} className="flex items-center justify-center">
            <div 
              className={faqVariants[String(faqStyle) as keyof typeof faqVariants]}
              style={{
                padding: `${faqPadding}px`,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              {element.properties.questions.map((question: string, index: number) => (
                <div key={index}>
                  <div 
                    className="font-semibold mb-2"
                    style={{ fontSize: `${faqQuestionSize}px` }}
                  >
                    {question}
                  </div>
                  {showAnswers && (
                    <div 
                      className="text-gray-600"
                      style={{ fontSize: `${faqAnswerSize}px`, padding: `${faqPadding}px` }}
                    >
                      {element.properties.answers[index] || "This is the answer to the question."}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )

      default:
        return (
          <div style={style} className="flex items-center justify-center text-gray-500 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-lg font-semibold mb-2">{element.type} Component</div>
              <div className="text-sm">Customize this component</div>
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
        className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-800 relative" 
        style={{ 
          minHeight: '400px',
          maxHeight: 'calc(100vh - 120px)', // Ensure it doesn't exceed viewport
          scrollbarWidth: 'thin',
          scrollbarColor: '#cbd5e1 #f1f5f9',
          overflowY: 'auto',
          overflowX: 'auto'
        }}
        id="canvas-scroll-container"
      >
        {/* Scroll indicator */}
        {canvasDimensions.height > 600 && (
          <div className="absolute top-2 right-2 z-10 flex items-center space-x-2">
            <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
              Canvas: {canvasDimensions.width}×{canvasDimensions.height}px
            </div>
            <button
              onClick={() => {
                const scrollContainer = document.getElementById('canvas-scroll-container')
                if (scrollContainer) {
                  console.log('Scroll container found:', {
                    scrollHeight: scrollContainer.scrollHeight,
                    clientHeight: scrollContainer.clientHeight,
                    scrollTop: scrollContainer.scrollTop
                  })
                  scrollContainer.scrollTo({
                    top: scrollContainer.scrollHeight,
                    behavior: 'smooth'
                  })
                } else {
                  console.log('Scroll container not found')
                }
              }}
              className="bg-blue-600 text-white p-1 rounded hover:bg-blue-700 transition-colors"
              title="Scroll to bottom"
            >
              ↓
            </button>
            <button
              onClick={() => {
                const scrollContainer = document.getElementById('canvas-scroll-container')
                if (scrollContainer) {
                  scrollContainer.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                  })
                }
              }}
              className="bg-green-600 text-white p-1 rounded hover:bg-green-700 transition-colors"
              title="Scroll to top"
            >
              ↑
            </button>
          </div>
        )}
        <div className="p-4 flex justify-center items-start" style={{ 
          minHeight: `${Math.max(canvasDimensions.height * (zoom / 100) + 200, 800)}px`,
          width: '100%'
        }}>
          <div
            ref={canvasRef}
            className={cn(
              "bg-white dark:bg-slate-800 shadow-lg rounded-lg relative border-2 border-gray-300",
              deviceMode === "mobile" && "max-w-[375px]",
              deviceMode === "tablet" && "max-w-[768px]",
              deviceMode === "desktop" && "w-full max-w-none",
            )}
            style={{
              width: canvasDimensions.width,
              height: canvasDimensions.height,
              transform: `scale(${zoom / 100})`,
              transformOrigin: "top center",
              minWidth: deviceMode === "mobile" ? 375 : deviceMode === "tablet" ? 768 : 800,
              minHeight: 300,
              // Add border styling
              borderColor: "#d1d5db",
              borderStyle: "solid",
              borderWidth: "2px",
              // Ensure the canvas doesn't interfere with scrolling
              position: "relative",
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
                    "absolute cursor-pointer transition-all duration-200",
                    isSelected && "ring-2 ring-blue-500",
                    isResizing && isSelected && "ring-2 ring-orange-500"
                  )}
                  style={{
                    left: element.properties.x,
                    top: element.properties.y,
                    width: element.properties.width,
                    height: element.properties.height,
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
                      
                      // Constrain to canvas boundaries
                      const canvasWidth = canvasDimensions.width
                      const canvasHeight = canvasDimensions.height
                      const constrainedX = Math.max(0, Math.min(newX, canvasWidth - element.properties.width))
                      const constrainedY = Math.max(0, Math.min(newY, canvasHeight - element.properties.height))
                      
                      updateElement(element.id, { x: constrainedX, y: constrainedY })
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
                        className="absolute top-0 left-0 w-3 h-3 bg-blue-500 border border-white cursor-nw-resize z-10"
                        onMouseDown={(e) => handleResizeStart(element, "nw", e)}
                      />
                      {/* Top */}
                      <div
                        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 border border-white cursor-n-resize z-10"
                        onMouseDown={(e) => handleResizeStart(element, "n", e)}
                      />
                      {/* Top-right */}
                      <div
                        className="absolute top-0 right-0 w-3 h-3 bg-blue-500 border border-white cursor-ne-resize z-10"
                        onMouseDown={(e) => handleResizeStart(element, "ne", e)}
                      />
                      {/* Right */}
                      <div
                        className="absolute top-1/2 right-0 transform -translate-y-1/2 w-3 h-3 bg-blue-500 border border-white cursor-e-resize z-10"
                        onMouseDown={(e) => handleResizeStart(element, "e", e)}
                      />
                      {/* Bottom-right */}
                      <div
                        className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 border border-white cursor-se-resize z-10"
                        onMouseDown={(e) => handleResizeStart(element, "se", e)}
                      />
                      {/* Bottom */}
                      <div
                        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 border border-white cursor-s-resize"
                        onMouseDown={(e) => handleResizeStart(element, "s", e)}
                      />
                      {/* Bottom-left */}
                      <div
                        className="absolute bottom-0 left-0 w-3 h-3 bg-blue-500 border border-white cursor-sw-resize z-10"
                        onMouseDown={(e) => handleResizeStart(element, "sw", e)}
                      />
                      {/* Left */}
                      <div
                        className="absolute top-1/2 left-0 transform -translate-y-1/2 w-3 h-3 bg-blue-500 border border-white cursor-w-resize z-10"
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
