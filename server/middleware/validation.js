const User = require("../models/User")

const validateRegistration = async (req, res, next) => {
  const { username, password } = req.body
  const errors = []

  // Username validation: Allow any nonempty string.
  if (!username || typeof username !== "string") {
    errors.push("Username is required and must be a string")
  } else {
    const trimmedUsername = username.trim()
    if (trimmedUsername === "") {
      errors.push("Username cannot be empty")
    }
    // Check if username already exists in database
    try {
      const existingUser = await User.findByUsername(trimmedUsername)
      if (existingUser) {
        errors.push("Username is already taken")
      }
    } catch (error) {
      console.error("Database error during username validation:", error)
      errors.push("Unable to validate username availability")
    }
  }

  // Password validation: Only require minimum length of 8 characters.
  if (!password || typeof password !== "string") {
    errors.push("Password is required and must be a string")
  } else {
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long")
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: "Validation failed",
      errors,
      code: "VALIDATION_ERROR",
    })
  }

  next()
}

const validateLogin = async (req, res, next) => {
  const { username, password } = req.body
  const errors = []

  if (!username || typeof username !== "string" || !username.trim()) {
    errors.push("Username is required")
  }
  if (!password || typeof password !== "string") {
    errors.push("Password is required")
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: "Validation failed",
      errors,
      code: "VALIDATION_ERROR",
    })
  }

  // Check if user exists and is not locked
  try {
    const user = await User.findByUsername(username.trim())
    if (user && user.isLocked) {
      return res.status(423).json({
        message: "Account temporarily locked",
        code: "ACCOUNT_LOCKED",
      })
    }
  } catch (error) {
    console.error("Database error during login validation:", error)
  }

  next()
}

const validatePlaylistCreation = (req, res, next) => {
  const { name, mood, activity, genres, description } = req.body
  const errors = []

  // Playlist name validation
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    errors.push("Playlist name is required")
  } else if (name.length > 100) {
    errors.push("Playlist name cannot exceed 100 characters")
  }

  // Description validation (optional)
  if (description && typeof description === "string" && description.length > 500) {
    errors.push("Description cannot exceed 500 characters")
  }

  // Mood validation
  const validMoods = ["happy", "sad", "energetic", "calm", "focused", "romantic"]
  if (!mood || !validMoods.includes(mood)) {
    errors.push(`Valid mood is required. Must be one of: ${validMoods.join(", ")}`)
  }

  // Activity validation
  const validActivities = ["working-out", "studying", "relaxing", "commuting", "party", "sleep"]
  if (!activity || !validActivities.includes(activity)) {
    errors.push(`Valid activity is required. Must be one of: ${validActivities.join(", ")}`)
  }

  // Genres validation
  const validGenres = [
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

  if (!genres || !Array.isArray(genres) || genres.length === 0) {
    errors.push("At least one genre must be selected")
  } else {
    const invalidGenres = genres.filter((genre) => !validGenres.includes(genre))
    if (invalidGenres.length > 0) {
      errors.push(`Invalid genres: ${invalidGenres.join(", ")}. Valid genres are: ${validGenres.join(", ")}`)
    }
    if (genres.length > 5) {
      errors.push("Maximum 5 genres can be selected")
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: "Validation failed",
      errors,
      code: "VALIDATION_ERROR",
    })
  }

  next()
}

const validatePreferencesUpdate = (req, res, next) => {
  const { favoriteGenres, defaultMood, defaultActivity } = req.body
  const errors = []

  // Validate favorite genres if provided
  if (favoriteGenres !== undefined) {
    if (!Array.isArray(favoriteGenres)) {
      errors.push("Favorite genres must be an array")
    } else {
      const validGenres = [
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
      const invalidGenres = favoriteGenres.filter((genre) => !validGenres.includes(genre))
      if (invalidGenres.length > 0) {
        errors.push(`Invalid genres: ${invalidGenres.join(", ")}`)
      }
      if (favoriteGenres.length > 10) {
        errors.push("Maximum 10 favorite genres allowed")
      }
    }
  }

  // Validate default mood if provided
  if (defaultMood !== undefined) {
    const validMoods = ["happy", "sad", "energetic", "calm", "focused", "romantic"]
    if (!validMoods.includes(defaultMood)) {
      errors.push(`Invalid mood. Must be one of: ${validMoods.join(", ")}`)
    }
  }

  // Validate default activity if provided
  if (defaultActivity !== undefined) {
    const validActivities = ["working-out", "studying", "relaxing", "commuting", "party", "sleep"]
    if (!validActivities.includes(defaultActivity)) {
      errors.push(`Invalid activity. Must be one of: ${validActivities.join(", ")}`)
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: "Validation failed",
      errors,
      code: "VALIDATION_ERROR",
    })
  }

  next()
}

module.exports = {
  validateRegistration,
  validateLogin,
  validatePlaylistCreation,
  validatePreferencesUpdate,
}
