import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import { useAuth } from '../service/authService';
import { useNavigate } from 'react-router-dom';
import "../styles/navbar.css";


function Navigationbar() {
  const { logOut, loginAction } = useAuth();
  const isAuthenticated = !!localStorage.getItem('sHule');
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logOut(); // Perform logout action
    navigate('/'); // Redirect to home page
  };

  const handleLogin = () => {
    loginAction(); // Trigger login action if necessary
    navigate('/login'); // Redirect to login page
  };

  return (
    <Navbar bg="primary" data-bs-theme="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">sHule</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" bg="dark" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="dashboard">Dashboard</Nav.Link>
            <Nav.Link href="school">School</Nav.Link>
            <NavDropdown title="Add" id="basic-nav-dropdown">
              <NavDropdown.Item href="createTerm">Add Term</NavDropdown.Item>
              <NavDropdown.Item href="createStudent">
                Add Student
              </NavDropdown.Item>
              <NavDropdown.Item href="createFee">Add Fee</NavDropdown.Item>
              <NavDropdown.Item href="createPayments">Add Payments</NavDropdown.Item>
              <NavDropdown.Item href="CreateGrade">Add Grade</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="grades">
                View Grades
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <div className="d-flex">
            {/* Show Login or Logout button based on authentication state */}
            {isAuthenticated ? (
              <Button variant="outline-light" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Button variant="light" onClick={handleLogin}>
                Login
              </Button>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigationbar;
