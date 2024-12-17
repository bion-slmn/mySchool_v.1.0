import { toast } from "react-toastify";
import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import SubmitButton from "../submitButton";
import { postData } from "../../service/apiservice";
import { useAuth } from "../../service/authService";


const CreateSchool = () => {
  const [schoolName, setSchoolName] = useState("");
  const [address, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { checkTokenAndRefresh } = useAuth();
  

  const handleInput = (e) => {
    const { name, value } = e.target;
    if (name === "schoolName") {
      setSchoolName(value);
    } else if (name === "address") {
      setLocation(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await checkTokenAndRefresh();
        const schoolData = await postData("school/create/", {'name': schoolName, 'address': address});

      toast.success("School created successfully!");
      
    } catch (error) {
      console.error("Error submitting school data:", error);
      toast.error(error.message || "Failed to create school. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
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
          <Form.Label>Location</Form.Label>
          <Form.Control
            type="text"
            name="address"
            value={address}
            onChange={handleInput}
            placeholder="Location"
            required
          />
        </Form.Group>
        <br />
        <SubmitButton text="Submit" isLoading={isLoading} />
      </Form>
    </div>
  );
};

export default CreateSchool;
