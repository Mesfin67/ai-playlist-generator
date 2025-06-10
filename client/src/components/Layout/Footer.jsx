import { Container, Row, Col } from "react-bootstrap"

const Footer = () => {
  return (
    <footer
      className="bg-surface mt-5 py-4 border-top"
      style={{ borderColor: "var(--border-color)" }}
    >
      <Container>
       
        <hr
          className="my-4"
          style={{ borderColor: "var(--border-color)" }}
        />
        <Row>
          <Col className="text-center">
            <small className="text-muted">
              © 2025 MusicAI | All rights reserved
            </small>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
