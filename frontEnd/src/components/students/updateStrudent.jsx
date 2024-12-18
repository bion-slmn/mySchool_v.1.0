import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { updateData, fetchData } from "../../service/apiservice";
import { useAuth } from "../../service/authService";
import { toast } from "react-toastify";
import SubmitButton from "../submitButton";

const UpdateStudent = () => {
    const location = useLocation();
    const { student } = location.state; // student passed through location
    const [studentData, setStudentData] = useState(student);
    const [isLoading, setIsLoading] = useState(false);
    const { checkTokenAndRefresh } = useAuth();
    const [grades, setGrades] = useState([]);
 

    useEffect(() => {
        const getGrades = async () => {
            try {
                await checkTokenAndRefresh();
                const data = await fetchData("class/view/");
                setGrades(data); // assuming data is an array of grades
            } catch (err) {
                console.error("Error fetching grades:", err.message);
                toast.error(err.message || "Failed to fetch grade data. Please try again.");
            }
        };
        getGrades();
    }, [checkTokenAndRefresh]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStudentData({ ...studentData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Start loading when submitting
        try {
            await checkTokenAndRefresh();
            await updateData(`student/update/${studentData.id}/`, studentData);
            toast.success("Student updated successfully!");
        } catch (err) {
            console.error("Error updating student:", err.message);
            toast.error(err.message || "Failed to update student. Please try again.");
        } finally {
            setIsLoading(false); // Stop loading once done
        }
    };

    return (
        <div className="container">
            <h1>Update Student</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={studentData.name} // Bind to studentData state
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control
                        type="date"
                        name="date_of_birth"
                        value={studentData.date_of_birth} // Bind to studentData state
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Gender</Form.Label>
                    <Form.Control
                        as="select"
                        name="gender"
                        value={studentData.gender} // Bind to studentData state
                        onChange={handleChange}
                        required
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Grade</Form.Label>
                    <Form.Control
                        as="select"
                        name="grade"
                        value={studentData.grade} // Bind to studentData state
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Grade</option>
                        {grades.map((grade) => (
                            <option key={grade.id} value={grade.id}>
                                {grade.name}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>
                <SubmitButton isLoading={isLoading} text="Update Student" />
            </Form>
        </div>
    );
};

export default UpdateStudent;
