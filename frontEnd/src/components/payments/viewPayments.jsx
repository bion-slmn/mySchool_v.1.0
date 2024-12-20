import DeleteButton from "../deleteButton";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../service/authService";
import { fetchData } from "../../service/apiservice";
import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Table, Spinner, Card } from "react-bootstrap";
import Button from "react-bootstrap/Button";



export const ViewPaymentonFee = () => {
    const [payments, setPayments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { checkTokenAndRefresh } = useAuth();
    const location = useLocation();
    let { fee_id, total_amount, fee } = location.state;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDataAsync = async () => {
            if (!fee_id) {
                fee_id = fee.id;
                total_amount = fee.total_amount;
            }
            console.log("Fee ID:", fee_id, total_amount, fee);

            try {
                await checkTokenAndRefresh();
                const paymentData = await fetchData(`payment/view/${fee_id}`);
                setPayments(paymentData);
            } catch (err) {
                console.error("Error fetching data:", err.message);
                toast.error(err.message || "Failed to fetch data. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        if (fee_id) {
            fetchDataAsync();
        }
    }, [fee_id, checkTokenAndRefresh]);

    const handleBalance = (total_payments) => {
        return total_payments - total_amount;
    };

    const getBalanceStyle = (balance) => {
        return {
            backgroundColor: balance < 0 ? "orange" : "green",
            color: "white", // Ensure text is readable
            fontWeight: "bold",
            textAlign: "center", // Center the text in the cell
        };
    };

    const handleClick = (payment) => {
        toast.info("Redirecting to view payments...");
        navigate("/viewPayments", { state: { payment, fee_id } });
    }

    
    if (!setIsLoading && payments.length === 0) {
        return (
            <div className="container">
                <h3>No payments found</h3>
            </div>
        );
    }

    return (
        <div className="container">
            <h3>Payments</h3>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Student</th>
                        <th>Amount</th>
                        <th>Balance</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan="4" className="text-center">
                                <Spinner animation="border" role="status">
                                    <span className="sr-only">Loading...</span>
                                </Spinner>
                            </td>
                        </tr>
                    ) : (
                        payments.map((payment, index) => {
                            const balance = handleBalance(payment.total_payments);
                            return (
                                <tr key={payment.student__id} onClick={() => handleClick(payment)}>
                                    <td>{index + 1}</td>
                                    <td>{payment.student__name}</td>
                                    <td>{payment.total_payments}</td>
                                    <td style={getBalanceStyle(balance)}>
                                        {balance}
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </Table>
        </div>
    );
};



const ViewPaymentonStudent = () => {
    const [payments, setPayments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { checkTokenAndRefresh } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const { payment, fee_id } = location.state;
    const { student_id, student } = payment; 
    const studentId = student_id || student;
 
    useEffect(() => {
        
        const endpoint = `payment/student/?student_id=${studentId}&fee_id=${fee_id}`;
        console.log("Endpoint:", endpoint, payment);
        const fetchDataAsync = async () => {
            try {
                await checkTokenAndRefresh();
                const paymentData = await fetchData(endpoint);
                console.log("Payment data:", paymentData);
                setPayments(paymentData);
            } catch (err) {
                console.error("Error fetching data:", err.message);
                toast.error(err.message || "Failed to fetch data. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        if (studentId) {
            fetchDataAsync();
        }
    }, [studentId, fee_id, checkTokenAndRefresh]);

    const handleRowClick = (payment) => {
        navigate("PaymentDetails", { state: { payment } });
    };

    return (
        <div className="container">
            <h3>Payments</h3>
            <h4>Total: {payment.total_payments}</h4>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Amount</th>
                        <th>Date Paid</th>
                        <th>Payment Method</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan="5" className="text-center">
                                <Spinner animation="border" role="status">
                                    <span className="sr-only">...</span>
                                </Spinner>
                            </td>
                        </tr>
                    ) : (
                        payments.map((payment, index) => (
                            <tr
                                key={payment.id}
                                onClick={() => handleRowClick(payment)}
                                style={{ cursor: "pointer" }}
                            >
                                <td>{index + 1}</td>
                                <td>{payment.student_name || "Unknown"}</td>
                                <td>{payment.amount}</td>
                                <td>{payment.date_paid}</td>
                                <td>{payment.payment_method}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>
        </div>
    );
};



const ViewPaymentDetails = () => {
    const location = useLocation();
    const { payment } = location.state;
    const navigate = useNavigate();
    const [paymentData, setPaymentData] = useState(payment);

    const handleUpdate = () => {
        navigate("updatePayment", { state: { payment } });
    };

    const handleDelete = async () => {
        toast.success("Payment deleted successfully.");
        navigate("/viewPayments", { state: { payment: paymentData, fee_id : paymentData.fee } });
        

    };

    return (
        <div className="container">
            <Card>
                <Card.Body>
                    <Card.Title>Payment Details</Card.Title>
                    <Card.Text>
                        <strong>Student:</strong> {paymentData.student_name || "N/A"}
                    </Card.Text>
                    <Card.Text>
                        <strong>Amount:</strong> {paymentData.amount || "N/A"}
                    </Card.Text>
                    <Card.Text>
                        <strong>Date Paid:</strong> {paymentData.date_paid || "N/A"}
                    </Card.Text>
                    <Card.Text>
                        <strong>Payment Method:</strong> {paymentData.payment_method || "N/A"}
                    </Card.Text>
                    <Button variant="primary" onClick={handleUpdate} className="me-2">
                        Update
                    </Button>
                    <DeleteButton endpoint={`payment/delete/${paymentData.id}/`} onSuccess={handleDelete} />
                </Card.Body>
            </Card>
        </div>
    );
};

export { ViewPaymentDetails, ViewPaymentonStudent };
