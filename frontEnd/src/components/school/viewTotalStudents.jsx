import React, { useEffect, useState } from "react";
import { fetchData } from "../../service/apiservice";
import { Card, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ViewTotalStudents = () => {
    const [totalStudents, setTotalStudents] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [school, setSchool] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const getTotalStudents = async () => {
            try {
                const data = await fetchData("school/total_students/");
                setTotalStudents(data.total_students || 0); // Fallback for undefined data
                setSchool(data.school || "Unknown School"); // Fallback for undefined school
                console.log("Total students:", data);
            } catch (err) {
                console.error("Error fetching total students:", err.message);
            } finally {
                setIsLoading(false);
            }
        };

        getTotalStudents();
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
                    bg="success"
                    text="white"
                    style={{ width: "auto", height: "10rem", margin: "0 auto" }}
                    className="text-center"
                >
                    <Card.Body onClick={handleClick}>
                        <Card.Title>Total Students</Card.Title>
                        <Card.Text style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                            {totalStudents}
                        </Card.Text>
                    </Card.Body>
                </Card>
            )}
        </div>
    );
};

export default ViewTotalStudents;
