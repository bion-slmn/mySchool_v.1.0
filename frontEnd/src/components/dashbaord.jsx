import React, { useState, useEffect } from "react";
import { Row, Col, Button, Card, ProgressBar, Form } from "react-bootstrap";
import { toast } from "react-toastify"; // Assuming you are using toast for error messages
import { useAuth } from "../service/authService";
import { fetchData } from "../service/apiservice";
import { useNavigate } from "react-router-dom";
import { PageLoading } from "./loadingIcon";

const PaymentCardinGrade = () => {
    const [paymentData, setPaymentData] = useState([]);
    const [gradeData, setGradeData] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { checkTokenAndRefresh } = useAuth();
    const navigate = useNavigate(); // Initialize navigate function

    const fetchData_ = async (endpoint, setFunc) => {
        try {
            setIsLoading(true);
            await checkTokenAndRefresh();
            const response = await fetchData(endpoint);
            setFunc(response);
        } catch (error) {
            console.error("Error fetching data: ", error);
            toast.error("Error fetching data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Fetch the list of grades on component mount
        fetchData_("class/view", setGradeData);
    }, []);

    useEffect(() => {
        // Automatically select the first grade as default when gradeData is fetched
        if (gradeData.length > 0 && !selectedGrade) {
            setSelectedGrade(gradeData[0].id);
        }
    }, [gradeData, selectedGrade]);

    useEffect(() => {
        if (selectedGrade) {
            // Fetch payment data when a grade is selected
            fetchData_(`payment/grade/${selectedGrade}`, setPaymentData);
        }
    }, [selectedGrade]);

    const handleGradeSelect = (event) => {
        const selectedGradeId = event.target.value;
        setSelectedGrade(selectedGradeId);
        setPaymentData([]);
    };

    const handleClicked = (fee) => {
        console.log("Clicked");
        // Use navigate function to programmatically navigate
        navigate("/viewPaymentsonFee", { state: { fee } });
    };

    return (
        <div className="container">
            <br />
            <Form>
                {/* Render grades as options inside a select dropdown */}
                <Form.Group>
                    <Form.Label>Select a Grade to view Payments</Form.Label>
                    <Form.Control as="select" onChange={handleGradeSelect} value={selectedGrade || ""}>
                        <option value="">-- Select Grade --</option>
                        {gradeData.map((grade) => (
                            <option key={grade.id} value={grade.id}>
                                {grade.name}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>
            </Form>

            {isLoading && <PageLoading />}

            {selectedGrade && (
                <div>
                    <br />
                    <h5>Payments</h5>
                    <Row>
                        {paymentData.fees &&
                            paymentData.fees.map((fee) => {
                                const percentagePaid =
                                    (fee.total_paid / (fee.total_amount * paymentData.students)) * 100;

                                return (
                                    <Col xs={12} sm={6} md={4} lg={3} key={fee.id} className="mb-4">
                                        <Card onClick={() => handleClicked(fee)} style={{ cursor: "pointer" }}>
                                            <Card.Body>
                                                <Card.Title>{fee.name}</Card.Title>
                                                <Card.Subtitle className="mb-2 text-muted">
                                                    Amount: {fee.total_amount}
                                                </Card.Subtitle>
                                                <Card.Subtitle className="mb-2 text-muted">
                                                    Students: {paymentData.students}
                                                </Card.Subtitle>
                                                <Card.Subtitle className="mb-2 text-muted">
                                                    Paid: {fee.total_paid}
                                                </Card.Subtitle>
                                                <ProgressBar
                                                    now={percentagePaid}
                                                    label={`${percentagePaid.toFixed(2)}%`}
                                                />
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                );
                            })}
                    </Row>
                </div>
            )}

            {!selectedGrade && !isLoading && <div>Please select a grade to see payment details.</div>}
        </div>
    );
};

export default PaymentCardinGrade;
