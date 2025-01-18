import React, { useEffect, useState } from "react";
import { fetchData } from "../../service/apiservice";
import { Card, Spinner, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ViewTotalPayments = () => {
    const [totalPayments, setTotalPayments] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [days, setDays] = useState("30");
    const navigate = useNavigate();

    useEffect(() => {
        const getTotalPayments = async () => {
            try {
                const data = await fetchData(`payment/total/?days=${days}`);
                setTotalPayments(data || 0); // Fallback for undefined data
                console.log("Total payments:", data);
            } catch (err) {
                console.error("Error fetching total payments:", err.message);
            } finally {
                setIsLoading(false);
            }
        };

        getTotalPayments();
    }, [days]);

    const handleDaysChange = (event) => {
        setDays(event.target.value);
        setIsLoading(true); // Show spinner while fetching new data
    };

    const handleClick = () => {
        console.log("Card clicked!");
        navigate("/latestPayments");
    };

    return (
        <div className="container my-4">
            {isLoading ? (
                <div className="d-flex justify-content-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <Card
                    bg="secondary"
                    text="white"
                    style={{ width: "18rem", margin: "0 auto" }} // Centering card
                    className="text-center"
                    onClick={handleClick}
                >
                    <Card.Body>
                        <Card.Title>Payments for the Last</Card.Title>
                        <Form.Group controlId="daysSelect" className="mb-3">
                            <Form.Select
                                aria-label="Select days"
                                value={days}
                                onChange={handleDaysChange}
                            >
                                <option value="7">7 Days</option>
                                <option value="14">14 Days</option>
                                <option value="30">30 Days</option>
                                <option value="60">60 Days</option>
                                <option value="90">90 Days</option>
                            </Form.Select>
                        </Form.Group>
                        <Card.Text style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Kshs :
                            {totalPayments}
                        </Card.Text>
                    </Card.Body>
                </Card>
            )}
        </div>
    );
};

export default ViewTotalPayments;
