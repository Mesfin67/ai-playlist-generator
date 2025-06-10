"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap"
import PlaylistGenerator from "./PlaylistGenerator"
import MusicPlayer from "./MusicPlayer"
import { getUserPlaylists } from "../../services/api"

const Dashboard = ({ user }) => {
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentPlaylist, setCurrentPlaylist] = useState(null)
  const [showGenerator, setShowGenerator] = useState(false)

  useEffect(() => {
    fetchPlaylists()
  }, [])

  const fetchPlaylists = async () => {
    try {
      setLoading(true)
      const response = await getUserPlaylists()
      setPlaylists(response.playlists)
    } catch (error) {
      setError("Failed to load playlists")
      console.error("Fetch playlists error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePlaylistGenerated = (newPlaylist) => {
    setPlaylists([newPlaylist, ...playlists])
    setCurrentPlaylist(newPlaylist)
    setShowGenerator(false)
  }

  const handlePlayPlaylist = (playlist) => {
    setCurrentPlaylist(playlist)
  }

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading your dashboard...</p>
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      <Row className="mb-4 pt-5">
        <Col>
          <Card className="bg-surface border-0">
            <Card.Body className="p-4">
              <h2 className="gradient-text mb-2">Welcome {user.username}</h2>
              <p className="text-muted mb-3">
                Ready to discover your next favorite playlist? Let our AI create something amazing for you.
              </p>
              <Button variant="primary" size="md" onClick={() => setShowGenerator(!showGenerator)}>
                <i className="bi bi-plus-circle me-2"></i>
                {showGenerator ? "Hide Generator" : "Generate New Playlist"}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Error Alert */}
      {error && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger" dismissible onClose={() => setError("")}>
              {error}
            </Alert>
          </Col>
        </Row>
      )}

      {/* Playlist Generator */}
      {showGenerator && (
        <Row className="mb-4">
          <Col>
            <PlaylistGenerator onPlaylistGenerated={handlePlaylistGenerated} onCancel={() => setShowGenerator(false)} />
          </Col>
        </Row>
      )}

      <Row>
        {/* Playlists Section */}
        <Col lg={currentPlaylist ? 8 : 12}>
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h4 className="mb-0 text-white">Your Playlists</h4>
              <span className="badge bg-primary">{playlists.length}</span>
            </Card.Header>
            <Card.Body>
              {playlists.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-music-note-list" style={{ fontSize: "4rem", color: "var(--text-secondary)" }}></i>
                  <h5 className="text-muted mt-3 text-white">No playlists yet</h5>
                  <p className="text-muted">Generate your first AI-powered playlist to get started!</p>
                </div>
              ) : (
                <Row className="g-3">
                  {playlists.map((playlist) => (
                    <Col md={6} key={playlist._id}>
                      <div className="playlist-card">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="text-light mb-1 text-white me-5">{playlist.name}</h6>
                          <Button variant="outline-primary" size="sm" onClick={() => handlePlayPlaylist(playlist)}>
                            <i className="bi bi-play-fill"></i>
                          </Button>
                        </div>

                        <p className="text-muted small mb-2">{playlist.description}</p>

                        <div className="d-flex flex-wrap gap-1 mb-2">
                          <span className="mood-badge">{playlist.mood}</span>
                          <span className="activity-badge">{playlist.activity}</span>
                        </div>

                        <div className="d-flex flex-wrap gap-1 mb-3">
                          {playlist.genres.map((genre, index) => (
                            <span key={index} className="genre-badge">
                              {genre}
                            </span>
                          ))}
                        </div>

                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">{playlist.tracks.length} tracks</small>
                          <small className="text-muted">{new Date(playlist.createdAt).toLocaleDateString()}</small>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Music Player Section */}
        {currentPlaylist && (
          <Col className="position z-index-55" lg={4}>
            <MusicPlayer playlist={currentPlaylist} onClose={() => setCurrentPlaylist(null)} />
          </Col>
        )}
      </Row>
       
    </Container>
  )
}

export default Dashboard
