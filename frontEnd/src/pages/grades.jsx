import React, { useState } from "react";
import ViewGrades from "../components/grade/viewGrade";
import CreateGrade from "../components/grade/createGrade";
import { Button } from "react-bootstrap";
import { ViewFeeInClassOrTerm } from "../components/fees/viewFees";

const Grades = () => {
  const [showCreateGrade, setShowCreateGrade] = useState(false);

  const toggleCreateGrade = () => {
    setShowCreateGrade((prevState) => !prevState);
  };

  return (
    <div className="container">
      <br />
      
      <Button variant="success" onClick={toggleCreateGrade} style={{ textAlign: "center" }} >
        {showCreateGrade ? "Back to View Grades" : "Create Grade"}
      </Button>
      {showCreateGrade ? <CreateGrade /> : <ViewGrades />}
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
                <ViewFeeInClassOrTerm type="class" />
              </div>
        <br />
    </div>
  );
};

export default Grades;
