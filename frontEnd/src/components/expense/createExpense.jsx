// create and expense
import { fetchData, postData } from "../../service/apiservice";
import { useAuth } from "../../service/authService";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import { Form, Spinner } from "react-bootstrap";
import SubmitButton from "../submitButton";


export const CreateExpense = () => {
    const [loading, setLoading] = useState(false);
    const [term, setTerm] = useState([]);
    const [expense, setExpense] = useState({
        amount: "",
        description: "",
        term: "",
        name: "",
    });
    const { checkTokenAndRefresh } = useAuth();

    checkTokenAndRefresh();
    useEffect(() => {
        const fetchDataAsync = async () => {
            try {
                const termData = await fetchData("school/term/view/");
                setTerm(termData);
            } catch (err) {
                console.error("Error fetching data:", err.message);
                toast.error(err.message || "Failed to fetch data. Please try again.");
            }
        };
        setLoading(true)
        fetchDataAsync();
        setLoading(false)
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setExpense({ ...expense, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await postData("expense/create/", expense);
            toast.success("Expense created successfully");
        } catch (err) {
            console.error("Error creating expense:", err.message);
            toast.error(err.message || "Failed to create expense. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h3>Create Expense</h3>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={expense.name}
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        type="text"
                        name="description"
                        value={expense.description}
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="amount">
                    <Form.Label>Amount</Form.Label>
                    <Form.Control
                        type="number"
                        name="amount"
                        value={expense.amount}
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="term">
                    <Form.Label>Term</Form.Label>
                    <Form.Control
                        as="select"
                        name="term"
                        value={expense.term}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select Term</option>
                        {term.map((term) => (
                            <option key={term.id} value={term.id}>
                                {term.name}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>
                <br />

                <SubmitButton isLoading={loading} text="Create Expense" />
            </Form>
        </div>
    )
}

export default CreateExpense;