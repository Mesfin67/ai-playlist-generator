"use client"

import { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { login } from "../../services/auth";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await login(formData);
      onLogin(response);
    } catch (error) {
      setError(error.message || "Login failed...try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="pt-5 min-vh-100 bg-dark">
      <Row className="justify-content-center pt-5">
        <Col md={6} lg={5}>
          <Card className="shadow-lg-custom">
            <Card.Header className="text-center py-4">
              <h3 className="gradient-text mb-0">Welcome Back</h3>
              <p className="text-muted mt-2">Login</p>
            </Card.Header>
            <Card.Body className="p-4">
              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3 text-white">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter username"
                    required
                    disabled={loading}
                  />
                </Form.Group>
                <Form.Group className="mb-4 text-white">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    required
                    disabled={loading}
                    minLength={8}
                  />
                </Form.Group>
                <Button type="submit" variant="primary" size="lg" className="w-100 mb-3" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="loading-spinner me-2"></span>
                      Logging
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </Form>
              <div className="text-center">
                <p className="text-muted mb-0">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-decoration-none">
                    Sign UP
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
