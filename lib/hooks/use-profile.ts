import { useState, useCallback } from "react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

interface UserProfile {
  id: string
  name: string | null
  email: string
  image: string | null
  createdAt: string
  updatedAt: string
}

interface UpdateProfileData {
  name?: string
  email?: string
  currentPassword?: string
  newPassword?: string
}

export function useProfile() {
  const { data: session, update } = useSession()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const loadProfile = useCallback(async () => {
    if (!session?.user?.id) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/user/profile")
      if (response.ok) {
        const data = await response.json()
        setProfile(data.user)
        return data.user
      } else {
        toast.error("Failed to load profile")
        return null
      }
    } catch (error) {
      toast.error("Failed to load profile")
      return null
    } finally {
      setIsLoading(false)
    }
  }, [session])

  const updateProfile = useCallback(async (updateData: UpdateProfileData) => {
    if (!session?.user?.id) return false

    setIsSaving(true)
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(data.user)
        toast.success("Profile updated successfully")
        
        // Update session
        await update()
        return true
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to update profile")
        return false
      }
    } catch (error) {
      toast.error("An error occurred")
      return false
    } finally {
      setIsSaving(false)
    }
  }, [session, update])

  const uploadAvatar = useCallback(async (file: File) => {
    if (!session?.user?.id) return false

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('avatar', file)

      const response = await fetch("/api/user/upload-avatar", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(data.user)
        toast.success("Profile picture updated successfully")
        
        // Update session
        await update()
        return true
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to upload avatar")
        return false
      }
    } catch (error) {
      toast.error("An error occurred")
      return false
    } finally {
      setIsUploading(false)
    }
  }, [session, update])

  return {
    profile,
    isLoading,
    isSaving,
    isUploading,
    loadProfile,
    updateProfile,
    uploadAvatar,
  }
}
