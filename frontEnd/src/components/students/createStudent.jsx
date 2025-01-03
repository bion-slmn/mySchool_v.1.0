import { fetchData, postData } from "../../service/apiservice";
import { useAuth } from "../../service/authService";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import SubmitButton from "../submitButton";

const CreateStudent = () => {
    const [student, setStudent] = useState({
        name: "",
        date_of_birth: "",
        gender: "male",
        grade: "",
    });
    const [isLoading, setIsLoading] = useState(true);
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
            } finally {
                setIsLoading(false);
            }
        };
        getGrades();
    }, [checkTokenAndRefresh]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStudent({ ...student, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await postData("student/create/", student);
            toast.success("Student created successfully!");
        } catch (err) {
            console.error("Error creating student:", err.message);
            toast.error(err.message || "Failed to create student. Please try again.");
        }
        setIsLoading(false);
    };

    return (
        <div className="container">
            <h1>Create Student</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={student.name}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control
                        type="date"
                        name="date_of_birth"
                        value={student.date_of_birth}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Gender</Form.Label>
                    <Form.Control
                        as="select"
                        name="gender"
                        value={student.gender}
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
                        value={student.grade}
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
                <SubmitButton isLoading={isLoading} text="Create Student" />
            </Form>
        </div>
    );
};

export default CreateStudent;