import React, { useState } from "react";
import ViewSchool from "../components/school/viewSchool";
import ViewTerms from "../components/school/viewTerm";
import CreateTerm from "../components/school/createTerm";
import { Button } from "react-bootstrap";
import { ViewFeeInClassOrTerm } from "../components/fees/viewFees";

const School = () => {
  const [activeSection, setActiveSection] = useState("viewTerms"); // Manage active section

  const toggleSection = (section) => {
    setActiveSection((prevSection) => (prevSection === section ? "viewTerms" : section));
  };

  return (
    <div>
      <ViewSchool />
      {activeSection === "viewTerms" && <ViewTerms />}
      <div className="d-flex justify-content-center mt-3">
        <Button
          variant="primary"
          onClick={() => toggleSection("createTerm")}
          className="me-2"
        >
          {activeSection === "createTerm" ? "Hide Create Term" : "Create Term"}
        </Button>
        <Button
          variant="secondary"
          onClick={() => toggleSection("viewFees")}
        >
          {activeSection === "viewFees" ? "Hide Fees" : "View Fees"}
        </Button>
      </div>
      {activeSection === "createTerm" && (
        <div
          className="container"
          style={{
            border: "1px solid lightgray",
            borderRadius: "5px",
            padding: "16px",
            margin: "auto",
            width: "70%",
          }}
        >
          <br />
          <CreateTerm />
        </div>
      )}
      {activeSection === "viewFees" && (
        <div
          className="container"
          style={{
            border: "1px solid lightgray",
            borderRadius: "5px",
            padding: "16px",
            margin: "auto",
          }}
        >
          <br />
          <ViewFeeInClassOrTerm type="term" />
        </div>
      )}
    </div>
  );
};

export default School;
