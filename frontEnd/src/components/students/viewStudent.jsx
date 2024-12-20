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
                console.log(data);
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
            <br />
            <h2>Details of {student.name} </h2>
            {isLoading ? (
                <div className="d-flex justify-content-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <Card>
                    <Card.Body>
                        <Card.Title>Name: {student.name}</Card.Title>
                        <Card.Text>DOB: {student.date_of_birth}</Card.Text>
                        <Card.Text>Gender: {student.gender}</Card.Text>
                        <Card.Text>Grade: {student.grade_name}</Card.Text>
                        <Card.Text>Date Joined: {new Date(student.created).toLocaleDateString()}</Card.Text>

                        <Button
                            variant="primary"
                            onClick={() => handleUpdate(student)}
                            className="me-2" size="sm">Update</Button>
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
export const ViewAllStudents = ({grade=null}) => {
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { checkTokenAndRefresh } = useAuth();
    const navigate = useNavigate();
    const gradeId = grade?.id;
    const gradeName = grade?.name;

    useEffect(() => {
        const getStudents = async () => {
            const endpoint = gradeId ? `student/grade/${gradeId}/` : "student/view-all/";
            try {
                await checkTokenAndRefresh();
                const data = await fetchData(endpoint);
                console.log(data);
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
                                >
                                    {student.grade_name || gradeName}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};
