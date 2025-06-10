"use client"

import { useState, useRef, useEffect } from "react"
import { Card, Button, ProgressBar, ListGroup } from "react-bootstrap"

const MusicPlayer = ({ playlist, onClose }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef(null)

  const currentTrack = playlist.tracks[currentTrackIndex]

  
  useEffect(() => {
    let interval
    if (isPlaying && currentTrack) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const newTime = prev + 1
          if (newTime >= currentTrack.duration) {
            handleNext()
            return 0
          }
          return newTime
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, currentTrack])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
   
  }

  const handleNext = () => {
    const nextIndex = (currentTrackIndex + 1) % playlist.tracks.length
    setCurrentTrackIndex(nextIndex)
    setCurrentTime(0)
  }

  const handlePrevious = () => {
    const prevIndex = currentTrackIndex === 0 ? playlist.tracks.length - 1 : currentTrackIndex - 1
    setCurrentTrackIndex(prevIndex)
    setCurrentTime(0)
  }

  const handleTrackSelect = (index) => {
    setCurrentTrackIndex(index)
    setCurrentTime(0)
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const progressPercentage = currentTrack ? (currentTime / currentTrack.duration) * 100 : 0

  return (
    <Card className="music-player sticky-top text-white">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Now Playing</h5>
        <Button variant="outline-light" size="sm" onClick={onClose}>
          <i className="bi bi-x"></i>
        </Button>
      </Card.Header>

      <Card.Body>
        {/* Current Track Info */}
        {currentTrack && (
          <div className="text-center mb-4">
            <img
              src={currentTrack.imageUrl || "/placeholder.svg"}
              alt={currentTrack.name}
              className="rounded mb-3"
              style={{ width: "120px", height: "120px", objectFit: "cover" }}
            />
            <h6 className="text-light mb-1">{currentTrack.name}</h6>
            <p className="text-muted mb-0">{currentTrack.artist}</p>
            <small className="text-muted">{currentTrack.album}</small>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-3">
          <ProgressBar now={progressPercentage} className="mb-2" style={{ height: "6px" }} />
          <div className="d-flex justify-content-between">
            <small className="text-muted">{formatTime(currentTime)}</small>
            <small className="text-muted">{currentTrack ? formatTime(currentTrack.duration) : "0:00"}</small>
          </div>
        </div>

        {/* Player Controls */}
        <div className="player-controls mb-4">
          <Button variant="outline-light" className="control-btn" onClick={handlePrevious} disabled={!currentTrack}>
            <i className="bi bi-skip-backward-fill"></i>
          </Button>

          <Button variant="primary" className="control-btn play-btn" onClick={handlePlayPause} disabled={!currentTrack}>
            <i className={`bi bi-${isPlaying ? "pause" : "play"}-fill`}></i>
          </Button>

          <Button variant="outline-light" className="control-btn" onClick={handleNext} disabled={!currentTrack}>
            <i className="bi bi-skip-forward-fill"></i>
          </Button>
        </div>

        {/* Playlist */}
        <div>
          <h6 className="text-light mb-3">
            {playlist.name} ({playlist.tracks.length} tracks)
          </h6>
          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            <ListGroup variant="flush">
              {playlist.tracks.map((track, index) => (
                <ListGroup.Item
                  key={track.id}
                  className={`bg-transparent border-0 text-light p-2 ${
                    index === currentTrackIndex ? "bg-surface-variant" : ""
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleTrackSelect(index)}
                >
                  <div className="d-flex align-items-center">
                    <div className="me-2" style={{ width: "20px" }}>
                      {index === currentTrackIndex && isPlaying ? (
                        <i className="bi bi-volume-up text-primary"></i>
                      ) : (
                        <small className="text-muted">{index + 1}</small>
                      )}
                    </div>
                    <div className="flex-grow-1">
                      <div className="text-light small">{track.name}</div>
                      <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                        {track.artist}
                      </div>
                    </div>
                    <small className="text-muted">{formatTime(track.duration)}</small>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </div>
      </Card.Body>

    </Card>
  )
}

export default MusicPlayer
