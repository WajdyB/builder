"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Undo2,
  Redo2,
  Eye,
  Save,
  Share,
  Download,
  Monitor,
  Tablet,
  Smartphone,
  Sun,
  Moon,
  ArrowLeft,
  ChevronDown,
  FileText,
  Loader2,
  User,
  Settings,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useBuilderStore } from "@/lib/store/builder-store"
import { useTheme } from "next-themes"
import { useSession } from "next-auth/react"
import { updateProject, exportProject } from "@/lib/api/projects"
import { toast } from "sonner"
import Image from "next/image"

interface BuilderHeaderProps {
  project: any
  currentPage: any
  onTogglePageManager: () => void
}

export function BuilderHeader({ project, currentPage, onTogglePageManager }: BuilderHeaderProps) {
  const [projectName, setProjectName] = useState(project.title)
  const [isEditing, setIsEditing] = useState(false)
  const [isPreview, setIsPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [profileData, setProfileData] = useState<any>(null)

  const { deviceMode, setDeviceMode, undo, redo, canUndo, canRedo, elements } = useBuilderStore()
  const { theme, setTheme } = useTheme()
  const { data: session } = useSession()

  // Fetch profile data when session changes
  useEffect(() => {
    if (session?.user?.id) {
      fetchLatestProfile()
    }
  }, [session?.user?.id])

  // Function to fetch latest profile data
  const fetchLatestProfile = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const data = await response.json()
        setProfileData(data.user)
      }
    } catch (error) {
      // Silently handle error, fallback to session data
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateProject(project.id, { title: projectName })
      toast.success("Project saved successfully")
    } catch (error) {
      toast.error("Failed to save project")
    } finally {
      setIsSaving(false)
    }
  }

  const handleExport = async (format: "html" | "css" | "json") => {
    setIsExporting(true)
    try {
      const content = await exportProject(project.id, format)

      // Create and trigger download
      const blob = new Blob([typeof content === "string" ? content : JSON.stringify(content, null, 2)], {
        type: format === "json" ? "application/json" : format === "css" ? "text/css" : "text/html",
      })

      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${project.title}.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success(`Exported as ${format.toUpperCase()}`)
    } catch (error) {
      toast.error(`Failed to export as ${format.toUpperCase()}`)
    } finally {
      setIsExporting(false)
    }
  }

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/preview/${project.id}`
    navigator.clipboard.writeText(shareUrl)
    toast.success("Share link copied to clipboard")
  }

  const handleNameSave = async () => {
    if (projectName !== project.title) {
      try {
        await updateProject(project.id, { title: projectName })
        project.title = projectName // Update local state
        toast.success("Project name updated")
      } catch (error) {
        toast.error("Failed to update project name")
        setProjectName(project.title) // Revert on error
      }
    }
    setIsEditing(false)
  }

  const handlePreviewToggle = () => {
    setIsPreview(!isPreview)
    // Emit a custom event to notify other components about preview mode
    window.dispatchEvent(new CustomEvent('previewModeToggle', { detail: { isPreview: !isPreview } }))
  }

  return (
    <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-2 flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />

        {/* Logo and Project Name */}
        <div className="flex items-center space-x-2">
          <Image
            src="/logo.png"
            alt="CMS-Builder Logo"
            width={24}
            height={24}
            className="rounded-lg"
          />
          {/* Project Name */}
          {isEditing ? (
            <Input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onBlur={handleNameSave}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleNameSave()
                if (e.key === "Escape") {
                  setProjectName(project.title)
                  setIsEditing(false)
                }
              }}
              className="w-48 h-8"
              autoFocus
            />
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="text-lg font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {projectName}
            </button>
          )}
        </div>

        <Button variant="ghost" size="sm" onClick={onTogglePageManager}>
          <FileText className="w-4 h-4 mr-2" />
          {currentPage?.name || "Pages"}
        </Button>
      </div>

      {/* Center Section */}
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" onClick={undo} disabled={!canUndo}>
          <Undo2 className="w-4 h-4" />
        </Button>

        <Button variant="ghost" size="sm" onClick={redo} disabled={!canRedo}>
          <Redo2 className="w-4 h-4" />
        </Button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />

        {/* Device Mode */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
          <Button
            variant={deviceMode === "desktop" ? "default" : "ghost"}
            size="sm"
            onClick={() => setDeviceMode("desktop")}
            className="h-8 px-3"
          >
            <Monitor className="w-4 h-4" />
          </Button>
          <Button
            variant={deviceMode === "tablet" ? "default" : "ghost"}
            size="sm"
            onClick={() => setDeviceMode("tablet")}
            className="h-8 px-3"
          >
            <Tablet className="w-4 h-4" />
          </Button>
          <Button
            variant={deviceMode === "mobile" ? "default" : "ghost"}
            size="sm"
            onClick={() => setDeviceMode("mobile")}
            className="h-8 px-3"
          >
            <Smartphone className="w-4 h-4" />
          </Button>
        </div>

        <Button variant={isPreview ? "default" : "ghost"} size="sm" onClick={handlePreviewToggle}>
          <Eye className="w-4 h-4 mr-2" />
          Preview
          <span className="ml-2 text-xs opacity-60">Ctrl+P</span>
        </Button>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>

        <Button variant="outline" size="sm" onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" disabled={isExporting}>
              {isExporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
              Export
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleExport("html")}>Export as HTML</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("css")}>Export as CSS</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("json")}>Export as JSON</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          size="sm"
          onClick={handleShare}
        >
          <Share className="w-4 h-4 mr-2" />
          Share
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="w-8 h-8 cursor-pointer hover:opacity-80 transition-opacity">
              <AvatarImage src={profileData?.image || session?.user?.image} alt="Profile" />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-green-500 text-white text-sm">
                {profileData?.name ? profileData.name.charAt(0).toUpperCase() : session?.user?.name ? session.user.name.charAt(0).toUpperCase() : session?.user?.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Profile Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard" className="flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
