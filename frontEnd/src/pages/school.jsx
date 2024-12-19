import React, { useState } from "react";
import ViewSchool from "../components/school/viewSchool";
import ViewTerms from "../components/school/viewTerm";
import CreateTerm from "../components/school/createTerm";
import { Button } from "react-bootstrap";

const School = () => {
  const [showCreateTerm, setShowCreateTerm] = useState(false);

  const toggleCreateTerm = () => {
    setShowCreateTerm((prevState) => !prevState);
  };

  return (
    <div>
      <ViewSchool />
      {!showCreateTerm && <ViewTerms />}
      <div className="d-flex justify-content-center mt-3">
        <Button variant="primary" onClick={toggleCreateTerm}>
          {showCreateTerm ? "Hide Create Term" : "Create Term"}
        </Button>
      </div>
      {showCreateTerm && (
        <div 
  className="container" 
  style={{ 
    border: "1px solid lightgray", 
    borderRadius: "5px", 
    padding: "16px", 
    margin: "auto", 
    width: "70%" 
  }}
>
    <br />
    
          <CreateTerm />
        </div>
      )}
    </div>
  );
};

export default School;
