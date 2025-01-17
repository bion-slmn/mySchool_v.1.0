import React, { useState } from "react";
import { Button, Container, Row, Col, Card } from "react-bootstrap";
import CreateFee from "../components/fees/createFee";
import CreateGrade from "../components/grade/createGrade";
import CreateSchool from "../components/school/createSchool";
import CreatePayments from "../components/payments/createPayments";
import PaymentCardinGrade from '../components/dashbaord';
import ViewTotalStudents from "../components/school/viewTotalStudents";
import ViewTotalPayments from "../components/payments/totalPayment";


const DashboardButtons = () => {
  const [selectedAction, setSelectedAction] = useState(null); // Keeps track of which component to show

  const handleButtonClick = (action) => {
    setSelectedAction(action);
  };

  const handleCloseOverlay = () => {
    setSelectedAction(null);
  };

  return (
    <Container className="mt-5">
      <h1>Dashboard</h1>
      <Row className="mb-4">
        <Col xs={6} sm={6} md={3} className="mb-3">
          <Button variant="primary" onClick={() => handleButtonClick("createFee")} className="w-100">
            Create Fee
          </Button>
        </Col>
        <Col xs={6} sm={6} md={3} className="mb-3">
          <Button variant="secondary" onClick={() => handleButtonClick("createGrade")} className="w-100">
            Create Grade
          </Button>
        </Col>
        <Col xs={6} sm={6} md={3} className="mb-3">
          <Button variant="success" onClick={() => handleButtonClick("createSchool")} className="w-100">
            Create School
          </Button>
        </Col>
        <Col xs={6} sm={6} md={3} className="mb-3">
          <Button variant="info" onClick={() => handleButtonClick("createPayments")} className="w-100">
            Add Payments
          </Button>
        </Col>
      </Row>

      {/* Overlayed content */}
      {selectedAction && (
        <div className="overlay-container">
          <Card className="p-4">
            <Button
              variant="danger"
              className="close-button"
              onClick={handleCloseOverlay}
              style={{ position: 'absolute', top: '10px', right: '10px' }}
            >
              Close
            </Button>

            {selectedAction === "createFee" && <CreateFee />}
            {selectedAction === "createGrade" && <CreateGrade />}
            {selectedAction === "createSchool" && <CreateSchool />}
            {selectedAction === "createPayments" && <CreatePayments />}
          </Card>
        </div>
      )}
    </Container>
  );
};




const DashboardCards = () => {
  return (
    <Container className="my-4">
      <Row className="justify-content-md-center g-3">
        <Col xs={12} sm={6} md={4} className="d-flex align-items-stretch">
          <ViewTotalStudents />
        </Col>
        <Col xs={12} sm={6} md={4} className="d-flex align-items-stretch">
          <ViewTotalPayments />
        </Col>
      </Row>
    </Container>
  );
};






const Dashboard = () => {
  return (
    <div>
      <DashboardButtons />
      <hr />
      <DashboardCards />
      <PaymentCardinGrade />
    </div>
  );
};

export default Dashboard;
