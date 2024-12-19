import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import DeleteButton from "../deleteButton";
import { fetchData } from "../../service/apiservice";
import Button from "react-bootstrap/Button";


const ViewTerms = () => {
    const [terms, setTerms] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const getTerms = async () => {
            try {
                const data = await fetchData("school/term/view/");
                setTerms(data);
            } catch (err) {
                console.error("Error fetching terms:", err.message);
                toast.error(err.message || "Failed to fetch terms data. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        getTerms();
    }, []);

    const handleUpdate = (term, term_id) => {
        toast.info("Redirecting to update term...");
        navigate("/updateTerm", { state: { term, term_id } });
    };

    const handleDeleteSuccess = (term_id) => {
        setTerms((prevTerms) => prevTerms.filter((term) => term.id !== term_id));
    };
    

    if (loading) {
        return <p>Loading terms data...</p>;
    }

    return (
        <div className="container">
            <br />
            <h2>View Terms</h2>
            {terms && terms.length > 0 ? (
                <Row>
                    {terms.map((term) => (
                        <Col md={4} sm={6} xs={12} key={term.id} className="mb-4">
                            <Card>
                                <Card.Body>
                                    <Card.Title>{term.name}</Card.Title>
                                    <br />
                                    <Card.Subtitle className="mb-2 text-muted">
                                        Start Date: {term.start_date}
                                    </Card.Subtitle>
                                    <Card.Text>End Date: {term.end_date}</Card.Text>
                                    <Button
                                        variant="primary"
                                        onClick={() => handleUpdate(term, term.id)}
                                        className="me-2" size="sm" 
                                    >
                                        Update
                                    </Button>
                                    <DeleteButton
                                        endpoint={`school/term/delete/${term.id}`}
                                        onSuccess={() => handleDeleteSuccess(term.id)}
                                    />
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : (
                <p>No term data available.</p>
            )}
        </div>
    );
};

export default ViewTerms;
