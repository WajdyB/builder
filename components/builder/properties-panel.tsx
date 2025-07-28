"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Type, Palette, Layout, Move, Trash2, Copy, Lock } from "lucide-react"
import { useBuilderStore } from "@/lib/store/builder-store"

interface Element {
  id: string
  type: string
  properties: Record<string, any>
}

interface PropertiesPanelProps {
  selectedElement: Element | null
}

export function PropertiesPanel({ selectedElement }: PropertiesPanelProps) {
  const updateElement = useBuilderStore((state) => state.updateElement)
  const deleteElement = useBuilderStore((state) => state.deleteElement)
  const duplicateElement = useBuilderStore((state) => state.duplicateElement)

  const [properties, setProperties] = useState(selectedElement?.properties || {})

  // Sync local state with selectedElement
  useEffect(() => {
    setProperties(selectedElement?.properties || {})
  }, [selectedElement])

  if (!selectedElement) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Properties</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-slate-500 dark:text-slate-400">
            <Layout className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Select an element to edit its properties</p>
          </div>
        </div>
      </div>
    )
  }

  const updateProperty = (key: string, value: any) => {
    setProperties((prev) => ({ ...prev, [key]: value }))
    updateElement(selectedElement.id, { [key]: value })
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Properties</h2>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" onClick={() => duplicateElement(selectedElement.id)}>
              <Copy className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Lock className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => deleteElement(selectedElement.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-400 capitalize">{selectedElement.type} Element</div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="content" className="text-xs">
                <Type className="w-3 h-3 mr-1" />
                Content
              </TabsTrigger>
              <TabsTrigger value="style" className="text-xs">
                <Palette className="w-3 h-3 mr-1" />
                Style
              </TabsTrigger>
              <TabsTrigger value="layout" className="text-xs">
                <Layout className="w-3 h-3 mr-1" />
                Layout
              </TabsTrigger>
              <TabsTrigger value="position" className="text-xs">
                <Move className="w-3 h-3 mr-1" />
                Position
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4 mt-4">
              {selectedElement.type === "text" && (
                <>
                  <div className="space-y-2">
                    <Label>Text Content</Label>
                    <Input
                      value={properties.text || ""}
                      onChange={(e) => updateProperty("text", e.target.value)}
                      placeholder="Enter text..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Font Family</Label>
                    <Select
                      value={properties.fontFamily || "inter"}
                      onValueChange={(value) => updateProperty("fontFamily", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inter">Inter</SelectItem>
                        <SelectItem value="roboto">Roboto</SelectItem>
                        <SelectItem value="arial">Arial</SelectItem>
                        <SelectItem value="helvetica">Helvetica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {selectedElement.type === "button" && (
                <>
                  <div className="space-y-2">
                    <Label>Button Text</Label>
                    <Input
                      value={properties.text || ""}
                      onChange={(e) => updateProperty("text", e.target.value)}
                      placeholder="Button text..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Link URL</Label>
                    <Input
                      value={properties.href || ""}
                      onChange={(e) => updateProperty("href", e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                </>
              )}

              {selectedElement.type === "image" && (
                <>
                  <div className="space-y-2">
                    <Label>Image URL</Label>
                    <Input
                      value={properties.src || ""}
                      onChange={(e) => updateProperty("src", e.target.value)}
                      placeholder="Image URL..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Alt Text</Label>
                    <Input
                      value={properties.alt || ""}
                      onChange={(e) => updateProperty("alt", e.target.value)}
                      placeholder="Alt text..."
                    />
                  </div>
                </>
              )}

              {selectedElement.type === "input" && (
                <>
                  <div className="space-y-2">
                    <Label>Placeholder Text</Label>
                    <Input
                      value={properties.placeholder || ""}
                      onChange={(e) => updateProperty("placeholder", e.target.value)}
                      placeholder="Enter placeholder..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Input Type</Label>
                    <Select
                      value={properties.inputType || "text"}
                      onValueChange={(value) => updateProperty("inputType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="password">Password</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="tel">Phone</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {selectedElement.type === "textarea" && (
                <>
                  <div className="space-y-2">
                    <Label>Placeholder Text</Label>
                    <Input
                      value={properties.placeholder || ""}
                      onChange={(e) => updateProperty("placeholder", e.target.value)}
                      placeholder="Enter placeholder..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Rows</Label>
                    <Input
                      type="number"
                      value={properties.rows || 3}
                      onChange={(e) => updateProperty("rows", parseInt(e.target.value) || 3)}
                      placeholder="3"
                      min="1"
                      max="10"
                    />
                  </div>
                </>
              )}

              {selectedElement.type === "checkbox" && (
                <>
                  <div className="space-y-2">
                    <Label>Label Text</Label>
                    <Input
                      value={properties.label || ""}
                      onChange={(e) => updateProperty("label", e.target.value)}
                      placeholder="Checkbox label..."
                    />
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="style" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Background Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="color"
                    value={properties.backgroundColor || "#ffffff"}
                    onChange={(e) => updateProperty("backgroundColor", e.target.value)}
                    className="w-12 h-8 p-1 rounded"
                  />
                  <Input
                    value={properties.backgroundColor || "#ffffff"}
                    onChange={(e) => updateProperty("backgroundColor", e.target.value)}
                    placeholder="#ffffff"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Text Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="color"
                    value={properties.color || "#000000"}
                    onChange={(e) => updateProperty("color", e.target.value)}
                    className="w-12 h-8 p-1 rounded"
                  />
                  <Input
                    value={properties.color || "#000000"}
                    onChange={(e) => updateProperty("color", e.target.value)}
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Font Size (px)</Label>
                <Input
                  type="number"
                  value={properties.fontSize || 16}
                  onChange={(e) => updateProperty("fontSize", parseInt(e.target.value) || 16)}
                  placeholder="16"
                  min="8"
                  max="72"
                />
              </div>

              <div className="space-y-2">
                <Label>Border Radius (px)</Label>
                <Input
                  type="number"
                  value={properties.borderRadius || 0}
                  onChange={(e) => updateProperty("borderRadius", parseInt(e.target.value) || 0)}
                  placeholder="0"
                  min="0"
                  max="50"
                />
              </div>
            </TabsContent>

            <TabsContent value="layout" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Width (px)</Label>
                  <Input
                    type="number"
                    value={properties.width || 200}
                    onChange={(e) => updateProperty("width", parseInt(e.target.value) || 0)}
                    placeholder="200"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Height (px)</Label>
                  <Input
                    type="number"
                    value={properties.height || 100}
                    onChange={(e) => updateProperty("height", parseInt(e.target.value) || 0)}
                    placeholder="100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Padding (px)</Label>
                <Input
                  type="number"
                  value={properties.padding || 8}
                  onChange={(e) => updateProperty("padding", parseInt(e.target.value) || 0)}
                  placeholder="8"
                />
              </div>

              <div className="space-y-2">
                <Label>Border Radius (px)</Label>
                <Input
                  type="number"
                  value={properties.borderRadius || 0}
                  onChange={(e) => updateProperty("borderRadius", parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
            </TabsContent>

            <TabsContent value="position" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>X Position (px)</Label>
                  <Input
                    type="number"
                    value={properties.x || 0}
                    onChange={(e) => updateProperty("x", parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Y Position (px)</Label>
                  <Input
                    type="number"
                    value={properties.y || 0}
                    onChange={(e) => updateProperty("y", parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Z-Index</Label>
                <Input
                  type="number"
                  value={properties.zIndex || 0}
                  onChange={(e) => updateProperty("zIndex", parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  )
}
