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


// view a specific student
export const ViewStudent = () => {
    const [student, setStudent] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { checkTokenAndRefresh } = useAuth();
    const location = useLocation();

    const {student_id} = location.state;

    useEffect(() => {
        const getStudent = async () => {
            try {
                await checkTokenAndRefresh();
                const data = await fetchData(`student/view/${student_id}/`);
                setStudent(data);
            } catch (err) {
                console.error("Error fetching student:", err.message);
                toast.error(err.message || "Failed to fetch student data. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        getStudent();
    }, [student_id]);

    const handleUpdate = (student) => {
        toast.info("Redirecting to update student...");
        navigate("/updateStudent", { state: { student } });
    };

    const handleDelete = (student_id) => {
        setStudent((prevStudent) => prevStudent.filter((student) => student.id !== student_id));
        return null
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
                        <Card.Title>{student.name}</Card.Title>
                        <Card.Text>{student.date_of_birth}</Card.Text>
                        <Card.Text>{student.gender}</Card.Text>
                        <Card.Text>{student.grade_name}</Card.Text>
                        <Button
                            variant="primary"
                            onClick={() => handleUpdate(student)}
                            className="me-2">Update</Button>
                        <DeleteButton
                            endpoint={`student/delete/${student_id}`}
                            onSuccess={() => handleDelete(student_id)}  />
                    </Card.Body>
                </Card>
            )}
        </div>
    );

};

// view all students in the school or a specific grade
export const ViewAllStudents = ({gradeId=null}) => {
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { checkTokenAndRefresh } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const getStudents = async () => {
            const endpoint = gradeId ? `student/grade/${gradeId}/` : "student/view-all/";
            try {
                await checkTokenAndRefresh();
                const data = await fetchData(endpoint);
                setStudents(data);
            } catch (err) {
                console.error("Error fetching students:", err.message);
                toast.error(err.message || "Failed to fetch student data. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        getStudents();
    }, [checkTokenAndRefresh]);

    const handleStudentClick = (student_id) => {
        navigate("/viewStudent", { state: { student_id } });
    };

    const handleGradeClick = (grade_id) => {
        navigate("/viewGrade", { state: { grade_id } });
    };

    return (
        <div className="container">
            {isLoading ? (
                <div className="d-flex justify-content-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Gender</th>
                            <th>Grade</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student.id} onClick={() => handleStudentClick(student.id)} style={{ cursor: "pointer" }}>
                                <td>{student.name}</td>
                                <td>{student.gender}</td>
                                <td
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent navigating to student view
                                        handleGradeClick(student.grade.id);
                                    }}
                                    style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
                                >
                                    {student.grade_name}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};
