const mongoose = require("mongoose")

const playlistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Playlist name is required"],
      trim: true,
      maxlength: [100, "Playlist name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mood: {
      type: String,
      required: true,
      enum: ["happy", "sad", "energetic", "calm", "focused", "romantic"],
    },
    activity: {
      type: String,
      required: true,
      enum: ["working-out", "studying", "relaxing", "commuting", "party", "sleep"],
    },
    genres: [
      {
        type: String,
        enum: ["pop", "rock", "hip-hop", "jazz", "classical", "electronic", "country", "r&b", "indie", "alternative"],
      },
    ],
    

    // Placeholder tracks for demo
    tracks: [
      {
        id: String,
        name: String,
        artist: String,
        album: String,
        duration: Number, // in seconds
        imageUrl: String,
      },
    ],
    isPublic: {
      type: Boolean,
      default: false,
    },
    aiGenerated: {
      type: Boolean,
      default: true,
    },
  
  },
  {
    timestamps: true,
  },
)

// Index for better query performance
playlistSchema.index({ user: 1, createdAt: -1 })
playlistSchema.index({ mood: 1, activity: 1 })

module.exports = mongoose.model("Playlist", playlistSchema)
