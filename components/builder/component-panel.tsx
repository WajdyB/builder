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
  { id: "text", name: "Text", icon: <Type className="w-4 h-4" />, category: "Basic Elements" },
  { id: "image", name: "Image", icon: <ImageIcon className="w-4 h-4" />, category: "Basic Elements" },
  { id: "button", name: "Button", icon: <Square className="w-4 h-4" />, category: "Basic Elements" },
  { id: "divider", name: "Divider", icon: <Minus className="w-4 h-4" />, category: "Basic Elements" },

  // Layout
  { id: "section", name: "Section", icon: <Layout className="w-4 h-4" />, category: "Layout" },
  { id: "container", name: "Container", icon: <Square className="w-4 h-4" />, category: "Layout" },
  { id: "grid", name: "Grid", icon: <Grid3X3 className="w-4 h-4" />, category: "Layout" },
  { id: "flex", name: "Flex", icon: <Layers className="w-4 h-4" />, category: "Layout" },

  // Forms
  { id: "input", name: "Input", icon: <FileText className="w-4 h-4" />, category: "Forms" },
  { id: "textarea", name: "Textarea", icon: <FileText className="w-4 h-4" />, category: "Forms" },
  { id: "checkbox", name: "Checkbox", icon: <CheckSquare className="w-4 h-4" />, category: "Forms" },
  { id: "form", name: "Form", icon: <FileText className="w-4 h-4" />, category: "Forms" },

  // Media
  { id: "video", name: "Video", icon: <Play className="w-4 h-4" />, category: "Media" },
  { id: "icon", name: "Icon", icon: <ImageIcon className="w-4 h-4" />, category: "Media" },

  // Interactive
  { id: "tabs", name: "Tabs", icon: <Folder className="w-4 h-4" />, category: "Interactive" },
  { id: "accordion", name: "Accordion", icon: <Layers className="w-4 h-4" />, category: "Interactive" },
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
                          "p-3 rounded-lg border border-slate-200 dark:border-slate-700",
                          "bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700",
                          "cursor-grab active:cursor-grabbing transition-colors",
                          "flex flex-col items-center text-center space-y-2",
                        )}
                      >
                        <div className="text-slate-600 dark:text-slate-400">{component.icon}</div>
                        <span className="text-xs font-medium text-slate-900 dark:text-white">{component.name}</span>
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
