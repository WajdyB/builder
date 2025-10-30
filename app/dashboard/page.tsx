"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Globe,
  Calendar,
  Settings,
  User,
  LogOut,
  Loader2,
  Trash2,
  Edit,
  Download,
  Copy,
  Grid,
  List,
  FileText,
  Eye,
  EyeOff,
  CheckCircle,
  Clock,
  AlertCircle,
  Play,
  Pause,
  Archive,
  RefreshCw,
  TrendingUp,
  BarChart3,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { fetchProjects, createProject, deleteProject } from "@/lib/api/projects"
import { toast } from "sonner"

// Enhanced Project Interface with more states
interface Project {
  id: string
  title: string
  description?: string
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED" | "REVIEW" | "MAINTENANCE" | "EXPORTED"
  _count: { pages: number }
  createdAt: string
  updatedAt: string
  publishedAt?: string
  exportedAt?: string
  archivedAt?: string
  version?: string
  analytics?: {
    views: number
    downloads: number
    lastViewed?: string
  }
}

// Project Status Configuration
const PROJECT_STATUSES = {
  DRAFT: {
    label: "Draft",
    description: "Work in progress",
    color: "bg-gray-100 text-gray-700 border-gray-300",
    icon: Clock,
    bgColor: "bg-gray-50",
    textColor: "text-gray-600"
  },
  PUBLISHED: {
    label: "Published",
    description: "Live and accessible",
    color: "bg-green-100 text-green-700 border-green-300",
    icon: CheckCircle,
    bgColor: "bg-green-50",
    textColor: "text-green-600"
  },
  REVIEW: {
    label: "In Review",
    description: "Pending approval",
    color: "bg-yellow-100 text-yellow-700 border-yellow-300",
    icon: Eye,
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-600"
  },
  MAINTENANCE: {
    label: "Maintenance",
    description: "Under maintenance",
    color: "bg-orange-100 text-orange-700 border-orange-300",
    icon: AlertCircle,
    bgColor: "bg-orange-50",
    textColor: "text-orange-600"
  },
  EXPORTED: {
    label: "Exported",
    description: "Downloaded package",
    color: "bg-blue-100 text-blue-700 border-blue-300",
    icon: Download,
    bgColor: "bg-blue-50",
    textColor: "text-blue-600"
  },
  ARCHIVED: {
    label: "Archived",
    description: "Stored for reference",
    color: "bg-purple-100 text-purple-700 border-purple-300",
    icon: Archive,
    bgColor: "bg-purple-50",
    textColor: "text-purple-600"
  }
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("ALL")
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [newProjectTitle, setNewProjectTitle] = useState("")
  const [newProjectDescription, setNewProjectDescription] = useState("")
  const [newProjectStatus, setNewProjectStatus] = useState<keyof typeof PROJECT_STATUSES>("DRAFT")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [profileData, setProfileData] = useState<any>(null)
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null)
  const [duplicatingProject, setDuplicatingProject] = useState<string | null>(null)
  const [exportingProject, setExportingProject] = useState<string | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards")

  // Function to manually fetch latest profile data
  const fetchLatestProfile = useCallback(async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const data = await response.json()
        setProfileData(data.user)
        return data.user
      } else {
        return null
      }
    } catch (error) {
      return null
    }
  }, [])

  // Fetch profile data when session changes
  useEffect(() => {
    if (session?.user?.id) {
      fetchLatestProfile()
    }
  }, [session?.user?.id])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    if (status === "authenticated") {
      loadProjects()
    }
  }, [status, router])

  // Refresh projects when the page regains focus (e.g., returning from builder)
  useEffect(() => {
    const handleFocus = () => {
      if (status === "authenticated" && projects.length > 0) {
        loadProjects()
      }
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [status, projects.length])

  const loadProjects = async () => {
    try {
      const data = await fetchProjects()
      // Initialize projects with real analytics data starting from 0
      const enhancedData = data.map((project: any) => ({
        ...project,
        analytics: {
          views: 0, // Start from 0
          downloads: 0, // Start from 0
          lastViewed: undefined
        },
        version: "1.0.0",
        // Ensure status is properly set (existing projects might have default status)
        status: project.status || "DRAFT"
      }))
      setProjects(enhancedData)
    } catch (error) {
      toast.error("Failed to load projects")
    } finally {
      setIsLoading(false)
    }
  }

  // Track project view when user interacts with project
  const trackProjectView = useCallback(async (projectId: string) => {
    try {
      // Update local state immediately for better UX
      setProjects(prev => prev.map(p => {
        if (p.id === projectId) {
          return {
            ...p,
            analytics: {
              views: (p.analytics?.views || 0) + 1,
              downloads: p.analytics?.downloads || 0,
              lastViewed: new Date().toISOString()
            }
          } as Project
        }
        return p
      }))

      // In a real app, you'd also send this to your backend
      // await fetch(`/api/projects/${projectId}/view`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ timestamp: new Date().toISOString() })
      // })
    } catch (error) {
      console.error('Failed to track view:', error)
    }
  }, [])

  // Track project download
  const trackProjectDownload = useCallback(async (projectId: string, format: string) => {
    try {
      // Update local state immediately for better UX
      setProjects(prev => prev.map(p => {
        if (p.id === projectId) {
          return {
            ...p,
            analytics: {
              views: p.analytics?.views || 0,
              downloads: (p.analytics?.downloads || 0) + 1
            }
          } as Project
        }
        return p
      }))

      // In a real app, you'd also send this to your backend
      // await fetch(`/api/projects/${projectId}/download`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ 
      //     format, 
      //     timestamp: new Date().toISOString() 
      //   })
      // })
    } catch (error) {
      console.error('Failed to track download:', error)
    }
  }, [])

  const handleCreateProject = async () => {
    if (!newProjectTitle.trim()) {
      toast.error("Project title is required")
      return
    }

    setIsCreating(true)
    try {
      const project = await createProject({
        title: newProjectTitle.trim(),
        description: newProjectDescription.trim() || undefined,
      })

      // Create new project with analytics starting from 0
      const enhancedProject: Project = {
        ...project,
        status: newProjectStatus,
        analytics: {
          views: 0, // Start from 0
          downloads: 0 // Start from 0
        },
        version: "1.0.0"
      }

      setProjects((prev) => [enhancedProject, ...prev])
      setNewProjectTitle("")
      setNewProjectDescription("")
      setNewProjectStatus("DRAFT")
      setShowCreateDialog(false)
      toast.success("Project created successfully")

      // Navigate to the builder
      router.push(`/builder/${project.id}`)
    } catch (error) {
      toast.error("Failed to create project")
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteProject(projectId)
      setProjects((prev) => prev.filter((p) => p.id !== projectId))
      toast.success("Project deleted successfully")
      setProjectToDelete(null)
    } catch (error) {
      toast.error("Failed to delete project")
    }
  }

  const confirmDeleteProject = (project: Project) => {
    setProjectToDelete(project)
  }

  const handleEditProject = async (project: Project) => {
    // Track view when editing project
    trackProjectView(project.id)
    router.push(`/builder/${project.id}`)
  }

  const handleDuplicateProject = async (project: Project) => {
    setDuplicatingProject(project.id)
    try {
      const duplicatedProject = await createProject({
        title: `${project.title} (Copy)`,
        description: project.description,
      })
      
      // Duplicated project starts with fresh analytics
      const enhancedDuplicatedProject: Project = {
        ...duplicatedProject,
        status: "DRAFT",
        analytics: {
          views: 0, // Start from 0
          downloads: 0 // Start from 0
        },
        version: "1.0.0"
      }
      
      setProjects((prev) => [enhancedDuplicatedProject, ...prev])
      toast.success("Project duplicated successfully")
    } catch (error) {
      toast.error("Failed to duplicate project")
    } finally {
      setDuplicatingProject(null)
    }
  }

  const handleExportProject = async (project: Project, format: "html" | "css" | "json") => {
    setExportingProject(`${project.id}-${format}`)
    try {
      const { exportProject } = await import("@/lib/api/projects")
      const content = await exportProject(project.id, format)

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

      // Track the download
      trackProjectDownload(project.id, format)

      // Update project status to EXPORTED
      setProjects(prev => prev.map(p => 
        p.id === project.id 
          ? { ...p, status: "EXPORTED", exportedAt: new Date().toISOString() }
          : p
      ))

      toast.success(`Project exported as ${format.toUpperCase()}`)
    } catch (error) {
      toast.error(`Failed to export project as ${format.toUpperCase()}`)
    } finally {
      setExportingProject(null)
    }
  }

  const handleStatusChange = async (projectId: string, newStatus: keyof typeof PROJECT_STATUSES) => {
    console.log(`🔄 Updating project ${projectId} status to: ${newStatus}`)
    setUpdatingStatus(projectId)
    try {
      // Update the project status in the database
      const { updateProject } = await import("@/lib/api/projects")
      console.log(`📡 Sending API request to update project status...`)
      const result = await updateProject(projectId, { status: newStatus })
      console.log(`✅ API response:`, result)
      
      // Update local state with the new status and timestamps
      setProjects(prev => prev.map(p => {
        if (p.id === projectId) {
          const updatedProject = { ...p, status: newStatus }
          
          // Add timestamps based on status
          switch (newStatus) {
            case "PUBLISHED":
              updatedProject.publishedAt = new Date().toISOString()
              break
            case "ARCHIVED":
              updatedProject.archivedAt = new Date().toISOString()
              break
            case "EXPORTED":
              updatedProject.exportedAt = new Date().toISOString()
              break
          }
          
          console.log(`🔄 Updated local project:`, updatedProject)
          return updatedProject
        }
        return p
      }))
      
      toast.success(`Project status updated to ${PROJECT_STATUSES[newStatus].label}`)
    } catch (error) {
      console.error("❌ Error updating project status:", error)
      toast.error("Failed to update project status")
    } finally {
      setUpdatingStatus(null)
    }
  }

  const getFilteredProjects = () => {
    let filtered = projects.filter((project) => 
      project.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    
    if (statusFilter !== "ALL") {
      filtered = filtered.filter(project => project.status === statusFilter)
    }
    
    return filtered
  }

  const filteredProjects = getFilteredProjects()

  const stats = {
    totalProjects: projects.length,
    totalPages: projects.reduce((sum, project) => sum + project._count.pages, 0),
    publishedCount: projects.filter((p) => p.status === "PUBLISHED").length,
    draftCount: projects.filter((p) => p.status === "DRAFT").length,
    archivedCount: projects.filter((p) => p.status === "ARCHIVED").length,
    totalViews: projects.reduce((sum, p) => sum + (p.analytics?.views || 0), 0),
    totalDownloads: projects.reduce((sum, p) => sum + (p.analytics?.downloads || 0), 0),
  }

  const getStatusIcon = (status: keyof typeof PROJECT_STATUSES) => {
    const StatusIcon = PROJECT_STATUSES[status].icon
    return <StatusIcon className="w-4 h-4" />
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">CMS-Builder</span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={profileData?.image || session.user?.image} alt="Profile" />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-green-500 text-white text-sm">
                      {profileData?.name ? profileData.name.charAt(0).toUpperCase() : session.user?.name ? session.user.name.charAt(0).toUpperCase() : session.user?.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-gray-700">{session.user?.name || session.user?.email}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {session.user?.name || session.user?.email?.split('@')[0]}!
            </h1>
            <p className="text-gray-600 text-lg">Here's an overview of your projects</p>
          </div>
        </div>

        {/* Enhanced Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                Total Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{stats.totalProjects}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-700 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Total Pages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{stats.totalPages}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-700 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Total Views
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">{stats.totalViews}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-700 flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Downloads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">{stats.totalDownloads}</div>
            </CardContent>
          </Card>
        </div>

        {/* Status Distribution */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Status Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {Object.entries(PROJECT_STATUSES).map(([status, config]) => {
              const count = projects.filter(p => p.status === status).length
              const percentage = projects.length > 0 ? Math.round((count / projects.length) * 100) : 0
              
              return (
                <Card key={status} className={`${config.bgColor} border-2 ${count > 0 ? 'border-opacity-100' : 'border-opacity-30'}`}>
                  <CardContent className="p-3 text-center">
                    <div className="flex items-center justify-center mb-2">
                      {getStatusIcon(status as keyof typeof PROJECT_STATUSES)}
                    </div>
                    <div className="text-sm font-medium text-gray-900">{count}</div>
                    <div className="text-xs text-gray-500">{percentage}%</div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Projects</h2>
            <p className="text-gray-500">Manage and create your websites</p>
          </div>

          <div className="flex items-center space-x-2">
            {/* Refresh Button */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadProjects}
              disabled={isLoading}
              className="border-gray-200 text-gray-700"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>

            {/* View Toggle */}
            <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1 shadow-sm hover:shadow-md transition-all duration-200">
              <Button
                variant={viewMode === "cards" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("cards")}
                className={`h-9 px-4 rounded-lg transition-all duration-200 ${
                  viewMode === "cards" 
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700" 
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                <Grid className="w-4 h-4 mr-2" />
                Cards
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={`h-9 px-4 rounded-lg transition-all duration-200 ${
                  viewMode === "list" 
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700" 
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                <List className="w-4 h-4 mr-2" />
                List
              </Button>
            </div>

            {/* Create Project Button */}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Project
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                  <DialogDescription>Give your project a name, description, and initial status.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium mb-2">
                      Project Title
                    </label>
                    <Input
                      id="title"
                      value={newProjectTitle}
                      onChange={(e) => setNewProjectTitle(e.target.value)}
                      placeholder="My Awesome Website"
                    />
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium mb-2">
                      Description (Optional)
                    </label>
                    <Input
                      id="description"
                      value={newProjectDescription}
                      onChange={(e) => setNewProjectDescription(e.target.value)}
                      placeholder="A brief description of your project"
                    />
                  </div>
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium mb-2">
                      Initial Status
                    </label>
                    <select
                      id="status"
                      value={newProjectStatus}
                      onChange={(e) => setNewProjectStatus(e.target.value as keyof typeof PROJECT_STATUSES)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {Object.entries(PROJECT_STATUSES).map(([status, config]) => (
                        <option key={status} value={status}>
                          {config.label} - {config.description}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateProject} disabled={isCreating} className="bg-blue-600 hover:bg-blue-700 text-white">
                    {isCreating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Create Project
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Statuses</option>
            {Object.entries(PROJECT_STATUSES).map(([status, config]) => (
              <option key={status} value={status}>
                {config.label}
              </option>
            ))}
          </select>
        </div>

        {/* Projects Display */}
        {filteredProjects.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery || statusFilter !== "ALL" ? "No projects found" : "No projects yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || statusFilter !== "ALL" ? "Try adjusting your search terms or filters" : "Create your first project to get started"}
            </p>
            {!searchQuery && statusFilter === "ALL" && (
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Project
              </Button>
            )}
          </Card>
        ) : viewMode === "cards" ? (
          // Enhanced Card View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const statusConfig = PROJECT_STATUSES[project.status]
              const StatusIcon = statusConfig.icon
              
              return (
                <Card key={project.id} className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-blue-300">
                  <Link href={`/builder/${project.id}`} onClick={() => trackProjectView(project.id)}>
                    <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-lg overflow-hidden relative">
                      <div className="w-full h-full flex items-center justify-center">
                        <Globe className="w-12 h-12 text-gray-400" />
                      </div>
                      {/* Status Badge Overlay */}
                      <div className="absolute top-3 right-3">
                        <Badge className={`${statusConfig.color} border-2`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig.label}
                        </Badge>
                      </div>
                    </div>
                  </Link>

                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">{project.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <span className="text-sm">{project._count.pages} pages</span>
                          {project.version && (
                            <Badge variant="outline" className="text-xs">v{project.version}</Badge>
                          )}
                        </CardDescription>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuItem onClick={() => handleEditProject(project)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Project
                          </DropdownMenuItem>
                          
                          <DropdownMenuSeparator />
                          
                          {/* Status Management */}
                          <div className="px-2 py-1.5 text-xs font-medium text-gray-500">Change Status</div>
                          {Object.entries(PROJECT_STATUSES).map(([status, config]) => (
                            <DropdownMenuItem 
                              key={status}
                              onClick={() => handleStatusChange(project.id, status as keyof typeof PROJECT_STATUSES)}
                              disabled={updatingStatus === project.id || project.status === status}
                              className={project.status === status ? "bg-blue-50 text-blue-700" : ""}
                            >
                              {updatingStatus === project.id ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <config.icon className="w-4 h-4 mr-2" />
                              )}
                              {config.label}
                              {project.status === status && <CheckCircle className="w-4 h-4 ml-auto" />}
                            </DropdownMenuItem>
                          ))}
                          
                          <DropdownMenuSeparator />
                          
                          <DropdownMenuItem 
                            onClick={() => handleDuplicateProject(project)}
                            disabled={duplicatingProject === project.id}
                          >
                            {duplicatingProject === project.id ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Copy className="w-4 h-4 mr-2" />
                            )}
                            {duplicatingProject === project.id ? "Duplicating..." : "Duplicate"}
                          </DropdownMenuItem>
                          
                          <DropdownMenuSeparator />
                          
                          <div className="px-2 py-1.5 text-xs font-medium text-gray-500">Export</div>
                          <DropdownMenuItem 
                            onClick={() => handleExportProject(project, "html")}
                            disabled={exportingProject === `${project.id}-html`}
                          >
                            {exportingProject === `${project.id}-html` ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Download className="w-4 h-4 mr-2" />
                            )}
                            {exportingProject === `${project.id}-html` ? "Exporting..." : "Export HTML"}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleExportProject(project, "css")}
                            disabled={exportingProject === `${project.id}-css`}
                          >
                            {exportingProject === `${project.id}-css` ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Download className="w-4 h-4 mr-2" />
                            )}
                            {exportingProject === `${project.id}-css` ? "Exporting..." : "Export CSS"}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleExportProject(project, "json")}
                            disabled={exportingProject === `${project.id}-json`}
                          >
                            {exportingProject === `${project.id}-json` ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Download className="w-4 h-4 mr-2" />
                            )}
                            {exportingProject === `${project.id}-json` ? "Exporting..." : "Export JSON"}
                          </DropdownMenuItem>
                          
                          <DropdownMenuSeparator />
                          
                          <DropdownMenuItem className="text-red-600" onClick={() => confirmDeleteProject(project)}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Project
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        Updated {new Date(project.updatedAt).toLocaleDateString()}
                      </div>
                      
                      {/* Analytics Display */}
                      {project.analytics && (
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {project.analytics.views} views
                          </span>
                          <span className="flex items-center">
                            <Download className="w-3 h-3 mr-1" />
                            {project.analytics.downloads} downloads
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          // Enhanced List View
          <div className="space-y-3">
            {filteredProjects.map((project) => {
              const statusConfig = PROJECT_STATUSES[project.status]
              const StatusIcon = statusConfig.icon
              
              return (
                <Card key={project.id} className="group hover:shadow-md transition-shadow border-2 hover:border-blue-300">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1 min-w-0">
                        {/* Project Icon with Status */}
                        <div className={`w-12 h-12 ${statusConfig.bgColor} rounded-lg flex items-center justify-center flex-shrink-0 border-2 ${statusConfig.color}`}>
                          <Globe className="w-6 h-6 text-gray-400" />
                        </div>
                        
                        {/* Project Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">{project.title}</h3>
                            <Badge className={`${statusConfig.color} border-2`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {statusConfig.label}
                            </Badge>
                            {project.version && (
                              <Badge variant="outline" className="text-xs">v{project.version}</Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <FileText className="w-4 h-4 mr-1" />
                              {project._count.pages} pages
                            </span>
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              Updated {new Date(project.updatedAt).toLocaleDateString()}
                            </span>
                            {project.analytics && (
                              <>
                                <span className="flex items-center">
                                  <Eye className="w-3 h-3 mr-1" />
                                  {project.analytics.views} views
                                </span>
                                <span className="flex items-center">
                                  <Download className="w-3 h-3 mr-1" />
                                  {project.analytics.downloads} downloads
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 ml-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditProject(project)}
                          className="hidden sm:flex"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuItem onClick={() => handleEditProject(project)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Project
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator />
                            
                            {/* Status Management */}
                            <div className="px-2 py-1.5 text-xs font-medium text-gray-500">Change Status</div>
                            {Object.entries(PROJECT_STATUSES).map(([status, config]) => (
                              <DropdownMenuItem 
                                key={status}
                                onClick={() => handleStatusChange(project.id, status as keyof typeof PROJECT_STATUSES)}
                                disabled={updatingStatus === project.id || project.status === status}
                                className={project.status === status ? "bg-blue-50 text-blue-700" : ""}
                              >
                                {updatingStatus === project.id ? (
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                  <config.icon className="w-4 h-4 mr-2" />
                                )}
                                {config.label}
                                {project.status === status && <CheckCircle className="w-4 h-4 ml-auto" />}
                              </DropdownMenuItem>
                            ))}
                            
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuItem 
                              onClick={() => handleDuplicateProject(project)}
                              disabled={duplicatingProject === project.id}
                            >
                              {duplicatingProject === project.id ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <Copy className="w-4 h-4 mr-2" />
                              )}
                              {duplicatingProject === project.id ? "Duplicating..." : "Duplicate"}
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator />
                            
                            <div className="px-2 py-1.5 text-xs font-medium text-gray-500">Export</div>
                            <DropdownMenuItem 
                              onClick={() => handleExportProject(project, "html")}
                              disabled={exportingProject === `${project.id}-html`}
                            >
                              {exportingProject === `${project.id}-html` ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <Download className="w-4 h-4 mr-2" />
                              )}
                              {exportingProject === `${project.id}-html` ? "Exporting..." : "Export HTML"}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleExportProject(project, "css")}
                              disabled={exportingProject === `${project.id}-css`}
                            >
                              {exportingProject === `${project.id}-css` ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <Download className="w-4 h-4 mr-2" />
                              )}
                              {exportingProject === `${project.id}-css` ? "Exporting..." : "Export CSS"}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleExportProject(project, "json")}
                              disabled={exportingProject === `${project.id}-json`}
                            >
                              {exportingProject === `${project.id}-json` ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <Download className="w-4 h-4 mr-2" />
                              )}
                              {exportingProject === `${project.id}-json` ? "Exporting..." : "Export JSON"}
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuItem className="text-red-600" onClick={() => confirmDeleteProject(project)}>
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Project
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {projectToDelete && (
        <Dialog open={!!projectToDelete} onOpenChange={() => setProjectToDelete(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the project "{projectToDelete.title}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setProjectToDelete(null)}>Cancel</Button>
              <Button variant="destructive" onClick={() => handleDeleteProject(projectToDelete.id)}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}