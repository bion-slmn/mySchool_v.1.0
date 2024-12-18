import { useLocation } from "react-router-dom";
import { useAuth } from "../../service/authService";
import { toast } from "react-toastify";
import { updateData } from "../../service/apiservice";
import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import SubmitButton from "../submitButton";
import { useNavigate } from "react-router-dom";

const UpdateGrades = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { grade } = state;
    const { checkTokenAndRefresh } = useAuth();
    const [gradeData, setGradeData] = useState(grade);
    const [isLoading, setIsLoading] = useState(false);

    if (!grade) {
        navigate("/viewGrades");
        return null;
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setGradeData({ ...gradeData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await checkTokenAndRefresh();
            await updateData(`class/update/${gradeData.id}/`, gradeData);
            toast.success("Grade updated successfully!");
            navigate("/viewGrades");
        } catch (err) {
            console.error("Error updating grade:", err.message);
            toast.error(err.message || "Failed to update grade. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="container">
            <h1>Update Grade</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Grade Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={gradeData.name}
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Grade Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        placeholder="Enter grade description"
                        name="description"
                        value={gradeData.description || ""}
                        onChange={handleInputChange}
                    />
                </Form.Group>
                <SubmitButton isLoading={isLoading} text="Update Grade" />
            </Form>
        </div>
    );
};

export default UpdateGrades;
