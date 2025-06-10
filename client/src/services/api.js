import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://ai-playlist-generator-28kz.onrender.com/api"

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }

    const message = error.response?.data?.message || error.message || "An error occurred"
    return Promise.reject(new Error(message))
  },
)

// Playlist API calls
export const generatePlaylist = async (playlistData) => {
  return await api.post("/playlists/generate", playlistData)
}

export const getUserPlaylists = async (page = 1, limit = 10) => {
  return await api.get(`/playlists?page=${page}&limit=${limit}`)
}

export const getPlaylistById = async (id) => {
  return await api.get(`/playlists/${id}`)
}

export const updatePlaylist = async (id, updateData) => {
  return await api.put(`/playlists/${id}`, updateData)
}

export const deletePlaylist = async (id) => {
  return await api.delete(`/playlists/${id}`)
}

// User API calls
export const getUserProfile = async () => {
  return await api.get("/users/profile")
}

export const updateUserProfile = async (profileData) => {
  return await api.put("/users/profile", profileData)
}

export default api
