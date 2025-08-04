"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
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

  const getCanvasHeight = () => {
    // Calculate canvas height based on content
    if (elements.length === 0) return "600px"
    
    const maxY = Math.max(...elements.map(el => el.properties.y + el.properties.height))
    return Math.max(600, maxY + 100) + "px"
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    
    try {
      const data = e.dataTransfer.getData("application/json")
      if (!data) return
      
      const componentData = JSON.parse(data)
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return

      // Calculate position relative to canvas, accounting for zoom
      const canvasLeft = rect.left
      const canvasTop = rect.top
      const x = (e.clientX - canvasLeft) / (zoom / 100)
      const y = (e.clientY - canvasTop) / (zoom / 100)
      
      // Ensure minimum position values
      const finalX = Math.max(0, x)
      const finalY = Math.max(0, y)

      // Set default dimensions based on component type
      let width = 200
      let height = 100
      
      if (componentData.id === "section") {
        width = rect.width - 40 // Account for padding
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
      } else if (componentData.id === "hero") {
        width = rect.width - 40
        height = 400
      } else if (componentData.id === "navigation") {
        width = rect.width - 40
        height = 80
      } else if (componentData.id === "footer") {
        width = rect.width - 40
        height = 120
      } else if (componentData.id === "card") {
        width = 300
        height = 200
      }

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
                componentData.id === "heading" ? "" :
                componentData.id === "paragraph" ? "" :
                componentData.id === "link" ? "" : "",
          buttonStyle: componentData.id === "button" ? "primary" : "default",
          buttonSize: componentData.id === "button" ? "default" : "default",
          disabled: componentData.id === "button" ? false : false,
          loading: componentData.id === "button" ? false : false,
          href: componentData.id === "link" ? "#" : "#",
          target: componentData.id === "link" ? "_self" : "_self",
          linkStyle: componentData.id === "link" ? "default" : "default",
          dividerStyle: componentData.id === "divider" ? "solid" : "default",
          sectionStyle: componentData.id === "section" ? "default" : "default",
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
        return (
          <div style={style} className="flex items-center justify-center p-4">
            <HeadingTag 
              className="text-center font-bold"
              style={{ 
                fontFamily: element.properties.fontFamily || 'Inter, sans-serif',
                fontWeight: element.properties.fontWeight || 'bold',
                textAlign: element.properties.textAlign || 'center',
                lineHeight: element.properties.lineHeight || '1.2'
              }}
            >
              {element.properties.text || ""}
            </HeadingTag>
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
        return (
          <div style={style} className="flex items-center justify-center">
            <a 
              href={element.properties.href || "#"}
              className="text-blue-600 hover:text-blue-800 underline transition-colors"
              target={element.properties.target || "_self"}
            >
              {element.properties.text || ""}
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
        const sectionVariants = {
          default: "border-2 border-dashed border-gray-300 bg-gray-50",
          card: "border border-gray-200 bg-white shadow-lg rounded-lg",
          hero: "bg-gradient-to-r from-blue-500 to-purple-600 text-white",
          dark: "bg-gray-800 text-white border border-gray-700",
          accent: "bg-gradient-to-r from-pink-500 to-orange-500 text-white"
        }
        
        return (
          <section style={style} className={`flex items-center justify-center p-8 ${sectionVariants[String(sectionStyle) as keyof typeof sectionVariants]}`}>
            <div className="text-center">
              <div className="text-2xl font-bold mb-4">Section Container</div>
              <div className="text-sm opacity-75">Perfect for organizing your content</div>
            </div>
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
        
        return (
          <div style={{...style, ...heroBackgroundStyle}} className={`flex items-center justify-center ${heroVariants[String(heroStyle) as keyof typeof heroVariants]}`}>
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">{element.properties.heading || "Hero Section"}</h1>
              <p className="text-xl mb-6">{element.properties.subheading || "Create stunning hero sections for your website"}</p>
              {element.properties.buttonText && (
                <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                  {element.properties.buttonText}
                </button>
              )}
            </div>
          </div>
        )

      case "navigation":
        const navStyle = element.properties.navStyle || "default"
        const navVariants = {
          default: "bg-white border-b border-gray-200",
          centered: "bg-white border-b border-gray-200",
          minimal: "bg-transparent",
          dark: "bg-gray-900 text-white border-b border-gray-700"
        }
        
        const menuItems = element.properties.menuItems ? 
          element.properties.menuItems.split(',').map((item: string) => item.trim()) : 
          ['Home', 'About', 'Services', 'Contact']
        
        return (
          <nav style={style} className={`${navVariants[String(navStyle) as keyof typeof navVariants]} ${element.properties.sticky ? 'sticky top-0 z-50' : ''}`}>
            <div className="flex items-center justify-between px-6 py-4">
              <div className="text-xl font-bold text-gray-800">{element.properties.logoText || "Logo"}</div>
              <nav className="flex space-x-6">
                {menuItems.map((item: string, index: number) => (
                  <a key={index} href="#" className="text-gray-600 hover:text-gray-900 transition-colors">{item}</a>
                ))}
              </nav>
            </div>
          </nav>
        )

      case "footer":
        return (
          <footer style={style} className="bg-gray-800 text-white">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-xl font-bold mb-2">Your Company</div>
                <div className="text-sm text-gray-400">© 2024 All rights reserved</div>
              </div>
            </div>
          </footer>
        )

      case "pricing":
        const pricingStyle = element.properties.pricingStyle || "default"
        const pricingVariants = {
          default: "bg-white border border-gray-200 rounded-lg p-6 text-center",
          featured: "bg-blue-600 text-white border border-blue-600 rounded-lg p-6 text-center transform scale-105",
          minimal: "bg-transparent border border-gray-200 rounded-lg p-6 text-center",
          card: "bg-white shadow-lg rounded-lg p-6 text-center"
        }
        
        const features = element.properties.features ? 
          element.properties.features.split(',').map((feature: string) => feature.trim()) : 
          ['Feature 1', 'Feature 2', 'Feature 3']
        
        return (
          <div style={style} className="p-6">
            <div className={pricingVariants[String(pricingStyle) as keyof typeof pricingVariants]}>
              <div className="text-2xl font-bold mb-2">{element.properties.price || "$29"}</div>
              <div className="text-lg font-semibold mb-4">{element.properties.planName || "Pro Plan"}</div>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                {features.map((feature: string, index: number) => (
                  <li key={index}>✓ {feature}</li>
                ))}
              </ul>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg">
                {element.properties.buttonText || "Choose Plan"}
              </button>
            </div>
          </div>
        )

      case "testimonial":
        const testimonialStyle = element.properties.testimonialStyle || "default"
        const testimonialVariants = {
          default: "bg-white border border-gray-200 rounded-lg p-6",
          card: "bg-white shadow-lg rounded-lg p-6",
          minimal: "bg-transparent border border-gray-200 rounded-lg p-6",
          quote: "bg-gray-50 border-l-4 border-blue-500 p-6"
        }
        
        return (
          <div style={style} className="p-6">
            <div className={testimonialVariants[String(testimonialStyle) as keyof typeof testimonialVariants]}>
              <div className="text-gray-600 mb-4">"{element.properties.quote || "This is an amazing product that has transformed our business completely!"}"</div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <div className="font-semibold">{element.properties.authorName || "John Doe"}</div>
                  <div className="text-sm text-gray-500">{element.properties.authorTitle || "CEO, Company"}</div>
                </div>
              </div>
            </div>
          </div>
        )

      case "contact":
        const contactStyle = element.properties.formStyle || "default"
        const contactVariants = {
          default: "bg-white border border-gray-200 rounded-lg p-6",
          card: "bg-white shadow-lg rounded-lg p-6",
          minimal: "bg-transparent border border-gray-200 rounded-lg p-6",
          floating: "bg-white border border-gray-200 rounded-lg p-6"
        }
        
        const formFields = element.properties.formFields ? 
          element.properties.formFields.split(',').map((field: string) => field.trim()) : 
          ['Name', 'Email', 'Message']
        
        return (
          <div style={style} className="p-6">
            <div className={contactVariants[String(contactStyle) as keyof typeof contactVariants]}>
              <h3 className="text-lg font-semibold mb-4">{element.properties.formTitle || "Contact Us"}</h3>
              <div className="space-y-4">
                {formFields.map((field: string, index: number) => (
                  <input 
                    key={index}
                    type={field.toLowerCase() === 'email' ? 'email' : 'text'} 
                    placeholder={field}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                ))}
                <button className="bg-blue-600 text-white px-6 py-2 rounded">
                  {element.properties.submitText || "Send Message"}
                </button>
              </div>
            </div>
          </div>
        )

      case "newsletter":
        const newsletterStyle = element.properties.newsletterStyle || "default"
        const newsletterVariants = {
          default: "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6 text-center",
          gradient: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-lg p-6 text-center",
          minimal: "bg-gray-50 border border-gray-200 rounded-lg p-6 text-center",
          card: "bg-white shadow-lg rounded-lg p-6 text-center"
        }
        
        return (
          <div style={style} className="p-6">
            <div className={newsletterVariants[String(newsletterStyle) as keyof typeof newsletterVariants]}>
              <h3 className="text-xl font-semibold mb-2">{element.properties.newsletterTitle || "Stay Updated"}</h3>
              <p className="mb-4">{element.properties.newsletterDescription || "Subscribe to our newsletter for the latest updates"}</p>
              <div className="flex space-x-2">
                <input 
                  type="email" 
                  placeholder={element.properties.placeholder || "Enter your email"} 
                  className="flex-1 px-3 py-2 rounded text-gray-900" 
                />
                <button className="bg-white text-blue-600 px-4 py-2 rounded font-medium">
                  {element.properties.buttonText || "Subscribe"}
                </button>
              </div>
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
          <div style={style} className="flex items-center justify-center">
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

      // Add all the new components here with the same structure as canvas
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
                <a href="#" className="block text-gray-700 hover:text-blue-600">Home</a>
                <a href="#" className="block text-gray-700 hover:text-blue-600">About</a>
                <a href="#" className="block text-gray-700 hover:text-blue-600">Services</a>
                <a href="#" className="block text-gray-700 hover:text-blue-600">Contact</a>
              </nav>
            </div>
          </div>
        )

      case "radio":
        return (
          <div style={style} className="flex items-center justify-center">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input 
                type="radio" 
                name={element.properties.name || "radio-group"}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="font-medium">{element.properties.label || "Radio option"}</span>
            </label>
          </div>
        )

      case "select":
        return (
          <div style={style} className="flex items-center justify-center p-4">
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">{element.properties.placeholder || "Select an option"}</option>
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </select>
          </div>
        )

      case "label":
        return (
          <div style={style} className="flex items-center justify-center">
            <label className="text-sm font-medium text-gray-700">
              {element.properties.text || "Label"}
            </label>
          </div>
        )

      case "video":
        return (
          <div style={style} className="flex items-center justify-center">
            <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Play className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Video Player</div>
              </div>
            </div>
          </div>
        )

      case "gallery":
        return (
          <div style={style} className="p-4">
            <div className="grid grid-cols-2 gap-4 h-full">
              <div className="bg-gray-200 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
              <div className="bg-gray-200 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
              <div className="bg-gray-200 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
              <div className="bg-gray-200 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
            </div>
          </div>
        )

      case "slider":
        return (
          <div style={style} className="flex items-center justify-center">
            <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Image Slider</div>
              </div>
            </div>
          </div>
        )

      case "modal":
        return (
          <div style={style} className="flex items-center justify-center">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg max-w-sm">
              <div className="text-center">
                <div className="text-lg font-semibold mb-2">Modal Dialog</div>
                <div className="text-sm text-gray-600 mb-4">This is a modal dialog component</div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded">Close</button>
              </div>
            </div>
          </div>
        )

      case "tooltip":
        return (
          <div style={style} className="flex items-center justify-center">
            <div className="relative group">
              <button className="bg-blue-600 text-white px-4 py-2 rounded">
                Hover me
              </button>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Tooltip content
              </div>
            </div>
          </div>
        )

      case "dropdown":
        return (
          <div style={style} className="flex items-center justify-center">
            <div className="relative">
              <button className="bg-white border border-gray-300 rounded-lg px-4 py-2 flex items-center space-x-2">
                <span>Dropdown</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        )

      case "pricing":
        return (
          <div style={style} className="p-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-2xl font-bold mb-2">$29</div>
              <div className="text-lg font-semibold mb-4">Pro Plan</div>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✓ Feature 1</li>
                <li>✓ Feature 2</li>
                <li>✓ Feature 3</li>
              </ul>
              <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg">Choose Plan</button>
            </div>
          </div>
        )

      case "testimonial":
        return (
          <div style={style} className="p-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="text-gray-600 mb-4">"This is an amazing product that has transformed our business completely!"</div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <div className="font-semibold">John Doe</div>
                  <div className="text-sm text-gray-500">CEO, Company</div>
                </div>
              </div>
            </div>
          </div>
        )

      case "contact":
        return (
          <div style={style} className="p-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <div className="space-y-4">
                <input type="text" placeholder="Name" className="w-full px-3 py-2 border border-gray-300 rounded" />
                <input type="email" placeholder="Email" className="w-full px-3 py-2 border border-gray-300 rounded" />
                <textarea placeholder="Message" rows={3} className="w-full px-3 py-2 border border-gray-300 rounded"></textarea>
                <button className="bg-blue-600 text-white px-6 py-2 rounded">Send Message</button>
              </div>
            </div>
          </div>
        )

      case "newsletter":
        return (
          <div style={style} className="p-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Stay Updated</h3>
              <p className="mb-4">Subscribe to our newsletter for the latest updates</p>
              <div className="flex space-x-2">
                <input type="email" placeholder="Enter your email" className="flex-1 px-3 py-2 rounded text-gray-900" />
                <button className="bg-white text-blue-600 px-4 py-2 rounded font-medium">Subscribe</button>
              </div>
            </div>
          </div>
        )

      case "social":
        return (
          <div style={style} className="flex items-center justify-center">
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700">
                <span className="text-sm font-bold">f</span>
              </a>
              <a href="#" className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white hover:bg-blue-500">
                <span className="text-sm font-bold">t</span>
              </a>
              <a href="#" className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center text-white hover:bg-pink-700">
                <span className="text-sm font-bold">in</span>
              </a>
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
              "bg-white dark:bg-slate-800 shadow-lg rounded-lg relative overflow-hidden",
              deviceMode === "mobile" && "max-w-[375px]",
              deviceMode === "tablet" && "max-w-[768px]",
              deviceMode === "desktop" && "w-full max-w-none",
            )}
            style={{
              width: getCanvasWidth(),
              height: getCanvasHeight(),
              transform: `scale(${zoom / 100})`,
              transformOrigin: "top center",
              minHeight: "600px",
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
