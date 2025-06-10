const express = require("express")
const { validateRegistration, validateLogin } = require("../middleware/validation")
const {
  register,
  login,
  getCurrentUser,
  updatePreferences,
  logout,
  deactivateAccount,
} = require("../controllers/authController")
const { auth } = require("../middleware/auth")

const router = express.Router()

// Public routes
router.post("/register", validateRegistration, register)
router.post("/login", validateLogin, login)

// Protected routes (require authentication)
router.get("/me", auth, getCurrentUser)
router.put("/preferences", auth, updatePreferences)
router.post("/logout", auth, logout)
router.delete("/deactivate", auth, deactivateAccount)

// Health check for auth service
router.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "Authentication Service",
    timestamp: new Date().toISOString(),
  })
})

module.exports = router
