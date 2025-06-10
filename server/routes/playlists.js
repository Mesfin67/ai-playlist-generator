const express = require("express")
const { validatePlaylistCreation } = require("../middleware/validation")
const {
  generatePlaylist,
  getUserPlaylists,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
} = require("../controllers/playlistController")
const { auth } = require("../middleware/auth")

const router = express.Router()

// All playlist routes require authentication
router.use(auth)

// Generate new playlist
router.post("/generate", validatePlaylistCreation, generatePlaylist)

// Get user's playlists
router.get("/", getUserPlaylists)

// Get specific playlist by ID
router.get("/:id", getPlaylistById)

// Update playlist
router.put("/:id", updatePlaylist)

// Delete playlist
router.delete("/:id", deletePlaylist)

module.exports = router
