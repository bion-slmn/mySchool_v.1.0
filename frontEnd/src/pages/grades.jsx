import React, { useState } from "react";
import ViewGrades from "../components/grade/viewGrade";
import CreateGrade from "../components/grade/createGrade";
import { Button } from "react-bootstrap";

const Grades = () => {
  const [showCreateGrade, setShowCreateGrade] = useState(false);

  const toggleCreateGrade = () => {
    setShowCreateGrade((prevState) => !prevState);
  };

  return (
    <div className="container">
      {showCreateGrade ? <CreateGrade /> : <ViewGrades />}
        <br />
      <Button variant="primary" onClick={toggleCreateGrade} style={{ textAlign: "center" }}>
        {showCreateGrade ? "Back to View Grades" : "Create Grade"}
      </Button>
    </div>
  );
};

export default Grades;
