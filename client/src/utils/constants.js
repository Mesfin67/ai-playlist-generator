export const MOODS = [
  { value: "happy", label: "Happy", icon: "😊", color: "#FFD700" },
  { value: "sad", label: "Sad", icon: "😢", color: "#4682B4" },
  { value: "energetic", label: "Energetic", icon: "⚡", color: "#FF6347" },
  { value: "calm", label: "Calm", icon: "😌", color: "#98FB98" },
  { value: "focused", label: "Focused", icon: "🎯", color: "#DDA0DD" },
  { value: "romantic", label: "Romantic", icon: "💕", color: "#FFB6C1" },
]

export const ACTIVITIES = [
  { value: "working-out", label: "Working Out", icon: "💪", color: "#FF4500" },
  { value: "studying", label: "Studying", icon: "📚", color: "#4169E1" },
  { value: "relaxing", label: "Relaxing", icon: "🛋️", color: "#32CD32" },
  { value: "commuting", label: "Commuting", icon: "🚗", color: "#FFD700" },
  { value: "party", label: "Party", icon: "🎉", color: "#FF1493" },
  { value: "sleep", label: "Sleep", icon: "😴", color: "#9370DB" },
]

export const GENRES = [
  "pop",
  "rock",
  "hip-hop",
  "jazz",
  "classical",
  "electronic",
  "country",
  "r&b",
  "indie",
  "alternative",
]

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    ME: "/auth/me",
    PREFERENCES: "/auth/preferences",
  },
  PLAYLISTS: {
    GENERATE: "/playlists/generate",
    LIST: "/playlists",
    DETAIL: "/playlists/:id",
    UPDATE: "/playlists/:id",
    DELETE: "/playlists/:id",
  },
  USERS: {
    PROFILE: "/users/profile",
  },
}

export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
  PREFERENCES: "preferences",
}

export const VALIDATION_RULES = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 30,
    PATTERN: /^[a-zA-Z0-9_]+$/,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
  },
  PLAYLIST_NAME: {
    MAX_LENGTH: 100,
  },
  DESCRIPTION: {
    MAX_LENGTH: 500,
  },
}
