"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { BuilderHeader } from "@/components/builder/builder-header"
import { ComponentPanel } from "@/components/builder/component-panel"
import { PropertiesPanel } from "@/components/builder/properties-panel"
import { Canvas } from "@/components/builder/canvas"
import { PageManager } from "@/components/builder/page-manager"
import { PreviewMode } from "@/components/builder/preview-mode"
import { useBuilderStore } from "@/lib/store/builder-store"
import { useAutosave } from "@/lib/hooks/use-autosave"
import { fetchProject } from "@/lib/api/projects"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function BuilderPage({ params }: { params: { projectId: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [leftPanelWidth, setLeftPanelWidth] = useState(280)
  const [rightPanelWidth, setRightPanelWidth] = useState(320)
  const [showPageManager, setShowPageManager] = useState(false)
  const [project, setProject] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  const { selectedElement, deviceMode, setElements } = useBuilderStore()

  // Auto-save functionality
  useAutosave(params.projectId, currentPage?.id || "")

  // Listen for preview mode toggle events
  useEffect(() => {
    const handlePreviewToggle = (event: CustomEvent) => {
      setIsPreviewMode(event.detail.isPreview)
    }

    window.addEventListener('previewModeToggle', handlePreviewToggle as EventListener)
    return () => {
      window.removeEventListener('previewModeToggle', handlePreviewToggle as EventListener)
    }
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+P to toggle preview mode
      if (event.ctrlKey && event.key === 'p') {
        event.preventDefault()
        setIsPreviewMode(!isPreviewMode)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isPreviewMode])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    if (status === "authenticated") {
      loadProject()
    }
  }, [status, params.projectId, router])

  const loadProject = async () => {
    try {
      const projectData = await fetchProject(params.projectId)
      setProject(projectData)

      // Set the home page as current page or first page
      const homePage = projectData.pages.find((p: any) => p.isHomePage) || projectData.pages[0]
      if (homePage) {
        setCurrentPage(homePage)
        // Load components for the current page
        const components = homePage.components.map((comp: any) => ({
          id: comp.id,
          type: comp.type,
          properties: {
            ...comp.properties,
            x: comp.x,
            y: comp.y,
            width: comp.width,
            height: comp.height,
            zIndex: comp.zIndex,
          },
        }))
        setElements(components)
      }
    } catch (error) {
      toast.error("Failed to load project")
      router.push("/dashboard")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLeftResize = useCallback((width: number) => {
    setLeftPanelWidth(Math.max(200, Math.min(400, width)))
  }, [])

  const handleRightResize = useCallback((width: number) => {
    setRightPanelWidth(Math.max(250, Math.min(500, width)))
  }, [])

  const handlePageChange = (page: any) => {
    setCurrentPage(page)
    // Load components for the selected page
    const components = page.components.map((comp: any) => ({
      id: comp.id,
      type: comp.type,
      properties: {
        ...comp.properties,
        x: comp.x,
        y: comp.y,
        width: comp.width,
        height: comp.height,
        zIndex: comp.zIndex,
      },
    }))
    setElements(components)
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!session || !project) {
    return null
  }

  return (
    <div className="h-screen bg-slate-50 dark:bg-slate-900 flex flex-col overflow-hidden">
      {/* Header */}
      <BuilderHeader
        project={project}
        currentPage={currentPage}
        onTogglePageManager={() => setShowPageManager(!showPageManager)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div
          className="bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex-shrink-0"
          style={{ width: leftPanelWidth }}
        >
          {showPageManager ? (
            <PageManager
              project={project}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              onClose={() => setShowPageManager(false)}
            />
          ) : (
            <ComponentPanel />
          )}
        </div>

        {/* Resize Handle - Left */}
        <div
          className="w-1 bg-slate-200 dark:bg-slate-700 cursor-col-resize hover:bg-blue-500 transition-colors"
          onMouseDown={(e) => {
            const startX = e.clientX
            const startWidth = leftPanelWidth

            const handleMouseMove = (e: MouseEvent) => {
              const newWidth = startWidth + (e.clientX - startX)
              handleLeftResize(newWidth)
            }

            const handleMouseUp = () => {
              document.removeEventListener("mousemove", handleMouseMove)
              document.removeEventListener("mouseup", handleMouseUp)
            }

            document.addEventListener("mousemove", handleMouseMove)
            document.addEventListener("mouseup", handleMouseUp)
          }}
        />

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Canvas deviceMode={deviceMode} />
        </div>

        {/* Resize Handle - Right */}
        <div
          className="w-1 bg-slate-200 dark:bg-slate-700 cursor-col-resize hover:bg-blue-500 transition-colors"
          onMouseDown={(e) => {
            const startX = e.clientX
            const startWidth = rightPanelWidth

            const handleMouseMove = (e: MouseEvent) => {
              const newWidth = startWidth - (e.clientX - startX)
              handleRightResize(newWidth)
            }

            const handleMouseUp = () => {
              document.removeEventListener("mousemove", handleMouseMove)
              document.removeEventListener("mouseup", handleMouseUp)
            }

            document.addEventListener("mousemove", handleMouseMove)
            document.addEventListener("mouseup", handleMouseUp)
          }}
        />

        {/* Right Sidebar */}
        <div
          className="bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 flex-shrink-0"
          style={{ width: rightPanelWidth }}
        >
          <PropertiesPanel />
        </div>
      </div>

      {/* Preview Mode */}
      <PreviewMode 
        isVisible={isPreviewMode} 
        onClose={() => setIsPreviewMode(false)} 
      />
    </div>
  )
}
