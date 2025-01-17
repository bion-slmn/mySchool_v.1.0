import React, { useEffect, useState } from "react";
import { fetchData } from "../../service/apiservice";
import { Card, Spinner, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ViewTotalExpense = () => {
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [days, setDays] = useState("30");
    const navigate = useNavigate();

    useEffect(() => {
        const getTotalExpenses = async () => {
            try {
                const data = await fetchData(`expense/total/?days=${days}`);
                setTotalExpenses(data || 0); // Fallback for undefined data
                console.log("Total Expenses:", data);
            } catch (err) {
                console.error("Error fetching total Expenses:", err.message);
            } finally {
                setIsLoading(false);
            }
        };

        getTotalExpenses();
    }, [days]);

    const handleDaysChange = (event) => {
        setDays(event.target.value);
        setIsLoading(true); // Show spinner while fetching new data
    };

    const handleClick = () => {
        console.log("Card clicked!");
        navigate("/expense");
    };

    return (
        <div className="container my-4">
            {isLoading ? (
                <div className="d-flex justify-content-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <Card
                    bg="danger"
                    text="white"
                    style={{ width: "18rem", margin: "0 auto" }} // Centering card
                    className="text-center"
                    onClick={handleClick}
                >
                    <Card.Body>
                        <Card.Title>Expenses for the Last</Card.Title>
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
                            {totalExpenses}
                        </Card.Text>
                    </Card.Body>
                </Card>
            )}
        </div>
    );
};

export default ViewTotalExpense;
