import React, { useEffect, useState } from "react";
import { fetchData } from "../../service/apiservice";
import { Card, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ViewTotalgrades = () => {
    const [total_grades, setTotal_grades] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const getTotal_grades = async () => {
            try {
                const data = await fetchData("class/total/");
                setTotal_grades(data || 0); // Fallback for undefined data
                // Fallback for undefined school
                console.log("Total gradestotal_grades:", data);
            } catch (err) {
                console.error("Error fetching total grades:", err.message);
            } finally {
                setIsLoading(false);
            }
        };

        getTotal_grades();
    }, []);

    const handleClick = () => {
        navigate("/grades");
    }

    return (
        <div className="container my-4">
            {isLoading ? (
                <div className="d-flex justify-content-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <Card
                    bg="info"
                    text="white"
                    style={{ width: "auto", height: "10rem", margin: "0 auto" }}
                    className="text-center"
                >
                    <Card.Body onClick={handleClick}>
                        <Card.Title>Grades</Card.Title>
                        <Card.Text style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                            {total_grades}
                        </Card.Text>
                    </Card.Body>
                </Card>
            )}
        </div>
    );
};

export default ViewTotalgrades;
