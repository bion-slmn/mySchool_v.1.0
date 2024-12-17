import React, { useState } from "react";
import { updateData } from "../../service/apiservice";
import { toast } from "react-toastify";
import Form from "react-bootstrap/Form";
import SubmitButton from "../submitButton";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../service/authService";

const UpdateSchool = () => {
  const location = useLocation();
  const { school } = location.state || {}; 
  // Initialize local state with school data
  const [schoolName, setSchoolName] = useState(school?.name || "");
  const [address, setAddress] = useState(school?.address || "");
  const [isLoading, setIsLoading] = useState(false);
  const { checkTokenAndRefresh } = useAuth();
  const navigate = useNavigate(); // Correct usage of `useNavigate`

  if (!school) {
    navigate("/viewSchool");
  }
  // Handle input changes
  const handleInput = (e) => {
    const { name, value } = e.target;
    if (name === "schoolName") {
      setSchoolName(value);
    } else if (name === "address") {
      setAddress(value);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = { name: schoolName, address };
      await checkTokenAndRefresh();
      await updateData("school/update/", payload);
      toast.success("School updated successfully!");
      navigate("/viewSchool"); // Navigate after success
    } catch (error) {
      console.error("Error updating school data:", error);
      toast.error(error.message || "Failed to update school. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Update School</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>School Name</Form.Label>
          <Form.Control
            type="text"
            name="schoolName"
            value={schoolName}
            onChange={handleInput}
            placeholder="School Name"
            required
          />
        </Form.Group>
        <br />
        <Form.Group>
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            name="address"
            value={address}
            onChange={handleInput}
            placeholder="Address"
            required
          />
        </Form.Group>
        <br />
        <SubmitButton text="Update" isLoading={isLoading} />
      </Form>
    </div>
  );
};

export default UpdateSchool;
