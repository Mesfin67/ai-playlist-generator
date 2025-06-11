import api from "./api"

export const register = async (userData) => {
  try {
    const response = await api.post("/api/auth/register", userData)

    // Store token in localStorage for session management
    if (response.token) {
      localStorage.setItem("token", response.token)
    }

    return response
  } catch (error) {
    throw error
  }
}

export const login = async (credentials) => {
  try {
    const response = await api.post("/api/auth/login", credentials)

    // Store token in localStorage for session management
    if (response.token) {
      localStorage.setItem("token", response.token)
    }

    return response
  } catch (error) {
    throw error
  }
}

export const getCurrentUser = async () => {
  try {
    // This will fetch user data from database via the /auth/me endpoint
    const response = await api.get("/api/auth/me")
    return response
  } catch (error) {
    // If token is invalid, remove it from localStorage
    if (error.message.includes("Token") || error.message.includes("authorization")) {
      localStorage.removeItem("token")
    }
    throw error
  }
}

export const updatePreferences = async (preferences) => {
  try {
    const response = await api.put("/api/auth/preferences", preferences)
    return response
  } catch (error) {
    throw error
  }
}

export const logout = async () => {
  try {
    // Call logout endpoint (optional - for future token blacklisting)
    await api.post("/api/auth/logout")
  } catch (error) {
    // Even if logout endpoint fails, we should still clear local storage
    console.warn("Logout endpoint failed:", error.message)
  } finally {
    // Always remove token from localStorage
    localStorage.removeItem("token")
  }
}

export const deactivateAccount = async () => {
  try {
    const response = await api.delete("/api/auth/deactivate")
    // Remove token after account deactivation
    localStorage.removeItem("token")
    return response
  } catch (error) {
    throw error
  }
}

// Check if user is authenticated (has valid token)
export const isAuthenticated = () => {
  const token = localStorage.getItem("token")
  return !!token
}

// Get token from localStorage
export const getToken = () => {
  return localStorage.getItem("token")
}

// Clear authentication data
export const clearAuth = () => {
  localStorage.removeItem("token")
}
