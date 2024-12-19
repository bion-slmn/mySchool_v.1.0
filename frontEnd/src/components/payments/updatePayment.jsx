import { updateData } from "../../service/apiservice";
import { toast } from "react-toastify";
import Form from "react-bootstrap/Form";
import SubmitButton from "../submitButton";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../service/authService";
import { useState, useEffect } from "react";

const UpdatePayment = () => {
    const location = useLocation();
    const { payment } = location.state || {};  // Access payment data from state
    const [paymentData, setPaymentData] = useState(payment);
    const [isLoading, setIsLoading] = useState(false);
    const { checkTokenAndRefresh } = useAuth();
    const navigate = useNavigate();

    // Update state when input fields change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPaymentData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        setIsLoading(true);
        if (payment === paymentData) {
            toast.info("No changes made to payment data");
            setIsLoading(false);
            console.log("No changes made to payment data", paymentData);
            navigate("/viewPayments", { state: { payment: paymentData, fee_id : paymentData.fee } });
        }
        e.preventDefault();
        try {
            await checkTokenAndRefresh();
            await updateData(`payment/update/${payment.id}/`, paymentData);
            toast.success("Payment updated successfully");
            navigate("/viewPayments", { state: { payment, fee_id : paymentData.fee } });
        } catch (err) {
            console.error("Error updating payment:", err.message);
            toast.error(err.message || "Failed to update payment. Please try again.");
        }
        setIsLoading(false);
    };

    if (!payment) {
        toast.error("Payment data not found!");
        navigate("/viewPayments");
        return;
    }
    

    return (
        <div className="container">
            <h1>Update Payment for {payment.student_name}</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="amount">
                    <Form.Label>Amount</Form.Label>
                    <Form.Control
                        type="number"
                        name="amount"
                        value={paymentData.amount || ""}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="payment_date">
                    <Form.Label>Payment Date</Form.Label>
                    <Form.Control
                        type="date"
                        name="payment_date"
                        value={paymentData.date_paid || ""}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="payment_method">
                    <Form.Label>Payment Method</Form.Label>
                    <Form.Control
                        as="select"
                        name="payment_method"
                        value={paymentData.payment_method || ""}
                        onChange={handleChange}
                        required
                    >
                        <option value="CASH">Cash</option>
                        <option value="BANK">Bank</option>
                        <option value="MOBILE">Mobile</option>
                    </Form.Control>
                </Form.Group>
                <br/>
                <SubmitButton text={'Update Payment'} isLoading={isLoading}/>
            </Form>
        </div>
    );
};

export { UpdatePayment };
