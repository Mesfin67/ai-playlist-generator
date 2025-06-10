"use client"
import { Navbar, Nav, Container, Button } from "react-bootstrap"
import { Link, useLocation } from "react-router-dom"

const Header = ({ user, onLogout }) => {
  const location = useLocation()

  return (
    <>
      <Navbar fixed="top" expand="lg" className="navbar-dark">
        <Container>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <i className="bi bi-music-note-beamed me-2"></i>
            MusicAI
          </Navbar.Brand>

          <Navbar.Collapse id="basic-navbar-nav" className="w-100">
            <Nav className="me-auto">
              
            </Nav>

            <Nav className="ms-auto">
              {user ? (
                <div className="header-user d-flex align-items-center">
                  <span className="text-light me-3">
                    <strong>{user.username}</strong>
                  </span>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="btn-no-outline"
                    onClick={onLogout}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="d-flex gap-2">
                  <Button
                    as={Link}
                    to="/login"
                    variant="outline-primary"
                    size="sm"
                    className={`btn-no-outline ${location.pathname === "/login" ? "active" : ""}`}
                  >
                    Login
                  </Button>
                  <Button
                    as={Link}
                    to="/register"
                    variant="primary"
                    size="sm"
                    className={location.pathname === "/register" ? "active" : ""}
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <style>{`
        /* Remove focus & hover outlines for buttons */
        .btn-no-outline:hover,
        .btn-no-outline:focus,
        .btn-outline-primary:hover,
        .btn-outline-primary:focus {
          outline: none !important;
          box-shadow: none !important;
        }

        /* On small screens, position username and logout button at top left */
        @media (max-width: 576px) {
          .header-user {
            position: absolute;
            top: 10px;
            left: 10px;
            display: flex;
            align-items: center;
          }
          /* Shift the brand to avoid overlapping user info */
          .navbar-dark .navbar-brand {
            margin-left: 150px;
          }
        }
      `}</style>
    </>
  )
}

export default Header
