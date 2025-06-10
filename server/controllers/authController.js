const jwt = require("jsonwebtoken")
const User = require("../models/User")

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  })
}

// Register user
const register = async (req, res) => {
  try {
    const { username, password } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ username: username.toLowerCase() })
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" })
    }

    // Create new user - password will be hashed by the pre-save middleware
    const user = new User({
      username: username.toLowerCase(),
      password,
    })

    // Save user to database
    await user.save()

    // Generate token
    const token = generateToken(user._id)

    // Return success response with token and user data
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        preferences: user.preferences,
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ message: "Username already exists" })
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({
        message: "Validation failed",
        errors: validationErrors,
      })
    }

    res.status(500).json({
      message: "Registration failed",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
    })
  }
}

// Login user
const login = async (req, res) => {
  try {
    const { username, password } = req.body

    // Find user in database
    const user = await User.findOne({ username: username.toLowerCase() }).select("+password")
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" })
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({ message: "Account is deactivated. Please contact support." })
    }

    // Verify password using the comparePassword method
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password" })
    }

    // Update last login timestamp
    user.lastLogin = new Date()
    await user.save()

    // Generate token
    const token = generateToken(user._id)

    // Return success response with token and user data (password excluded)
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        preferences: user.preferences,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({
      message: "Login failed",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
    })
  }
}

// Get current user from database
const getCurrentUser = async (req, res) => {
  try {
    // req.user is set by the auth middleware
    const user = await User.findById(req.user._id).select("-password")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    if (!user.isActive) {
      return res.status(401).json({ message: "Account is deactivated" })
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        preferences: user.preferences,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      },
    })
  } catch (error) {
    console.error("Get current user error:", error)
    res.status(500).json({ message: "Failed to get user data" })
  }
}

// Update user preferences in database
const updatePreferences = async (req, res) => {
  try {
    const { favoriteGenres, defaultMood, defaultActivity } = req.body

    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Validate preference values
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
    const validMoods = ["happy", "sad", "energetic", "calm", "focused", "romantic"]
    const validActivities = ["working-out", "studying", "relaxing", "commuting", "party", "sleep"]

    // Update preferences with validation
    if (favoriteGenres) {
      const invalidGenres = favoriteGenres.filter((genre) => !validGenres.includes(genre))
      if (invalidGenres.length > 0) {
        return res.status(400).json({
          message: "Invalid genres provided",
          invalidGenres,
        })
      }
      user.preferences.favoriteGenres = favoriteGenres
    }

    if (defaultMood) {
      if (!validMoods.includes(defaultMood)) {
        return res.status(400).json({ message: "Invalid mood provided" })
      }
      user.preferences.defaultMood = defaultMood
    }

    if (defaultActivity) {
      if (!validActivities.includes(defaultActivity)) {
        return res.status(400).json({ message: "Invalid activity provided" })
      }
      user.preferences.defaultActivity = defaultActivity
    }

    // Save updated preferences to database
    await user.save()

    res.json({
      message: "Preferences updated successfully",
      user: {
        id: user._id,
        username: user.username,
        preferences: user.preferences,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      },
    })
  } catch (error) {
    console.error("Update preferences error:", error)
    res.status(500).json({ message: "Failed to update preferences" })
  }
}

// Logout user (optional - for token blacklisting in future)
const logout = async (req, res) => {
  try {
    
    res.json({ message: "Logout successful" })
  } catch (error) {
    console.error("Logout error:", error)
    res.status(500).json({ message: "Logout failed" })
  }
}

// Deactivate user account
const deactivateAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    user.isActive = false
    await user.save()

    res.json({ message: "Account deactivated successfully" })
  } catch (error) {
    console.error("Deactivate account error:", error)
    res.status(500).json({ message: "Failed to deactivate account" })
  }
}

module.exports = {
  register,
  login,
  getCurrentUser,
  updatePreferences,
  logout,
  deactivateAccount,
}
