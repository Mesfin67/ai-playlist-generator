import { Container, Row, Col, Button } from "react-bootstrap"
import { Link } from "react-router-dom"

const Hero = () => {
  return (
    <section className="hero-section pt-5 d-flex align-items-center justify-content-center text-white pt-5" >
      <Container>
        <Row className="align-items-center min-vh-75 pt-5">
          <Col lg={6} className="hero-content">
            <h1 className="hero-title fade-in">AI-Powered Music Playlist Generator</h1>
            <p className="hero-subtitle slide-up">
             Make playlists that fit your mood, what you’re doing and what you like. Our AI will help choose the perfect music for every moment
            </p>
            <div className="d-flex flex-column flex-sm-row gap-3 slide-up">
              <Button as={Link} to="/register" variant="primary" size="md" className="px-4 py-3">
                Get Started
              </Button>
              <Button as={Link} to="/login"  size="md" className="px-4 py-3">
                Login
              </Button>
            </div>
          </Col>
         
        </Row>

        {/* Features Section */}
        <Row className="mt-5 pt-5">
          <Col className="text-center mb-5">
            <h2 className="gradient-text mb-3"> MusicAI</h2>
            <p className="text-muted">Experience music like never before with our intelligent features</p>
          </Col>
        </Row>
        <Row className="g-4">
          <Col md={4}>
            <div className="text-center p-4 card h-100">
              <div className="mb-3">
                <i className="bi bi-brain" style={{ fontSize: "3rem", color: "var(--primary-color)" }}></i>
              </div>
             <h5 className="text-light mb-3">Smart AI Picks</h5>
<p className="text-muted">
  Our AI learns what you like and makes playlists just for you.
</p>

            </div>
          </Col>
          <Col md={4}>
            <div className="text-center p-4 card h-100">
              <div className="mb-3">
                <i className="bi bi-emoji-smile" style={{ fontSize: "3rem", color: "var(--secondary-color)" }}></i>
              </div>
              <h5 className="text-light mb-3">Mood Matching</h5>
              <p className="text-muted">
                Tell us how you're feeling and we'll find the perfect songs to match your mood
              </p>
            </div>
          </Col>
          <Col md={4}>
            <div className="text-center p-4 card h-100">
              <div className="mb-3">
                <i className="bi bi-activity" style={{ fontSize: "3rem", color: "var(--accent-color)" }}></i>
              </div>
              <h5 className="text-light mb-3">Activity Based</h5>
              <p className="text-muted">
                Whether you're working out, studying or relaxing | we have the right music for you
              </p>
            </div>
          </Col>
        </Row>
      </Container>
      
    </section>
  )
}

export default Hero
