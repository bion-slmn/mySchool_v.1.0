import { updateData } from "../../service/apiservice";
import { toast } from "react-toastify";
import Form from "react-bootstrap/Form";
import SubmitButton from "../submitButton";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../service/authService";
import { useState, useEffect } from "react";

const UpdateTerm = () => {
    const location = useLocation();
    const { term = {}, term_id } = location.state || {};
    const [terminfo, setTermInfo] = useState({
        termName: term.name || "",
        startDate: term.start_date || "",
        endDate: term.end_date || "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const { checkTokenAndRefresh } = useAuth();
    const navigate = useNavigate();

    // Handle input changes
    const handleInput = (e) => {
        setTermInfo({ ...terminfo, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const payload = {
                name: terminfo.termName,
                start_date: terminfo.startDate,
                end_date: terminfo.endDate,
            };
            await checkTokenAndRefresh();
            const endpoint = `school/term/update/${term_id}`;
            await updateData(endpoint, payload);
            toast.success("Term updated successfully!");
            navigate("/school"); // Navigate after success
        } catch (error) {
            console.error("Error updating term data:", error);
            toast.error(error?.response?.data?.message || "Failed to update term. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!term_id) {
            toast.error("Invalid term data. Please try again.");
            navigate("/viewTerm"); // Redirect to terms view if no term is found
        }
    }, [term_id, navigate]);

    return (
        <div className="container mt-4">
            <h1>Update Term</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Term Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="termName"
                        value={terminfo.termName}
                        onChange={handleInput}
                        required
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                        type="date"
                        name="startDate"
                        value={terminfo.startDate}
                        onChange={handleInput}
                        required
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                        type="date"
                        name="endDate"
                        value={terminfo.endDate}
                        onChange={handleInput}
                        required
                    />
                </Form.Group>
                <SubmitButton isLoading={isLoading} text="Update Term" />
            </Form>
        </div>
    );
};

export default UpdateTerm;
