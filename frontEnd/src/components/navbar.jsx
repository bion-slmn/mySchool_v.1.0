import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import { useAuth } from '../service/authService';
import { useNavigate } from 'react-router-dom';

function Navigationbar() {
  const {  logout, loginAction } = useAuth(); 
  const isAuthenticated = !!localStorage.getItem('sHule');
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout(); // Perform logout action
    navigate('/'); // Redirect to home page
  };

  const handleLogin = () => {
    loginAction(); // Trigger login action if necessary
    navigate('/login'); // Redirect to login page
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">sHule</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="dashboard">Dashboard</Nav.Link>
            <Nav.Link href="school">School</Nav.Link>
            <NavDropdown title="Create" id="basic-nav-dropdown">
              <NavDropdown.Item href="createTerm">Create Term</NavDropdown.Item>
              <NavDropdown.Item href="createStudent">
                Add Student
              </NavDropdown.Item>
              <NavDropdown.Item href="createFee">Add Fee</NavDropdown.Item>
              <NavDropdown.Item href="createPayments">Add Payments</NavDropdown.Item>
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
