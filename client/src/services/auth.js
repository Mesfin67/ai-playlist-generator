import api from "./api";

export const register = async (userData) => {
  try {
    // Using endpoint relative to API_BASE_URL: /auth/register
    const response = await api.post("/auth/register", userData);

    // Store token in localStorage for session management (if returned)
    if (response.token) {
      localStorage.setItem("token", response.token);
    }

    return response;
  } catch (error) {
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    // Using endpoint: /auth/login
    const response = await api.post("/auth/login", credentials);

    // Store token in localStorage for session management (if returned)
    if (response.token) {
      localStorage.setItem("token", response.token);
    }

    return response;
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get("/auth/me");
    return response;
  } catch (error) {
    // If token is invalid, remove it from localStorage
    if (error.message.includes("Token") || error.message.includes("authorization")) {
      localStorage.removeItem("token");
    }
    throw error;
  }
};

export const updatePreferences = async (preferences) => {
  try {
    const response = await api.put("/auth/preferences", preferences);
    return response;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    await api.post("/auth/logout");
  } catch (error) {
    console.warn("Logout endpoint failed:", error.message);
  } finally {
    localStorage.removeItem("token");
  }
};

export const deactivateAccount = async () => {
  try {
    const response = await api.delete("/auth/deactivate");
    localStorage.removeItem("token");
    return response;
  } catch (error) {
    throw error;
  }
};

// Check if user is authenticated (has valid token)
export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

// Get token from localStorage
export const getToken = () => {
  return localStorage.getItem("token");
};

// Clear authentication data
export const clearAuth = () => {
  localStorage.removeItem("token");
};
