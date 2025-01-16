import { updateData } from "../../service/apiservice";
import { useAuth } from "../../service/authService";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import { Form, Spinner } from "react-bootstrap";
import SubmitButton from "../submitButton";
import { useLocation, useNavigate } from "react-router-dom";

export const UpdateExpense = () => {
    const [loading, setLoading] = useState(false);
    const [expense, setExpense] = useState({});
    const location = useLocation();
    const navigate = useNavigate();
    const { checkTokenAndRefresh } = useAuth();

    const expensePassed = location.state.expense;

    // Initialize expense on mount
    useEffect(() => {
        setExpense(expensePassed || {}); // Set to an empty object if no expense is passed
        checkTokenAndRefresh(); // Ensure token refresh happens only once
    }, [expensePassed, checkTokenAndRefresh]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setExpense({ ...expense, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateData(`expense/update/?expense_id=${expensePassed.id}`, expense);
            toast.success("Expense updated successfully");
            navigate("/viewExpenseDetail", { state: { expense } });
        } catch (err) {
            console.error("Error updating expense:", err.message);
            toast.error(err.message || "Failed to update expense. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h3>Update Expense</h3>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={expense.name || ""} // Handle potential undefined values
                        onChange={handleInputChange}
                        placeholder="Enter expense name"
                    />
                </Form.Group>
                <Form.Group controlId="amount">
                    <Form.Label>Amount</Form.Label>
                    <Form.Control
                        type="number"
                        name="amount"
                        value={expense.amount || ""} // Handle potential undefined values
                        onChange={handleInputChange}
                        placeholder="Enter expense amount"
                    />
                </Form.Group>
                <Form.Group controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="description"
                        value={expense.description || ""} // Handle potential undefined values
                        onChange={handleInputChange}
                        placeholder="Enter expense description"
                    />
                </Form.Group>
                <SubmitButton isLoading={loading} text="Update Expense" />
            </Form>
        </div>
    );
};
