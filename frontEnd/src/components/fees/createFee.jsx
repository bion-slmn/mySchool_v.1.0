import { fetchData, postData } from "../../service/apiservice";
import { useAuth } from "../../service/authService";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import { Form, Spinner } from "react-bootstrap";
import SubmitButton from "../submitButton";

const feeTypes = [
    { value: "ADMISSION", label: "Admission Fee" },
    { value: "TERM", label: "Term Fee" },
    { value: "ONCE", label: "One-time Fee" },
    { value: "DAILY", label: "Daily Fee" },
];

const CreateFee = () => {
    const [feeData, setFeeData] = useState({ fee_type: "", grade_ids: [], term: "", total_amount: "" });
    const [isLoading, setIsLoading] = useState(true);
    const { checkTokenAndRefresh } = useAuth();
    const [grades, setGrades] = useState([]);
    const [terms, setTerms] = useState([]);

    useEffect(() => {
        const fetchDataAsync = async () => {
            try {
                await checkTokenAndRefresh();
                const gradesData = await fetchData("class/view/");
                const termsData = await fetchData("school/term/view/");
                setGrades(gradesData);
                setTerms(termsData);
            } catch (err) {
                console.error("Error fetching data:", err.message);
                toast.error(err.message || "Failed to fetch data. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        if (feeData.fee_type !== "ADMISSION") {
            fetchDataAsync();
        } else {
            setGrades([]);
            setTerms([]);
        }
    }, [feeData.fee_type]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFeeData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        setFeeData((prevData) => ({
            ...prevData,
            grade_ids: checked
                ? [...prevData.grade_ids, value]
                : prevData.grade_ids.filter((id) => id !== value),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await checkTokenAndRefresh();
            console.log("Fee data:", feeData);
            await postData("fee/create/", feeData);
            toast.success("Fee created successfully.");
        } catch (err) {
            console.error("Error creating fee:", err.message);
            toast.error(err.message || "Failed to create fee. Please try again.");
        }
    };

    const isGradeAndTermDisabled = feeData.fee_type === "ADMISSION";

    return (
        <div className="container">
            {isLoading ? (
                <div className="d-flex justify-content-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="fee_type">
                        <Form.Label>Fee Type</Form.Label>
                        <Form.Control
                            as="select"
                            name="fee_type"
                            value={feeData.fee_type}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Fee Type</option>
                            {feeTypes.map((type) => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="description" className="mt-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type="text"
                            name="description"
                            placeholder="Simple description of the fee"
                            value={feeData.description}
                            onChange={handleChange}
                            />
                    </Form.Group>
                    <Form.Group controlId="grades" className="mt-3">
                        <Form.Label>Grades</Form.Label>
                        {!isGradeAndTermDisabled &&
                            grades.map((grade) => (
                                <Form.Check
                                    key={grade.id}
                                    type="checkbox"
                                    id={`grade_${grade.id}`}
                                    label={grade.name}
                                    value={grade.id}
                                    onChange={handleCheckboxChange}
                                    checked={feeData.grade_ids.includes(grade.id)}
                                />
                            ))}
                        {isGradeAndTermDisabled && <p className="text-muted">Grade selection is disabled for Admission fees.</p>}
                    </Form.Group>
                    <Form.Group controlId="term" className="mt-3">
                        <Form.Label>Term</Form.Label>
                        <Form.Control
                            as="select"
                            name="term"
                            value={feeData.term}
                            onChange={handleChange}
                            disabled={isGradeAndTermDisabled}
                        >
                            <option value="">Select Term</option>
                            {terms.map((term) => (
                                <option key={term.id} value={term.id}>
                                    {term.name}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="amount" className="mt-3">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control
                            type="number"
                            name="total_amount"
                            value={feeData.total_amount}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <br />
                    <SubmitButton text="Create Fee" isLoading={isLoading} />
                </Form>
            )}
        </div>
    );
};

export default CreateFee;
