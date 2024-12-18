import DeleteButton from "../deleteButton";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../service/authService";
import { toast } from "react-toastify";
import { fetchData } from "../../service/apiservice";
import React, { useEffect, useState } from "react";
import { Card, Spinner } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";


const ViewGrades = () => {
    const [grades, setGrades] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Set loading initially to true
    const navigate = useNavigate();
    const { checkTokenAndRefresh } = useAuth();

    useEffect(() => {
        const getGrades = async () => {
            try {
                await checkTokenAndRefresh();
                const data = await fetchData("class/view/");
                setGrades(data);
            } catch (err) {
                console.error("Error fetching grades:", err.message);
                toast.error(err.message || "Failed to fetch grade data. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        getGrades();
    }, [checkTokenAndRefresh]);

    const handleUpdate = (grade) => {
        toast.info("Redirecting to update grade...");
        navigate("/updateGrade", { state: { grade } });
        console.log("Update button clicked!");
    };

    const handleDelete = (grade_id) => {
        setGrades((prevGrades) => prevGrades.filter((grade) => grade.id !== grade_id));
    }

    return (
        <div className="container">
            {isLoading ? (
                <div className="d-flex justify-content-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : grades.length > 0 ? (
                <Row>
                    {grades.map((grade) => (
                        <Col md={4} sm={6} xs={12} key={grade.id} className="mb-4">
                            <Card>
                                <Card.Body>
                                    <Card.Title>{grade.name}</Card.Title>
                                    <Card.Text>{grade.description}</Card.Text>
                                    <Button
                                        variant="primary"
                                        onClick={() => handleUpdate(grade)}
                                        className="me-2"
                                    >
                                        Update
                                    </Button>
                                    <DeleteButton 
                                    endpoint={`class/delete/${grade.id}`} 
                                    onSuccess={() => handleDelete(grade.id)} 
                                />
                                </Card.Body>
                                
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : (
                <p>No grade data available.</p>
            )}
        </div>
    );
};

export default ViewGrades;
