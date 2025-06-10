"use client"

import { useState } from "react"
import { Card, Form, Button, Row, Col, Alert } from "react-bootstrap"
import { generatePlaylist } from "../../services/api"

const PlaylistGenerator = ({ onPlaylistGenerated, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    mood: "happy",
    activity: "relaxing",
    genres: [],
    description: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const moods = [
    { value: "happy", label: "Happy", icon: "😊" },
    { value: "sad", label: "Sad", icon: "😢" },
    { value: "energetic", label: "Energetic", icon: "⚡" },
    { value: "calm", label: "Calm", icon: "😌" },
    { value: "focused", label: "Focused", icon: "🎯" },
    { value: "romantic", label: "Romantic", icon: "💕" },
  ]

  const activities = [
    { value: "working-out", label: "Working Out", icon: "💪" },
    { value: "studying", label: "Studying", icon: "📚" },
    { value: "relaxing", label: "Relaxing", icon: "🛋️" },
    { value: "commuting", label: "Commuting", icon: "🚗" },
    { value: "party", label: "Party", icon: "🎉" },
    { value: "sleep", label: "Sleep", icon: "😴" },
  ]

  const genres = ["pop", "rock", "hip-hop", "jazz", "classical", "electronic", "country", "r&b", "indie", "alternative"]

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    if (type === "checkbox") {
      if (name === "genres") {
        setFormData((prev) => ({
          ...prev,
          genres: checked ? [...prev.genres, value] : prev.genres.filter((genre) => genre !== value),
        }))
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }

    if (error) setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      setError("Please enter a playlist name")
      return
    }

    if (formData.genres.length === 0) {
      setError("Please select at least one genre")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await generatePlaylist(formData)
      onPlaylistGenerated(response.playlist)
    } catch (error) {
      setError(error.message || "Failed to generate playlist")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="shadow-lg-custom">
      <Card.Header>
        <h4 className="mb-0 gradient-text">
          <i className="bi bi-magic me-2"></i>
          AI Playlist Generator
        </h4>
      </Card.Header>
      <Card.Body className="p-4">
        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3 text-white">
                <Form.Label>Playlist Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="My Awesome Playlist"
                  required
                  disabled={loading}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3 text-white">
                <Form.Label>Description (Optional)</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your playlist..."
                  disabled={loading}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3 text-white">
                <Form.Label>Current Mood</Form.Label>
                <Form.Select name="mood" value={formData.mood} onChange={handleChange} disabled={loading}>
                  {moods.map((mood) => (
                    <option key={mood.value} value={mood.value}>
                      {mood.icon} {mood.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3 text-white">
                <Form.Label>Activity</Form.Label>
                <Form.Select name="activity" value={formData.activity} onChange={handleChange} disabled={loading}>
                  {activities.map((activity) => (
                    <option key={activity.value} value={activity.value}>
                      {activity.icon} {activity.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-4 text-white">
            <Form.Label>Preferred Genres (Select at least one)</Form.Label>
            <Row className="g-2">
              {genres.map((genre) => (
                <Col sm={6} md={4} lg={3} key={genre}>
                  <Form.Check
                    type="checkbox"
                    name="genres"
                    value={genre}
                    label={genre.charAt(0).toUpperCase() + genre.slice(1)}
                    checked={formData.genres.includes(genre)}
                    onChange={handleChange}
                    disabled={loading}
                    className="text-capitalize"
                  />
                </Col>
              ))}
            </Row>
          </Form.Group>

          <div className="d-flex gap-3">
            <Button type="submit" variant="primary" disabled={loading} className="flex-grow-1">
              {loading ? (
                <>
                  <span className="loading-spinner me-2"></span>
                  Generating Playlist...
                </>
              ) : (
                <>
                  <i className="bi bi-magic me-2"></i>
                  Generate Playlist
                </>
              )}
            </Button>
            <Button type="button" variant="outline-secondary" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default PlaylistGenerator
