import { toast } from "react-toastify";
import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import SubmitButton from "../submitButton";
import { postData } from "../../service/apiservice";


const CreateGrade = () => {
  const [gradeData, setGradeData] = useState({ name: "", description: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleInput = (e) => {
    setGradeData({ ...gradeData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const gradeData_ = await postData("class/create/", gradeData);

      toast.success("Grade created successfully!");
    } catch (error) {
      console.error("Error submitting grade data:", error);
      toast.error(error.message || "Failed to create grade. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
  className="container "
  style={{
    border: "1px solid lightgray",
    borderRadius: "5px",
    padding: "16px", // Space inside the border
    margin: "16px", // Space outside the border
  }}>
      <h2>Create a grade</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Grade Name</Form.Label>
          <Form.Control
            type="text"
            name="name"  // Corrected name
            value={gradeData.name}  // Corrected value to match state
            onChange={handleInput}
            placeholder="Grade Name"
            required
          />
        </Form.Group>
        <br />
        <Form.Group>
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            name="description"  // Corrected name
            value={gradeData.description}  // Corrected value to match state
            onChange={handleInput}
            placeholder="Description"
          />
        </Form.Group>
        <br />
        <SubmitButton isLoading={isLoading} text="Create Grade" />
      </Form>
    </div>
  );
};

export default CreateGrade;
