"use client"

import { useEffect, useRef } from "react"
import { useBuilderStore } from "@/lib/store/builder-store"

export function useAutosave(projectId: string, pageId: string) {
  const { elements } = useBuilderStore()
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout for autosave
    timeoutRef.current = setTimeout(async () => {
      try {
        await fetch("/api/autosave", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectId,
            pageId,
            components: elements,
          }),
        })
      } catch (error) {
        console.error("Autosave failed:", error)
      }
    }, 5000) // Autosave after 5 seconds of inactivity

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [elements, projectId, pageId])
}
