const jwt = require("jsonwebtoken")
const User = require("../models/User")

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header("Authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({
        message: "No token provided, authorization denied",
        code: "NO_TOKEN",
      })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Find user in database
    const user = await User.findById(decoded.userId).select("-password")

    if (!user) {
      return res.status(401).json({
        message: "Token is not valid - user not found",
        code: "USER_NOT_FOUND",
      })
    }

    if (!user.isActive) {
      return res.status(401).json({
        message: "Account is deactivated",
        code: "ACCOUNT_DEACTIVATED",
      })
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(401).json({
        message: "Account is temporarily locked due to too many failed login attempts",
        code: "ACCOUNT_LOCKED",
      })
    }

    // Add user to request object
    req.user = user
    next()
  } catch (error) {
    console.error("Auth middleware error:", error)

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid token",
        code: "INVALID_TOKEN",
      })
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token has expired",
        code: "TOKEN_EXPIRED",
      })
    }

    res.status(401).json({
      message: "Token verification failed",
      code: "TOKEN_VERIFICATION_FAILED",
    })
  }
}

// Optional middleware for routes that work with or without authentication
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findById(decoded.userId).select("-password")

      if (user && user.isActive && !user.isLocked) {
        req.user = user
      }
    }

    next()
  } catch (error) {
    // Continue without authentication for optional auth
    next()
  }
}

// Export as an object with named exports
module.exports = { auth, optionalAuth }
