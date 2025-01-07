import { fetchData, postData } from "../../service/apiservice";
import { useAuth } from "../../service/authService";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import SubmitButton from "../submitButton";
import AdmitorNewStudent from "./adminStudent";
import CreatePayments from "../payments/createPayments";


const CreateStudent = ({ nextStep, prevStep }) => {
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
        setIsLoading(true);
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
            if (nextStep) nextStep();

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


export const MultiStepCreateStudent = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        admissionType: "", // Tracks whether it's a new admission or not
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const nextStep = () => {
        console.log("Current Step:", step);
        console.log("Admission Type:", formData.admissionType);

        if (step === 2 && formData.admissionType !== "new") {
            setStep(1);
            alert("Admission type is not new. Redirecting to step 1.");
        } else {
            setStep(step + 1);
        }
    };

    const firstStep = () => setStep(1);


    const prevStep = () => setStep(step - 1);

    const handleSubmit = () => {
        alert("Form submitted successfully!");
        console.log(formData);
    };

    return (
        <div className=" container">
            <br />
            <h3 >Adding new student</h3>
            <br />
            {step === 1 && (
                <AdmitorNewStudent
                    nextStep={nextStep}
                    handleInputChange={handleInputChange}
                    formData={formData}
                />
            )}
            {step === 2 && (
                <CreateStudent
                    nextStep={nextStep}
                    prevStep={prevStep}
                    handleInputChange={handleInputChange}
                    formData={formData}
                />
            )}
            {step === 3 && (
                <CreatePayments
                    prevStep={firstStep}
                    handleSubmit={handleSubmit}
                    formData={formData}
                />
            )}
        </div>
    );
};
