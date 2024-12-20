import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Row, Col, Card } from "react-bootstrap";

const HomePage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login"); // Redirect to login page
  };

  return (
    <Container className="mt-5 text-center">
      <h1>Welcome to the School Management System</h1>
      <p className="text-muted">
        Manage all aspects of your school in one place: students, teachers, classes, fees, and reports.
      </p>
      
      <Row className="justify-content-center mt-4">
        <Col md={6}>
          <Card className="shadow-sm p-4">
            <Card.Body>
              <Card.Title>Get Started</Card.Title>
              <Card.Text>
                To begin, please log in with your credentials. The system allows you to manage students, fees, classes, and more.
              </Card.Text>
              <Button variant="primary" onClick={handleLoginClick}>
                Login
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
