import { fetchData, postData } from "../../service/apiservice";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import { Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import DeleteButton from "../deleteButton";


export const ViewExpenseInTerm = () => {
    const [term, setTerm] = useState([]); // Initialize as an empty array
    const [expense, setExpense] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedTerm, setSelectedTerm] = useState(""); // Store selected term ID
    const navigate = useNavigate();

    const fetchDataAsync = async (url, setData, errorMessage) => {
        setLoading(true);
        try {
            const data = await fetchData(url);
            setData(data);
        } catch (err) {
            console.error(errorMessage, err.message);
            toast.error(err.message || errorMessage);
        }
        setLoading(false);
    };

    // Fetch terms on component mount
    useEffect(() => {
        fetchDataAsync("school/term/view/", setTerm, "Error fetching term data:");
    }, []);

    // Fetch expenses when a term is selected
    useEffect(() => {
        if (!selectedTerm) return;
        fetchDataAsync(`expense/term?term_id=${selectedTerm}`, setExpense, "Error fetching expense data:");
    }, [selectedTerm]);

    // Handle term selection
    const handleInputChange = (e) => {
        setSelectedTerm(e.target.value); // Update selectedTerm with the selected term ID
    };

    const calculateTotal = (expense) => {
        return expense.reduce((acc, curr) => acc + curr.amount, 0);
    }

    const onExpenseClick = (expense) => {
        // pass the id of the expense to the viewExpenseDetail component
        navigate("/viewExpenseDetail", { state: { expense: expense } });

    }

    return (
        <div className="container">

            <h3>View Expense in a term</h3>
            <br />
            <Form.Group controlId="term">
                <Form.Label>Select Term</Form.Label>
                <Form.Control
                    as="select"
                    name="term"
                    value={selectedTerm} // Bind to selectedTerm
                    onChange={handleInputChange} // Update selectedTerm on change
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
            <h4>Expenses</h4>
            {loading ? (
                <Spinner animation="border" />
            ) : (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expense.map((exp) => (
                            <tr key={exp.id} onClick={() => onExpenseClick(exp)}>
                                <td>{exp.name}</td>
                                <td>{exp.amount}</td>
                            </tr>
                        ))}
                        <tr>
                            <td>Total</td>
                            <td>{calculateTotal(expense)}</td>
                        </tr>
                    </tbody>
                </table>
            )}
        </div>
    );
};

export const ViewAnExpenseDetail = () => {
    const [expense, setExpense] = useState({});
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const expensePassed = location.state.expense;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExpense = async () => {
            setLoading(true);
            try {
                const data = await fetchData(`expense/view/?expense_id=${expensePassed.id}`);
                setExpense(data);
                console.log(data, 33333333333);
            } catch (err) {
                console.error("Error fetching expense data:", err.message);
                toast.error(err.message || "Error fetching expense data");
            } finally {
                setLoading(false);
            }
        };

        fetchExpense();
    }, []);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleDelete = () => {
        setExpense(null)
        // navigate("/);
    }

    return (
        <div className="container">
            <br />
            <h3>Expense Detail</h3>
            {loading ? (
                <Spinner animation="border" />
            ) : (
                <Card>
                    <Card.Body>
                        <Card.Title>Name: {expense.name}</Card.Title>
                        <Card.Text>
                            <strong>Amount:</strong> {expense.amount}
                        </Card.Text>
                        <Card.Text>
                            <strong>Description:</strong> {expense.description || "None"}
                        </Card.Text>
                        <Card.Text>
                            <strong>Term:</strong> {expense.term_name || "N/A"}
                        </Card.Text>
                        <Card.Text>
                            <strong>Date Created:</strong> {formatDate(expense.created) || "N/A"}
                        </Card.Text>
                        <Card.Text>
                            <strong>Date Updated:</strong> {formatDate(expense.modified) || "N/A"}
                        </Card.Text>
                        <Button variant="primary" size="sm" onClick={() => navigate("updateExpense", { state: { expense } })} className="me-2"> Update</Button>
                        <DeleteButton endpoint={`expense/delete/?expense_id=${expense.id}`} handleDelete={handleDelete} />
                    </Card.Body>

                </Card>
            )}
        </div>
    );
}