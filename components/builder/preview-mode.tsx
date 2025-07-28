"use client"

import { useState, useEffect } from "react"
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

  const renderComponent = (element: any) => {
    const style = {
      position: "absolute" as const,
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
              {element.properties.text || "Your compelling text here"}
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
              {element.properties.text || "Your Heading"}
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
              {element.properties.text || "Your paragraph text goes here. This is a longer text block that can contain multiple sentences and provide more detailed information to your readers."}
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
              {element.properties.text || "Click here"}
            </a>
          </div>
        )

      case "button":
        const buttonStyle = element.properties.buttonStyle || "primary"
        const buttonVariants = {
          primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl",
          secondary: "bg-gray-600 hover:bg-gray-700 text-white shadow-lg hover:shadow-xl",
          outline: "bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white",
          ghost: "bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900",
          success: "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl",
          danger: "bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl",
          warning: "bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg hover:shadow-xl",
          info: "bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg hover:shadow-xl"
        }
        
        return (
          <button 
            style={style}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${buttonVariants[buttonStyle]}`}
          >
            {element.properties.text || "Click me"}
          </button>
        )

      case "image":
        return (
          <img
            style={style}
            src={element.properties.src || "/placeholder.svg"}
            alt={element.properties.alt || "Image"}
            className="object-cover transition-transform duration-300 hover:scale-105"
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
          <div style={style} className={`w-full ${dividerVariants[dividerStyle]}`}></div>
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
          <section style={style} className={`flex items-center justify-center p-8 ${sectionVariants[sectionStyle]}`}>
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
          <div style={style} className={`p-6 rounded-lg ${cardVariants[cardStyle]}`}>
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
          light: "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800"
        }
        
        return (
          <div style={style} className={`flex items-center justify-center ${heroVariants[heroStyle]}`}>
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Hero Section</h1>
              <p className="text-xl mb-6">Create stunning hero sections for your website</p>
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                Get Started
              </button>
            </div>
          </div>
        )

      case "navigation":
        return (
          <nav style={style} className="bg-white border-b border-gray-200">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="text-xl font-bold text-gray-800">Logo</div>
              <nav className="flex space-x-6">
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Home</a>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">About</a>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Services</a>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</a>
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

      case "input":
        const inputStyle = element.properties.inputStyle || "default"
        const inputVariants = {
          default: "border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
          modern: "border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:ring-0 bg-transparent",
          rounded: "border border-gray-300 rounded-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
          filled: "border-0 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-200"
        }
        
        return (
          <input
            style={style}
            type={element.properties.inputType || "text"}
            placeholder={element.properties.placeholder || "Enter your text..."}
            className={`w-full px-4 py-3 rounded-lg transition-all duration-200 focus:outline-none ${inputVariants[inputStyle]}`}
          />
        )

      case "textarea":
        const textareaStyle = element.properties.textareaStyle || "default"
        const textareaVariants = {
          default: "border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
          modern: "border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:ring-0 bg-transparent",
          filled: "border-0 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-200"
        }
        
        return (
          <textarea
            style={style}
            placeholder={element.properties.placeholder || "Write your message here..."}
            rows={element.properties.rows || 4}
            className={`w-full h-full px-4 py-3 rounded-lg transition-all duration-200 focus:outline-none resize-none ${textareaVariants[textareaStyle]}`}
          />
        )

      case "checkbox":
        const checkboxStyle = element.properties.checkboxStyle || "default"
        const checkboxVariants = {
          default: "flex items-center space-x-3",
          modern: "flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors",
          card: "flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
        }
        
        return (
          <label style={style} className={`cursor-pointer ${checkboxVariants[checkboxStyle]}`}>
            <input 
              type="checkbox" 
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="font-medium">{element.properties.label || "Check this option"}</span>
          </label>
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

  const getPreviewWidth = () => {
    switch (deviceMode) {
      case "mobile":
        return "375px"
      case "tablet":
        return "768px"
      default:
        return "100%"
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
              <span>{elements.length} components</span>
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
            className="bg-white mx-auto relative"
            style={{ 
              width: getPreviewWidth(),
              minHeight: "600px",
              maxWidth: deviceMode === "desktop" ? "100%" : undefined
            }}
          >
            {elements.map((element) => (
              <div key={element.id}>
                {renderComponent(element)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 