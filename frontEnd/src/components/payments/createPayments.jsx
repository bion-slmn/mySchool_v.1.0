import { fetchData, postData } from "../../service/apiservice";
import { useAuth } from "../../service/authService";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import { Form, Spinner } from "react-bootstrap";
import SubmitButton from "../submitButton";


const CreatePayments = () => {
    const [paymentData, setPaymentData] = useState({ fee: "", student: "", amount: "", payment_method: "" });
    const [selectedGrade, setSelectedGrade] = useState(""); // Separate state for grade
    const [isLoading, setIsLoading] = useState(true);
    const { checkTokenAndRefresh } = useAuth();
    const [fees, setFees] = useState([]);
    const [students, setStudents] = useState([]);
    const [grades, setGrades] = useState([]);

    useEffect(() => {
        const fetchGrades = async () => {
            try {
                await checkTokenAndRefresh();
                const gradeData = await fetchData("class/view/");
                setGrades(gradeData);
            } catch (err) {
                console.error("Error fetching grades:", err.message);
                toast.error(err.message || "Failed to fetch grades. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchGrades();
    }, []);

    const handleGradeChange = async (e) => {
        const grade = e.target.value;
        setSelectedGrade(grade);

        if (grade) {
            try {
                setIsLoading(true);
                await checkTokenAndRefresh();

                const [studentData, feeData] = await Promise.all([
                    fetchData(`student/grade/${grade}`),
                    fetchData(`fee/grade/${grade}`),
                ]);

                setStudents(studentData);
                setFees(feeData);
            } catch (err) {
                console.error("Error fetching students or fees:", err.message);
                toast.error(err.message || "Failed to fetch related data. Please try again.");
            } finally {
                setIsLoading(false);
            }
        } else {
            setStudents([]);
            setFees([]);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setPaymentData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedGrade) {
            toast.error("Please select a grade before proceeding.");
            return;
        }

        try {
            await checkTokenAndRefresh();
            await postData("payment/create/", { ...paymentData, grade_id: selectedGrade }); // Include grade in submission
            toast.success("Payment created successfully.");
        } catch (err) {
            console.error("Error creating payment:", err.message);
            toast.error(err.message || "Failed to create payment. Please try again.");
        }
    };

    return (
        <div className="container">
            <h4 centered >Add Payment</h4>
            {isLoading ? (
                <div className="d-flex justify-content-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="grade_id">
                        <Form.Label>Grade</Form.Label>
                        <Form.Control as="select" value={selectedGrade} onChange={handleGradeChange} required>
                            <option value="">Select Grade</option>
                            {grades.map((grade) => (
                                <option key={grade.id} value={grade.id}>
                                    {grade.name}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="fee_id">
                        <Form.Label>Fee</Form.Label>
                        <Form.Control as="select" name="fee" onChange={handleChange} disabled={!fees.length} required>
                            <option value="">Select Fee</option>
                            {fees.map((fee) => (
                                <option key={fee.id} value={fee.id}>
                                    {fee.name}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="student_id">
                        <Form.Label>Student</Form.Label>
                        <Form.Control as="select" name="student" onChange={handleChange} disabled={!students.length} required>
                            <option value="">Select Student</option>
                            {students.map((student) => (
                                <option key={student.id} value={student.id}>
                                    {student.name}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="amount">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control
                            type="number"
                            name="amount"
                            value={paymentData.amount}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="payment_method">
                        <Form.Label>Payment Method</Form.Label>
                        <Form.Control
                            as="select"
                            name="payment_method"
                            value={paymentData.payment_method}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Payment Method</option>
                            <option value="CASH">Cash</option>
                            <option value="BANK">Bank</option>
                        </Form.Control>
                    </Form.Group>
                    <br />
                    <SubmitButton text="Make payment" isLoading={isLoading} />
                </Form>
            )}
        </div>
    );
};

export default CreatePayments;