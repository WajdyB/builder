"use client"

import { useState, useEffect } from "react"
import { useBuilderStore } from "@/lib/store/builder-store"
import { Button } from "@/components/ui/button"
import { X, Maximize2, Minimize2, Play, ImageIcon, ChevronDown } from "lucide-react"

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
                lineHeight: element.properties.lineHeight || '1.2',
                fontSize: headingLevel === 'h1' ? '2.5rem' :
                         headingLevel === 'h2' ? '2rem' :
                         headingLevel === 'h3' ? '1.5rem' :
                         headingLevel === 'h4' ? '1.25rem' :
                         headingLevel === 'h5' ? '1.125rem' :
                         headingLevel === 'h6' ? '1rem' : '2.5rem'
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
        const linkStyle = element.properties.linkStyle || "default"
        const linkVariants: Record<string, string> = {
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
              className={`font-medium ${linkVariants[linkStyle]}`}
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
        const buttonVariants: Record<string, string> = {
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
        const dividerVariants: Record<string, string> = {
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
        const sectionContent = element.properties.sectionContent || "default"
        const sectionVariants: Record<string, string> = {
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
          <section style={style} className={`flex items-center justify-center p-8 ${sectionVariants[sectionStyle]}`}>
            {renderSectionContent()}
          </section>
        )

      case "card":
        const cardStyle = element.properties.cardStyle || "default"
        const cardContent = element.properties.cardContent || "default"
        const cardVariants: Record<string, string> = {
          default: "bg-white border border-gray-200 shadow-sm",
          elevated: "bg-white shadow-lg hover:shadow-xl transition-shadow",
          gradient: "bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200",
          dark: "bg-gray-800 text-white border border-gray-700"
        }
        
        const renderCardContent = () => {
          switch (cardContent) {
            case "custom":
              return (
                <div className="text-center">
                  <div className="text-xl font-bold mb-2">{element.properties.cardTitle || "Card Title"}</div>
                  <div className="text-sm text-gray-600">{element.properties.cardDescription || "This is a beautiful card component with customizable styling."}</div>
                  {element.properties.cardButtonText && (
                    <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition-colors">
                      {element.properties.cardButtonText}
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
                  <div className="text-xl font-bold mb-2">{element.properties.cardTitle || "Card Title"}</div>
                  <div className="text-sm text-gray-600">{element.properties.cardDescription || "This is a beautiful card component with customizable styling."}</div>
                  {element.properties.cardButtonText && (
                    <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition-colors">
                      {element.properties.cardButtonText}
                    </button>
                  )}
                </div>
              )
          }
        }
        
        return (
          <div style={style} className={`p-6 rounded-lg ${cardVariants[cardStyle]}`}>
            {renderCardContent()}
          </div>
        )

      case "hero":
        const heroStyle = element.properties.heroStyle || "default"
        const heroContent = element.properties.heroContent || "default"
        const heroVariants: Record<string, string> = {
          default: "bg-gradient-to-r from-blue-600 to-purple-600 text-white",
          modern: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white",
          dark: "bg-gray-900 text-white",
          light: "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800"
        }
        
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
                  <h1 className="text-4xl font-bold mb-4">Hero Section</h1>
                  <p className="text-xl mb-6">Create stunning hero sections for your website</p>
                  <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                    Get Started
                  </button>
                </div>
              )
          }
        }
        
        return (
          <div style={style} className={`flex items-center justify-center ${heroVariants[heroStyle]}`}>
            {renderHeroContent()}
          </div>
        )

      case "navigation":
        const navStyle = element.properties.navStyle || "default"
        const navContent = element.properties.navContent || "default"
        const navVariants: Record<string, string> = {
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
              return (
                <div className="flex items-center justify-between px-6 py-4">
                  <div className="text-xl font-bold text-gray-800">Logo</div>
                  <nav className="flex space-x-6">
                    <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Home</a>
                    <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">About</a>
                    <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Services</a>
                    <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</a>
                  </nav>
                </div>
              )
          }
        }
        
        return (
          <nav style={style} className={navVariants[navStyle]}>
            {renderNavContent()}
          </nav>
        )

      case "footer":
        const footerStyle = element.properties.footerStyle || "default"
        const footerContent = element.properties.footerContent || "default"
        const footerVariants: Record<string, string> = {
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
          <footer style={style} className={footerVariants[footerStyle]}>
            {renderFooterContent()}
          </footer>
        )

      case "input":
        const inputStyle = element.properties.inputStyle || "default"
        const inputVariants: Record<string, string> = {
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
        const textareaVariants: Record<string, string> = {
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
        const checkboxVariants: Record<string, string> = {
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
        const modalStyle = element.properties.modalStyle || "default"
        const modalVariants: Record<string, string> = {
          default: "bg-white border border-gray-200 rounded-lg shadow-lg",
          modern: "bg-white rounded-lg shadow-xl",
          card: "bg-white border border-gray-200 rounded-lg shadow-lg"
        }
        
        return (
          <div style={style} className="flex items-center justify-center p-4">
            <div className={`max-w-sm w-full ${modalVariants[modalStyle]}`}>
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
        const tooltipVariants: Record<string, string> = {
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
              <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity ${tooltipVariants[tooltipStyle]}`}>
                {element.properties.tooltipText || "Tooltip content"}
              </div>
            </div>
          </div>
        )

      case "dropdown":
        const dropdownStyle = element.properties.dropdownStyle || "default"
        const dropdownVariants: Record<string, string> = {
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
              <div className={`absolute top-full left-0 mt-1 w-full ${dropdownVariants[dropdownStyle]}`}>
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



      case "icon":
        const iconStyle = element.properties.iconStyle || "default"
        const iconVariants: Record<string, string> = {
          default: "text-gray-600",
          primary: "text-blue-600",
          secondary: "text-gray-500",
          accent: "text-purple-600",
          success: "text-green-600",
          warning: "text-yellow-600",
          danger: "text-red-600"
        }
        
        const iconSize = element.properties.iconSize || "default"
        const iconSizeClasses: Record<string, string> = {
          small: "w-4 h-4",
          default: "w-6 h-6",
          large: "w-8 h-8",
          xl: "w-12 h-12"
        }
        
        return (
          <div style={style} className="flex items-center justify-center p-4">
            <div className={`${iconVariants[iconStyle]} ${iconSizeClasses[iconSize]}`}>
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

      case "pricing":
        const pricingStyle = element.properties.pricingStyle || "default"
        const pricingVariants: Record<string, string> = {
          default: "bg-white border border-gray-200 rounded-lg text-center",
          featured: "bg-blue-600 text-white border border-blue-600 rounded-lg text-center transform scale-105",
          minimal: "bg-transparent border border-gray-200 rounded-lg text-center",
          card: "bg-white shadow-lg rounded-lg text-center"
        }
        
        const features = element.properties.features ? 
          element.properties.features.split(',').map((feature: string) => feature.trim()) : 
          ['Feature 1', 'Feature 2', 'Feature 3']
        
        // Calculate dynamic sizing based on component dimensions
        const pricingWidth = parseInt(element.properties.width) || 200
        const pricingHeight = parseInt(element.properties.height) || 250
        
        // Scale padding and font sizes based on component size
        const pricingPaddingScale = Math.min(pricingWidth / 250, pricingHeight / 300, 1.5)
        const pricingPadding = Math.max(8, Math.floor(16 * pricingPaddingScale))
        const pricingPriceSize = Math.max(16, Math.floor(24 * pricingPaddingScale))
        const pricingPlanNameSize = Math.max(14, Math.floor(18 * pricingPaddingScale))
        const pricingFeatureSize = Math.max(10, Math.floor(14 * pricingPaddingScale))
        const pricingButtonPadding = Math.max(4, Math.floor(8 * pricingPaddingScale))
        const pricingSpacing = Math.max(4, Math.floor(8 * pricingPaddingScale))
        
        return (
          <div style={style} className="flex items-center justify-center">
            <div 
              className={pricingVariants[pricingStyle]}
              style={{
                padding: `${pricingPadding}px`,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <div 
                className="font-bold mb-2"
                style={{ fontSize: `${pricingPriceSize}px` }}
              >
                {element.properties.price || "$29"}
              </div>
              <div 
                className="font-semibold mb-4"
                style={{ fontSize: `${pricingPlanNameSize}px` }}
              >
                {element.properties.planName || "Pro Plan"}
              </div>
              <ul 
                className="space-y-2 mb-6"
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
                className="bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
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
        const testimonialVariants: Record<string, string> = {
          default: "bg-white border border-gray-200 rounded-lg p-6",
          card: "bg-white shadow-lg rounded-lg p-6",
          minimal: "bg-transparent border border-gray-200 rounded-lg p-6",
          quote: "bg-gray-50 border-l-4 border-blue-500 p-6"
        }
        
        return (
          <div style={style} className="p-6">
            <div className={testimonialVariants[testimonialStyle]}>
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
        const contactVariants: Record<string, string> = {
          default: "bg-white border border-gray-200 rounded-lg p-6",
          card: "bg-white shadow-lg rounded-lg p-6",
          minimal: "bg-transparent border border-gray-200 rounded-lg p-6",
          floating: "bg-white border border-gray-200 rounded-lg p-6"
        }
        
        const contactFormFields = element.properties.formFields ? 
          element.properties.formFields.split(',').map((field: string) => field.trim()) : 
          ['Name', 'Email', 'Message']
        
        return (
          <div style={style} className="p-6">
            <div className={contactVariants[contactStyle]}>
              <h3 className="text-lg font-semibold mb-4">{element.properties.formTitle || "Contact Us"}</h3>
              <div className="space-y-4">
                {contactFormFields.map((field: string, index: number) => (
                  <input 
                    key={index}
                    type={field.toLowerCase() === 'email' ? 'email' : 'text'} 
                    placeholder={field}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ))}
                <button className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700 transition-colors">
                  {element.properties.submitText || "Send Message"}
                </button>
              </div>
            </div>
          </div>
        )

      case "newsletter":
        const newsletterStyle = element.properties.newsletterStyle || "default"
        const newsletterVariants: Record<string, string> = {
          default: "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6 text-center",
          gradient: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-lg p-6 text-center",
          minimal: "bg-gray-50 border border-gray-200 rounded-lg p-6 text-center",
          card: "bg-white shadow-lg rounded-lg p-6 text-center"
        }
        
        return (
          <div style={style} className="p-6">
            <div className={newsletterVariants[newsletterStyle]}>
              <h3 className="text-xl font-semibold mb-2">{element.properties.newsletterTitle || "Stay Updated"}</h3>
              <p className="mb-4">{element.properties.newsletterDescription || "Subscribe to our newsletter for the latest updates"}</p>
              <div className="flex space-x-2">
                <input 
                  type="email" 
                  placeholder={element.properties.placeholder || "Enter your email"} 
                  className="flex-1 px-3 py-2 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
                <button className="bg-white text-blue-600 px-4 py-2 rounded font-medium hover:bg-gray-100 transition-colors">
                  {element.properties.buttonText || "Subscribe"}
                </button>
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

      case "form":
        const formStyle = element.properties.formStyle || "default"
        const formVariants: Record<string, string> = {
          default: "bg-white border border-gray-200 rounded-lg",
          card: "bg-white shadow-lg rounded-lg",
          minimal: "bg-transparent border border-gray-200 rounded-lg",
          floating: "bg-white border border-gray-200 rounded-lg shadow-lg"
        }
        
        const formFieldList = element.properties.formFields ? 
          element.properties.formFields.split(',').map((field: string) => field.trim()) : 
          ['Name', 'Email', 'Message']
        
        // Calculate dynamic sizing based on component dimensions
        const componentWidth = parseInt(element.properties.width) || 300
        const componentHeight = parseInt(element.properties.height) || 250
        
        // Scale padding and font sizes based on component size
        const paddingScale = Math.min(componentWidth / 400, componentHeight / 300, 1.5)
        const padding = Math.max(8, Math.floor(16 * paddingScale))
        const titleSize = Math.max(12, Math.floor(18 * paddingScale))
        const labelSize = Math.max(10, Math.floor(14 * paddingScale))
        const inputPadding = Math.max(6, Math.floor(12 * paddingScale))
        const buttonPadding = Math.max(4, Math.floor(8 * paddingScale))
        const fieldSpacing = Math.max(8, Math.floor(16 * paddingScale))
        
        return (
          <div style={style} className="flex items-center justify-center">
            <div 
              className={formVariants[formStyle]}
              style={{
                padding: `${padding}px`,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <h3 
                className="font-semibold mb-4"
                style={{ fontSize: `${titleSize}px` }}
              >
                {element.properties.formTitle || "Contact Form"}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: `${fieldSpacing}px` }}>
                {formFieldList.map((field: string, index: number) => (
                  <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label 
                      className="font-medium text-gray-700"
                      style={{ fontSize: `${labelSize}px` }}
                    >
                      {field}
                    </label>
                    {field.toLowerCase() === 'message' ? (
                      <textarea 
                        placeholder={`Enter your ${field.toLowerCase()}`}
                        rows={Math.max(2, Math.floor(3 * paddingScale))}
                        className="w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        style={{
                          padding: `${inputPadding}px`,
                          fontSize: `${labelSize}px`
                        }}
                      />
                    ) : (
                      <input 
                        type={field.toLowerCase() === 'email' ? 'email' : 'text'} 
                        placeholder={`Enter your ${field.toLowerCase()}`}
                        className="w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        style={{
                          padding: `${inputPadding}px`,
                          fontSize: `${labelSize}px`
                        }}
                      />
                    )}
                  </div>
                ))}
                <button 
                  className="w-full bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
                  style={{
                    padding: `${buttonPadding}px ${buttonPadding * 2}px`,
                    fontSize: `${labelSize}px`,
                    marginTop: `${fieldSpacing}px`
                  }}
                >
                  {element.properties.submitText || "Submit"}
                </button>
              </div>
            </div>
          </div>
        )

      case "tabs":
        const tabsStyle = element.properties.tabsStyle || "default"
        const tabsVariants: Record<string, string> = {
          default: "border-b border-gray-200",
          modern: "bg-gray-50 rounded-lg p-1",
          card: "bg-white border border-gray-200 rounded-lg p-1"
        }
        
        const tabItems = element.properties.tabItems ? 
          element.properties.tabItems.split(',').map((item: string) => item.trim()) : 
          ['Tab 1', 'Tab 2', 'Tab 3']
        
        return (
          <div style={style} className="p-4">
            <div className={tabsVariants[tabsStyle]}>
              <div className="flex space-x-1">
                {tabItems.map((item: string, index: number) => (
                  <button
                    key={index}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      index === 0 ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}
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
        const accordionVariants: Record<string, string> = {
          default: "border border-gray-200 rounded-lg",
          modern: "bg-white shadow-sm rounded-lg",
          card: "bg-white border border-gray-200 rounded-lg shadow-sm"
        }
        
        const accordionItems = element.properties.accordionItems ? 
          element.properties.accordionItems.split(',').map((item: string) => item.trim()) : 
          ['Section 1', 'Section 2', 'Section 3']
        
        return (
          <div style={style} className="p-4">
            <div className={accordionVariants[accordionStyle]}>
              {accordionItems.map((item: string, index: number) => (
                <div key={index} className="border-b border-gray-200 last:border-b-0">
                  <button className="w-full px-4 py-3 text-left font-medium hover:bg-gray-50 transition-colors flex items-center justify-between">
                    <span>{item}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
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

  const getPreviewWidth = () => {
    // CRITICAL: Use the exact same dimensions as the canvas
    // This ensures perfect synchronization between builder and preview
    switch (deviceMode) {
      case "mobile":
        return "375px"
      case "tablet":
        return "768px"
      default:
        return "1200px" // Match the new canvas width
    }
  }

  const getPreviewHeight = () => {
    // Use the same height calculation as canvas
    if (elements.length === 0) {
      return "600px"
    }
    
    const maxY = Math.max(...elements.map(el => (el.properties.y || 0) + (el.properties.height || 0)))
    const requiredHeight = Math.max(600, maxY + 100)
    return `${requiredHeight}px`
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
              height: getPreviewHeight(),
              maxWidth: deviceMode === "desktop" ? "100%" : undefined
            }}
          >
            {/* Device Boundary Indicator */}
            <div className="absolute inset-0 border-2 border-dashed border-blue-300 pointer-events-none z-10">
              <div className="absolute top-2 left-2 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                {deviceMode.charAt(0).toUpperCase() + deviceMode.slice(1)} ({getPreviewWidth()} × {getPreviewHeight()})
              </div>
            </div>
            
            {/* Components */}
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