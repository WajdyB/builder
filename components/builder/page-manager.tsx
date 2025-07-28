"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, FileText, MoreHorizontal, X, Edit, Trash2, Copy, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { createPage, updatePage, deletePage } from "@/lib/api/pages"
import { toast } from "sonner"

interface PageManagerProps {
  project: any
  currentPage: any
  onPageChange: (page: any) => void
  onClose: () => void
}

export function PageManager({ project, currentPage, onPageChange, onClose }: PageManagerProps) {
  const [pages, setPages] = useState(project.pages || [])
  const [isCreating, setIsCreating] = useState(false)
  const [newPageName, setNewPageName] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleCreatePage = async () => {
    if (!newPageName.trim()) {
      toast.error("Page name is required")
      return
    }

    setIsLoading(true)
    try {
      const newPage = await createPage({
        name: newPageName.trim(),
        projectId: project.id,
      })

      const pageWithComponents = { ...newPage, components: [] }
      setPages((prev) => [...prev, pageWithComponents])
      setNewPageName("")
      setIsCreating(false)
      toast.success("Page created successfully")
    } catch (error) {
      toast.error("Failed to create page")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectPage = (page: any) => {
    onPageChange(page)
  }

  const handleEditPage = (page: any) => {
    setEditingId(page.id)
    setEditingName(page.name)
  }

  const handleSaveEdit = async () => {
    if (!editingName.trim() || !editingId) return

    setIsLoading(true)
    try {
      const updatedPage = await updatePage(editingId, { name: editingName.trim() })
      setPages((prev) => prev.map((page) => (page.id === editingId ? { ...page, name: editingName.trim() } : page)))
      setEditingId(null)
      setEditingName("")
      toast.success("Page updated successfully")
    } catch (error) {
      toast.error("Failed to update page")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeletePage = async (pageId: string) => {
    if (pages.length <= 1) {
      toast.error("Cannot delete the last page")
      return
    }

    const pageToDelete = pages.find((p) => p.id === pageId)
    if (pageToDelete?.isHomePage) {
      toast.error("Cannot delete the home page")
      return
    }

    setIsLoading(true)
    try {
      await deletePage(pageId)
      setPages((prev) => {
        const filtered = prev.filter((page) => page.id !== pageId)
        // If we deleted the current page, switch to the first page
        if (currentPage?.id === pageId && filtered.length > 0) {
          onPageChange(filtered[0])
        }
        return filtered
      })
      toast.success("Page deleted successfully")
    } catch (error) {
      toast.error("Failed to delete page")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDuplicatePage = async (page: any) => {
    setIsLoading(true)
    try {
      const duplicatedPage = await createPage({
        name: `${page.name} Copy`,
        projectId: project.id,
      })

      const pageWithComponents = { ...duplicatedPage, components: [] }
      setPages((prev) => [...prev, pageWithComponents])
      toast.success("Page duplicated successfully")
    } catch (error) {
      toast.error("Failed to duplicate page")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Pages</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <Button onClick={() => setIsCreating(true)} className="w-full" size="sm" disabled={isLoading}>
          <Plus className="w-4 h-4 mr-2" />
          Create New Page
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {/* Create New Page Form */}
          {isCreating && (
            <div className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800">
              <Input
                value={newPageName}
                onChange={(e) => setNewPageName(e.target.value)}
                placeholder="Page name..."
                className="mb-2"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreatePage()
                  if (e.key === "Escape") {
                    setIsCreating(false)
                    setNewPageName("")
                  }
                }}
              />
              <div className="flex space-x-2">
                <Button size="sm" onClick={handleCreatePage} disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Create
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false)
                    setNewPageName("")
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Pages List */}
          {pages.map((page) => (
            <div
              key={page.id}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors",
                currentPage?.id === page.id
                  ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                  : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700",
              )}
              onClick={() => handleSelectPage(page)}
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <FileText
                  className={cn(
                    "w-4 h-4 flex-shrink-0",
                    currentPage?.id === page.id ? "text-blue-600 dark:text-blue-400" : "text-slate-400",
                  )}
                />

                {editingId === page.id ? (
                  <Input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="h-6 text-sm"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveEdit()
                      if (e.key === "Escape") {
                        setEditingId(null)
                        setEditingName("")
                      }
                    }}
                    onBlur={handleSaveEdit}
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <div className="flex-1 min-w-0">
                    <div
                      className={cn(
                        "font-medium truncate",
                        currentPage?.id === page.id
                          ? "text-blue-900 dark:text-blue-100"
                          : "text-slate-900 dark:text-white",
                      )}
                    >
                      {page.name}
                      {page.isHomePage && <span className="ml-2 text-xs text-slate-500">(Home)</span>}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Created {new Date(page.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="sm" disabled={isLoading}>
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEditPage(page)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDuplicatePage(page)}>
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDeletePage(page.id)}
                    disabled={pages.length <= 1 || page.isHomePage}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
