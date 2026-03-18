const API_BASE = "http://localhost:4040/api"

export const fetchTitles = async () => {
  try {
    const response = await fetch(`${API_BASE}/titles`)

    if (!response.ok) {
      throw new Error(`Failed to fetch titles: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Failed to fetch all titles:", error)
    return []
  }
}

export const fetchTitleByUPC = async (upc: string) => {
  try {
    const response = await fetch(`${API_BASE}/titles/${upc}`)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || `Failed to fetch title: ${response.status}`)
    }

    return data
  } catch (error) {
    console.error("Failed to fetch title:", error)
    return null
  }
}

export const deleteTitle = async (upc: string) => {
  try {
    const response = await fetch(`${API_BASE}/titles/${upc}`, {
      method: "DELETE"
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || `Failed to delete title: ${response.status}`)
    }

    return data
  } catch (error) {
    console.error("Failed to delete title:", error)
    return null
  }
}

export const updateTitle = async (upc: string, updates: Record<string, unknown>) => {
  try {
    const response = await fetch(`${API_BASE}/titles/${upc}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updates)
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || `Failed to update title: ${response.status}`)
    }

    return data
  } catch (error) {
    console.error("Failed to update title:", error)
    return null
  }
}