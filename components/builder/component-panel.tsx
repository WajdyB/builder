"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Search,
  Type,
  ImageIcon,
  Square,
  Minus,
  Layout,
  Grid3X3,
  Layers,
  FileText,
  CheckSquare,
  Play,
  Folder,
  ChevronDown,
  ChevronRight,
  Link,
  Circle,
  Tag,
  HelpCircle,
  DollarSign,
  MessageSquare,
  Mail,
  Share2,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Component {
  id: string
  name: string
  icon: React.ReactNode
  category: string
  description?: string
}

const components: Component[] = [
  // Basic Elements
  { id: "text", name: "Text", icon: <Type className="w-4 h-4" />, category: "Basic Elements", description: "Add compelling text content" },
  { id: "image", name: "Image", icon: <ImageIcon className="w-4 h-4" />, category: "Basic Elements", description: "Display images with hover effects" },
  { id: "button", name: "Button", icon: <Square className="w-4 h-4" />, category: "Basic Elements", description: "Interactive buttons with multiple styles" },
  { id: "divider", name: "Divider", icon: <Minus className="w-4 h-4" />, category: "Basic Elements", description: "Separate content sections" },
  { id: "heading", name: "Heading", icon: <Type className="w-4 h-4" />, category: "Basic Elements", description: "Page headings and titles" },
  { id: "paragraph", name: "Paragraph", icon: <FileText className="w-4 h-4" />, category: "Basic Elements", description: "Long text content blocks" },
  { id: "link", name: "Link", icon: <Link className="w-4 h-4" />, category: "Basic Elements", description: "Clickable links and URLs" },

  // Layout
  { id: "section", name: "Section", icon: <Layout className="w-4 h-4" />, category: "Layout", description: "Content containers with styling" },
  { id: "card", name: "Card", icon: <Square className="w-4 h-4" />, category: "Layout", description: "Beautiful card components" },
  { id: "hero", name: "Hero", icon: <Layout className="w-4 h-4" />, category: "Layout", description: "Stunning hero sections" },
  { id: "navigation", name: "Navigation", icon: <Layers className="w-4 h-4" />, category: "Layout", description: "Website navigation menu" },
  { id: "footer", name: "Footer", icon: <Layers className="w-4 h-4" />, category: "Layout", description: "Website footer section" },
  { id: "container", name: "Container", icon: <Square className="w-4 h-4" />, category: "Layout", description: "Content wrapper with max-width" },
  { id: "grid", name: "Grid", icon: <Grid3X3 className="w-4 h-4" />, category: "Layout", description: "CSS Grid layout container" },
  { id: "flex", name: "Flex", icon: <Layers className="w-4 h-4" />, category: "Layout", description: "Flexbox layout container" },
  { id: "sidebar", name: "Sidebar", icon: <Layout className="w-4 h-4" />, category: "Layout", description: "Side navigation panel" },

  // Forms
  { id: "input", name: "Input", icon: <FileText className="w-4 h-4" />, category: "Forms", description: "Text input fields" },
  { id: "textarea", name: "Textarea", icon: <FileText className="w-4 h-4" />, category: "Forms", description: "Multi-line text areas" },
  { id: "checkbox", name: "Checkbox", icon: <CheckSquare className="w-4 h-4" />, category: "Forms", description: "Checkbox inputs" },
  { id: "radio", name: "Radio", icon: <Circle className="w-4 h-4" />, category: "Forms", description: "Radio button inputs" },
  { id: "select", name: "Select", icon: <ChevronDown className="w-4 h-4" />, category: "Forms", description: "Dropdown select menus" },
  { id: "form", name: "Form", icon: <FileText className="w-4 h-4" />, category: "Forms", description: "Form containers" },
  { id: "label", name: "Label", icon: <Tag className="w-4 h-4" />, category: "Forms", description: "Form field labels" },

  // Media
  { id: "video", name: "Video", icon: <Play className="w-4 h-4" />, category: "Media", description: "Video players" },
  { id: "icon", name: "Icon", icon: <ImageIcon className="w-4 h-4" />, category: "Media", description: "Icon components" },
  { id: "gallery", name: "Gallery", icon: <ImageIcon className="w-4 h-4" />, category: "Media", description: "Image galleries" },
  { id: "slider", name: "Slider", icon: <ImageIcon className="w-4 h-4" />, category: "Media", description: "Image carousels" },

  // Interactive
  { id: "tabs", name: "Tabs", icon: <Folder className="w-4 h-4" />, category: "Interactive", description: "Tabbed content" },
  { id: "accordion", name: "Accordion", icon: <Layers className="w-4 h-4" />, category: "Interactive", description: "Collapsible content" },
  { id: "modal", name: "Modal", icon: <Square className="w-4 h-4" />, category: "Interactive", description: "Popup dialogs" },
  { id: "tooltip", name: "Tooltip", icon: <HelpCircle className="w-4 h-4" />, category: "Interactive", description: "Hover information" },
  { id: "dropdown", name: "Dropdown", icon: <ChevronDown className="w-4 h-4" />, category: "Interactive", description: "Dropdown menus" },

  // Business
  { id: "pricing", name: "Pricing", icon: <DollarSign className="w-4 h-4" />, category: "Business", description: "Pricing tables" },
  { id: "testimonial", name: "Testimonial", icon: <MessageSquare className="w-4 h-4" />, category: "Business", description: "Customer reviews" },
  { id: "contact", name: "Contact", icon: <Mail className="w-4 h-4" />, category: "Business", description: "Contact forms" },
  { id: "newsletter", name: "Newsletter", icon: <Mail className="w-4 h-4" />, category: "Business", description: "Email signup forms" },
  { id: "social", name: "Social", icon: <Share2 className="w-4 h-4" />, category: "Business", description: "Social media links" },
]

export function ComponentPanel() {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(["Basic Elements", "Layout"]))

  const filteredComponents = components.filter((component) =>
    component.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const categories = Array.from(new Set(filteredComponents.map((c) => c.category)))

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(category)) {
      newExpanded.delete(category)
    } else {
      newExpanded.add(category)
    }
    setExpandedCategories(newExpanded)
  }

  const handleDragStart = (e: React.DragEvent, component: Component) => {
    try {
      const componentData = {
        id: component.id,
        name: component.name,
        type: component.id,
        category: component.category
      }
      e.dataTransfer.setData("application/json", JSON.stringify(componentData))
      e.dataTransfer.effectAllowed = "copy"
    } catch (error) {
      console.error("Error setting drag data:", error)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Components</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {categories.map((category) => {
            const categoryComponents = filteredComponents.filter((c) => c.category === category)
            const isExpanded = expandedCategories.has(category)

            return (
              <div key={category}>
                <button
                  onClick={() => toggleCategory(category)}
                  className="flex items-center justify-between w-full text-left text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors mb-2"
                >
                  <span>{category}</span>
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>

                {isExpanded && (
                  <div className="grid grid-cols-2 gap-2">
                    {categoryComponents.map((component) => (
                      <div
                        key={component.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, component)}
                        className={cn(
                          "p-4 rounded-lg border border-slate-200 dark:border-slate-700",
                          "bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700",
                          "cursor-grab active:cursor-grabbing transition-colors",
                          "flex flex-col items-center text-center space-y-3",
                        )}
                      >
                        <div className="text-slate-600 dark:text-slate-400">{component.icon}</div>
                        <div className="space-y-1">
                          <span className="text-sm font-medium text-slate-900 dark:text-white">{component.name}</span>
                          {component.description && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">
                              {component.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
