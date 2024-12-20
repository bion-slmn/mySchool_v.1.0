import { useState } from "react";
import { ViewFee } from "../components/fees/viewFees";
import { ViewPaymentonFee } from "../components/payments/viewPayments";
import CreatePayments from "../components/payments/createPayments";
import CreateFee from "../components/fees/createFee";
import { Button } from "react-bootstrap";

const FeesAndPayments = () => {
  const [activeView, setActiveView] = useState(null); // Manage active view

  const toggleView = (view) => {
    setActiveView((prevView) => (prevView === view ? null : view));
  };

  return (
    <div className="container">
      <h2>Fees and Payment Details</h2>
      <br />
      <div className="d-flex justify-content-start gap-2">
        <Button
          variant="success"
          onClick={() => toggleView("createFee")}
        >
          {activeView === "createFee" ? "Hide Create Fee" : "Create Fee"}
        </Button>
        <Button
          variant="info"
          onClick={() => toggleView("addPayments")}
        >
          {activeView === "addPayments" ? "Hide Add Payments" : "Add Payments"}
        </Button>
      </div>
      <br />
      {activeView === null && (
        <>
          <ViewFee />
          <ViewPaymentonFee />
        </>
      )}
      {activeView === "createFee" && (
        <div
          className="container"
          style={{
            border: "1px solid lightgray",
            borderRadius: "5px",
            padding: "16px",
            margin: "auto",
          }}
        >
          <CreateFee />
        </div>
      )}
      {activeView === "addPayments" && (
        <div
          className="container"
          style={{
            border: "1px solid lightgray",
            borderRadius: "5px",
            padding: "16px",
            margin: "auto",
          }}
        >
          <CreatePayments />
        </div>
      )}
    </div>
  );
};

export default FeesAndPayments;
