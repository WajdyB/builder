export async function createPage(data: { name: string; projectId: string }) {
  const response = await fetch("/api/pages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to create page")
  }

  return response.json()
}

export async function updatePage(id: string, data: { name: string }) {
  const response = await fetch(`/api/pages/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to update page")
  }

  return response.json()
}

export async function deletePage(id: string) {
  const response = await fetch(`/api/pages/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error("Failed to delete page")
  }

  return response.json()
}
