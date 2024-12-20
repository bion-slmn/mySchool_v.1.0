import { useState } from "react";
import { ViewAllStudents } from "../components/students/viewStudent";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../service/authService";
import { useLocation } from "react-router-dom";
import CreateStudent from "../components/students/createStudent";
import { Button } from "react-bootstrap";

const ViewStudentsinGrade = () => {
    const navigate = useNavigate();
    const { checkTokenAndRefresh } = useAuth();
    const location = useLocation();
    const { grade } = location.state;

    const [isCreating, setIsCreating] = useState(false); // State to toggle views

    const toggleView = () => {
        setIsCreating((prev) => !prev); // Toggle between views
    };

    return (
        <div className="container">
            <br />
            <Button onClick={toggleView} variant="success">
                {isCreating ? "View Students" : "Add a Student"}
            </Button>
            <br />
            <h2>{isCreating ? "Add a Student" : `View Students of ${grade.name}`}</h2>
            <br />
            {isCreating ? (
                <CreateStudent grade={grade} />
            ) : (
                <ViewAllStudents grade={grade} />
            )}
        </div>
    );
};

export default ViewStudentsinGrade;
