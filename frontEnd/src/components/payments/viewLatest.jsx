import React, { useEffect, useState } from "react";
import { fetchData } from "../../service/apiservice";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { Table, Spinner, Card, Button, Form } from "react-bootstrap";

const ViewLatestPayments = () => {
    const [payments, setPayments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [feeType, setFeeType] = useState("TERM");
    const [startDate, setStartDate] = useState(dayjs().startOf("week").format("YYYY-MM-DD"));
    const [endDate, setEndDate] = useState(dayjs().endOf("week").format("YYYY-MM-DD"));

    useEffect(() => {
        if (startDate && endDate && feeType) {
            const fetchDataAsync = async () => {
                setIsLoading(true);
                try {
                    const paymentData = await fetchData(
                        `payment/period/?start_date=${startDate}&end_date=${endDate}&fee_type=${feeType}`
                    );
                    setPayments(paymentData);
                } catch (err) {
                    console.error("Error fetching data:", err.message);
                    toast.error(err.message || "Failed to fetch data. Please try again.");
                } finally {
                    setIsLoading(false);
                }
            };
            fetchDataAsync();
        }
    }, [startDate, endDate, feeType]);

    return (
        <Card className="p-4">
            <h3>Latest Payments</h3>
            <div className="mb-3 d-flex align-items-center">
                <Form.Group className="me-3">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="me-3">
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="me-3">
                    <Form.Label>Fee Type</Form.Label>
                    <Form.Select value={feeType} onChange={(e) => setFeeType(e.target.value)}>
                        <option value="ADMISSION">Admission Fee</option>
                        <option value="TERM">Term Fee</option>
                        <option value="ONCE">One-time Fee</option>
                        <option value="DAILY">Daily Fee</option>
                    </Form.Select>
                </Form.Group>
                <Button onClick={() => setPayments([])} disabled={isLoading}>
                    Reset Filters
                </Button>
            </div>
            {isLoading ? (
                <div className="text-center">
                    <Spinner animation="border" />
                </div>
            ) : payments.length > 0 ? (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Amount</th>
                            <th>Date Paid</th>
                            <th>Payment method</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((payment) => (
                            <tr key={payment.id}>
                                <td>{payment.student_name}</td>
                                <td>{payment.amount}</td>
                                <td>{dayjs(payment.date_paid).format("YYYY-MM-DD")}</td>
                                <td>{payment.payment_method}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <p className="text-center">No payments found for the selected filters.</p>
            )}
        </Card>
    );
};

export default ViewLatestPayments;
