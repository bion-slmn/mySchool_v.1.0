import DeleteButton from "../deleteButton";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../service/authService";
import { fetchData } from "../../service/apiservice";
import { Card, } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Table, Spinner } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { Selector } from "../Selector";

// view a specific fee, all feee deatial displayed in a card
export const ViewFee = () => {
    const [fee, setFee] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const { checkTokenAndRefresh } = useAuth();
    const location = useLocation();
    const {fee_id} = location.state;
    const navigate = useNavigate();

    useEffect(() => {
        const getFee = async () => {
            try {
                await checkTokenAndRefresh();
                const data = await fetchData(`fee/view/${fee_id}/`);
                setFee(data);
            } catch (err) {
                console.error("Error fetching fee:", err.message);
                toast.error(err.message || "Failed to fetch fee data. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        getFee();
    }, [fee_id]);

    const handleUpdate = (fee) => {
        toast.info("Redirecting to update fee...");
        navigate("/updateFee", { state: { fee } });
    };

    const handleDelete = (fee_id) => {
        setFee(null);
    };

    return (
        <div className="container">
            {isLoading ? (
                <div className="d-flex justify-content-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <Card>
                    <Card.Body>
                        <Card.Title>{fee.name}</Card.Title>
                        <Card.Text>Total: {fee.total_amount}</Card.Text>
                        <Card.Text>Total paid : {fee.total_paid}</Card.Text>
                        <Card.Text>Grade: {fee.grade_name}</Card.Text>
                        <Card.Text>{fee.description}</Card.Text>
                        <Button variant="primary" onClick={() => handleUpdate(fee)} className="me-2">Update</Button> 
                        <DeleteButton endpoint={`fee/delete/${fee.id}/`} handleDelete={handleDelete} />
                    </Card.Body>
                </Card>
            )}
        </div>
    );
};



export const ViewFeeInClassOrTerm = ({ type }) => {
    const [fees, setFees] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedId, setSelectedId] = useState(null); // Track selected term or grade
    const { checkTokenAndRefresh } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (selectedId) {
            const endpoint = type === "term"
                ? `fee/term/${selectedId}/`
                : `fee/grade/${selectedId}/`;

            const fetchFees = async () => {
                setIsLoading(true);
                try {
                    await checkTokenAndRefresh();
                    const data = await fetchData(endpoint);
                    setFees(data);
                } catch (err) {
                    toast.error(err.message || "Failed to fetch fees. Please try again.");
                } finally {
                    setIsLoading(false);
                }
            };

            fetchFees();
        }
    }, [selectedId, type, checkTokenAndRefresh]);

    const handleClick = (fee) => {
        console.log("Fee clicked:", fee);
        navigate("/viewFee", { state: { fee_id: fee.id } });
    };

    return (
        <div className="container">
            {/* Use Selector for both Term and Grade */}
            <Selector 
                onSelect={(id) => setSelectedId(id)} 
                endPoint={type === "term" ? "school/term/view/" : "class/view/"} 
                label={type === "term" ? "Term" : "Grade"}
            />
            <br />
            {selectedId ? (
                // Add heading to the table
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Total Amount</th>
                            <th>Total Paid</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fees.map((fee) => (
                            <tr key={fee.id} onClick={() => handleClick(fee)}>
                                <td>{fee.name}</td>
                                <td>{fee.total_amount}</td>
                                <td>{fee.total_paid}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <div className="d-flex justify-content-center">
                    Select a {type === "term" ? "term" : "grade"} to view fees.
                </div>
            )}
        </div>
    );
};
