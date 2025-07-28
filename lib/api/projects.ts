export async function fetchProjects() {
  const response = await fetch("/api/projects")
  if (!response.ok) {
    throw new Error("Failed to fetch projects")
  }
  return response.json()
}

export async function createProject(data: { title: string; description?: string }) {
  const response = await fetch("/api/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to create project")
  }

  return response.json()
}

export async function updateProject(id: string, data: any) {
  const response = await fetch(`/api/projects/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to update project")
  }

  return response.json()
}

export async function deleteProject(id: string) {
  const response = await fetch(`/api/projects/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error("Failed to delete project")
  }

  return response.json()
}

export async function fetchProject(id: string) {
  const response = await fetch(`/api/projects/${id}`)
  if (!response.ok) {
    throw new Error("Failed to fetch project")
  }
  return response.json()
}

export async function exportProject(id: string, format: "html" | "css" | "json") {
  const response = await fetch(`/api/export/${id}?format=${format}`)
  if (!response.ok) {
    throw new Error("Failed to export project")
  }

  if (format === "json") {
    return response.json()
  }

  return response.text()
}
