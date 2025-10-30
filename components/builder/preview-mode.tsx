"use client"

import { useState } from "react"
import { useBuilderStore } from "@/lib/store/builder-store"
import { Button } from "@/components/ui/button"
import { X, Maximize2, Minimize2 } from "lucide-react"

interface PreviewModeProps {
  isVisible: boolean
  onClose: () => void
}

export function PreviewMode({ isVisible, onClose }: PreviewModeProps) {
  const { elements, deviceMode } = useBuilderStore()
  const [isFullscreen, setIsFullscreen] = useState(false)

  if (!isVisible) return null

  const getPreviewDimensions = () => {
    const deviceWidth = deviceMode === "mobile" ? 375 : deviceMode === "tablet" ? 768 : 1200
    const deviceHeight = 600

    if (elements.length === 0) {
      return { width: deviceWidth, height: deviceHeight }
    }

    const maxY = Math.max(...elements.map(el => (el.properties.y || 0) + (el.properties.height || 0)))
    const requiredHeight = Math.max(deviceHeight, maxY + 100)

    return { width: deviceWidth, height: requiredHeight }
  }

  const dimensions = getPreviewDimensions()

  const renderComponent = (element: any) => {
    const style: React.CSSProperties = {
      position: "absolute",
      left: element.properties.x,
      top: element.properties.y,
      width: element.properties.width,
      height: element.properties.height,
      backgroundColor: element.properties.backgroundColor,
      color: element.properties.color,
      fontSize: element.properties.fontSize,
      padding: element.properties.padding,
      borderRadius: element.properties.borderRadius,
      borderWidth: element.properties.borderWidth,
      borderColor: element.properties.borderColor,
      borderStyle: element.properties.borderWidth > 0 ? "solid" : "none",
      zIndex: element.properties.zIndex,
      fontFamily: element.properties.fontFamily || 'Inter, sans-serif',
      fontWeight: element.properties.fontWeight || 'normal',
      textAlign: element.properties.textAlign as any || 'left',
      lineHeight: element.properties.lineHeight || '1.5',
    }

    switch (element.type) {
      case "text":
        return (
          <div key={element.id} style={style} className="flex items-center justify-center">
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
          <div key={element.id} style={style} className="flex items-center justify-center">
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
          <div key={element.id} style={style} className="flex items-center justify-center p-4">
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
          <div key={element.id} style={style} className="flex items-center justify-center">
            <button 
              className={`px-6 py-3 rounded-lg font-medium transition-all ${buttonVariants[buttonStyle]}`}
            >
              {element.properties.text || "Click me"}
            </button>
          </div>
        )

      case "link":
        return (
          <div key={element.id} style={style} className="flex items-center justify-center">
            <a 
              href={element.properties.href || "#"}
              className="text-blue-600 hover:text-blue-800 underline"
              target={element.properties.target || "_self"}
            >
              {element.properties.text || "Click here"}
            </a>
          </div>
        )

      case "image":
        return (
          <div key={element.id} style={style} className="flex items-center justify-center bg-gray-100">
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
          <div key={element.id} style={style} className="w-full flex items-center">
            <div className="w-full border-t-2 border-gray-300"></div>
          </div>
        )

      case "section":
        return (
          <div key={element.id} style={style} className="border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
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
          <div key={element.id} style={style} className="bg-white border border-gray-200 shadow-sm rounded-lg p-6">
            <div className="text-center">
              <div className="text-xl font-bold mb-2">
                {element.properties.cardTitle || "Card Title"}
              </div>
              <div className="text-sm text-gray-600">
                {element.properties.cardDescription || "This is a beautiful card component."}
              </div>
              {element.properties.cardButtonText && (
                <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700">
                  {element.properties.cardButtonText}
                </button>
              )}
            </div>
          </div>
        )

      case "hero":
        return (
          <div key={element.id} style={style} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">
                {element.properties.heroTitle || "Hero Section"}
              </h1>
              <p className="text-xl mb-6">
                {element.properties.heroDescription || "Create stunning hero sections"}
              </p>
              {element.properties.heroButtonText && (
                <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100">
                  {element.properties.heroButtonText}
                </button>
              )}
            </div>
          </div>
        )

      case "navigation":
        const navItems = element.properties.customMenuItems ? 
          element.properties.customMenuItems.split(',').map((item: string) => item.trim()) : 
          ['Home', 'About', 'Services', 'Contact']
        
        return (
          <div key={element.id} style={style} className="bg-white border-b border-gray-200 flex items-center justify-between px-6">
            <div className="text-xl font-bold">
              {element.properties.navLogoText || "Logo"}
            </div>
            <div className="flex space-x-6">
              {navItems.map((item: string, index: number) => (
                <a key={index} href="#" className="text-gray-600 hover:text-gray-900">{item}</a>
              ))}
            </div>
          </div>
        )

      case "footer":
        return (
          <div key={element.id} style={style} className="bg-gray-800 text-white flex items-center justify-center">
            <div className="text-center">
              <div className="text-xl font-bold mb-2">
                {element.properties.footerCompanyName || "Your Company"}
              </div>
              <div className="text-sm opacity-75">
                {element.properties.footerCopyrightText || "© 2024 All rights reserved"}
              </div>
              {element.properties.footerAdditionalText && (
                <div className="text-xs mt-2 opacity-60">
                  {element.properties.footerAdditionalText}
                </div>
              )}
            </div>
          </div>
        )

      case "input":
        return (
          <div key={element.id} style={style} className="flex items-center justify-center p-4">
            <input
              type={element.properties.inputType || "text"}
              placeholder={element.properties.placeholder || "Enter your text..."}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none"
            />
          </div>
        )

      case "textarea":
        return (
          <div key={element.id} style={style} className="flex items-center justify-center p-4">
            <textarea
              placeholder={element.properties.placeholder || "Write your message here..."}
              rows={element.properties.rows || 4}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none resize-none"
            />
          </div>
        )

      case "checkbox":
        return (
          <label key={element.id} style={style} className="flex items-center space-x-3 cursor-pointer">
            <input 
              type="checkbox" 
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="font-medium">{element.properties.label || "Check this option"}</span>
          </label>
        )

      case "form":
        const formFields = element.properties.formFields ? 
          element.properties.formFields.split(',').map((field: string) => field.trim()) : 
          ['Name', 'Email', 'Message']
        
        return (
          <div key={element.id} style={style} className="flex items-center justify-center p-6">
            <div className="w-full max-w-md space-y-4">
              <h3 className="text-lg font-semibold">{element.properties.formTitle || "Contact Form"}</h3>
              {formFields.map((field: string, index: number) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field}</label>
                  {field.toLowerCase() === 'message' ? (
                    <textarea
                      placeholder={`Enter your ${field.toLowerCase()}`}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <input
                      type={field.toLowerCase() === 'email' ? 'email' : 'text'}
                      placeholder={`Enter your ${field.toLowerCase()}`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>
              ))}
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700">
                {element.properties.submitText || "Submit"}
              </button>
            </div>
          </div>
        )

      default:
        return (
          <div key={element.id} style={style} className="flex items-center justify-center text-gray-500 bg-gray-50">
            <div className="text-center">
              <div className="text-lg font-semibold mb-2">{element.type}</div>
              <div className="text-sm">Component</div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className={`bg-white rounded-lg shadow-2xl ${isFullscreen ? 'w-full h-full' : 'w-full max-w-6xl h-5/6'} flex flex-col`}>
        {/* Preview Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold">Preview Mode</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>{deviceMode.charAt(0).toUpperCase() + deviceMode.slice(1)} View</span>
              <span>•</span>
              <span>{dimensions.width}×{dimensions.height}px</span>
              <span>•</span>
              <span>{elements.length} component{elements.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-auto bg-gray-100 p-4">
          <div 
            className="bg-white mx-auto relative shadow-lg"
            style={{ 
              width: dimensions.width,
              height: dimensions.height,
            }}
          >
            {/* Device Boundary Indicator */}
            <div className="absolute top-2 left-2 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium pointer-events-none z-50">
              {deviceMode.charAt(0).toUpperCase() + deviceMode.slice(1)} Preview
            </div>
            
            {/* Components */}
            {elements.map((element) => renderComponent(element))}

            {/* Empty State */}
            {elements.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-4">📄</div>
                  <h3 className="text-lg font-semibold mb-2">No Content Yet</h3>
                  <p className="text-sm">Start adding components to see them here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
