const Playlist = require("../models/Playlist")

const generatePlaylist = async (req, res) => {
  try {
    const { name, mood, activity, genres, description } = req.body
    const userId = req.user._id

   
    const demoTracks = generateDemoTracks(mood, activity, genres)

    const playlist = new Playlist({
      name,
      description: description || `A ${mood} playlist for ${activity}`,
      user: userId,
      mood,
      activity,
      genres,
      tracks: demoTracks,
      aiGenerated: true,
    })

    await playlist.save()

    res.status(201).json({
      message: "Playlist generated successfully",
      playlist,
    })
  } catch (error) {
    console.error("Generate playlist error:", error)
    res.status(500).json({
      message: "Failed to generate playlist",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
    })
  }
}

// Helper function to generate demo tracks
const generateDemoTracks = (mood, activity, genres) => {
  const demoTracksPool = {
    happy: [
      {
        id: "1",
        name: "Happy Song",
        artist: "Demo Artist 1",
        album: "Demo Album",
        duration: 210,
        imageUrl: "/placeholder.svg?height=300&width=300",
      },
      {
        id: "2",
        name: "Sunshine Vibes",
        artist: "Demo Artist 2",
        album: "Demo Album",
        duration: 195,
        imageUrl: "/placeholder.svg?height=300&width=300",
      },
    ],
    energetic: [
      {
        id: "3",
        name: "Energy Boost",
        artist: "Demo Artist 3",
        album: "Demo Album",
        duration: 180,
        imageUrl: "/placeholder.svg?height=300&width=300",
      },
      {
        id: "4",
        name: "Power Up",
        artist: "Demo Artist 4",
        album: "Demo Album",
        duration: 220,
        imageUrl: "/placeholder.svg?height=300&width=300",
      },
    ],
    calm: [
      {
        id: "5",
        name: "Peaceful Mind",
        artist: "Demo Artist 5",
        album: "Demo Album",
        duration: 240,
        imageUrl: "/placeholder.svg?height=300&width=300",
      },
      {
        id: "6",
        name: "Serenity",
        artist: "Demo Artist 6",
        album: "Demo Album",
        duration: 200,
        imageUrl: "/placeholder.svg?height=300&width=300",
      },
    ],
  }

  // Return demo tracks based on mood (simplified logic)
  const tracks = demoTracksPool[mood] || demoTracksPool.happy
  return tracks.slice(0, 10) // Return first 10 tracks
}

// Get user playlists
const getUserPlaylists = async (req, res) => {
  try {
    const userId = req.user._id
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const playlists = await Playlist.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username")

    const total = await Playlist.countDocuments({ user: userId })

    res.json({
      playlists,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    })
  } catch (error) {
    console.error("Get user playlists error:", error)
    res.status(500).json({ message: "Failed to fetch playlists" })
  }
}

// Get playlist by ID
const getPlaylistById = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user._id

    const playlist = await Playlist.findOne({
      _id: id,
      $or: [{ user: userId }, { isPublic: true }],
    }).populate("user", "username")

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" })
    }

    res.json({ playlist })
  } catch (error) {
    console.error("Get playlist error:", error)
    res.status(500).json({ message: "Failed to fetch playlist" })
  }
}

// Update playlist
const updatePlaylist = async (req, res) => {
  try {
    const { id } = req.params
    const { name, description, isPublic } = req.body
    const userId = req.user._id

    const playlist = await Playlist.findOne({ _id: id, user: userId })
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" })
    }

    // Update fields
    if (name) playlist.name = name
    if (description !== undefined) playlist.description = description
    if (isPublic !== undefined) playlist.isPublic = isPublic

    await playlist.save()

    res.json({
      message: "Playlist updated successfully",
      playlist,
    })
  } catch (error) {
    console.error("Update playlist error:", error)
    res.status(500).json({ message: "Failed to update playlist" })
  }
}

// Delete playlist
const deletePlaylist = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user._id

    const playlist = await Playlist.findOneAndDelete({ _id: id, user: userId })
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" })
    }

  

    res.json({ message: "Playlist deleted successfully" })
  } catch (error) {
    console.error("Delete playlist error:", error)
    res.status(500).json({ message: "Failed to delete playlist" })
  }
}

module.exports = {
  generatePlaylist,
  getUserPlaylists,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
}
