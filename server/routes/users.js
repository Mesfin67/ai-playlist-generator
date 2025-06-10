const express = require("express")
const { auth } = require("../middleware/auth")
const User = require("../models/User")

const router = express.Router()

// Get user profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password")
    if (!user) {
      return res.status(404).json({ message: "User not found" })
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
    console.error("Get user profile error:", error)
    res.status(500).json({ message: "Failed to fetch user profile" })
  }
})

// Update user profile
router.put("/profile", auth, async (req, res) => {
  try {
    const { preferences } = req.body
    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    if (preferences) {
      // Validate preferences before updating
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

      if (preferences.favoriteGenres) {
        const invalidGenres = preferences.favoriteGenres.filter((genre) => !validGenres.includes(genre))
        if (invalidGenres.length > 0) {
          return res.status(400).json({
            message: "Invalid genres provided",
            invalidGenres,
          })
        }
        user.preferences.favoriteGenres = preferences.favoriteGenres
      }

      if (preferences.defaultMood && !validMoods.includes(preferences.defaultMood)) {
        return res.status(400).json({ message: "Invalid mood provided" })
      }

      if (preferences.defaultActivity && !validActivities.includes(preferences.defaultActivity)) {
        return res.status(400).json({ message: "Invalid activity provided" })
      }

      user.preferences = { ...user.preferences, ...preferences }
    }

    await user.save()

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        username: user.username,
        preferences: user.preferences,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      },
    })
  } catch (error) {
    console.error("Update user profile error:", error)
    res.status(500).json({ message: "Failed to update profile" })
  }
})

// Get user statistics
router.get("/stats", auth, async (req, res) => {
  try {
    const userId = req.user._id

    

    res.json({
      user: {
        id: userId,
        username: req.user.username,
        joinDate: req.user.createdAt,
        lastLogin: req.user.lastLogin,
        // playlistCount: playlistCount || 0
      },
    })
  } catch (error) {
    console.error("Get user stats error:", error)
    res.status(500).json({ message: "Failed to fetch user statistics" })
  }
})

module.exports = router
