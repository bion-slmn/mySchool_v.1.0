import { useAuth } from "../../service/authService";
import { Form } from "react-bootstrap";
import { useState } from "react";
import SubmitButton from "../submitButton";
import { postData } from "../../service/apiservice";
import { toast } from "react-toastify";


const CreateTerm = () => {
    const [terminfo, setTermInfo] = useState({name: "", start_date: "", end_date: ""});
    const [loading, setLoading] = useState(false);
    const { checkTokenAndRefresh } = useAuth();

    const handleChange = (e) => {
        setTermInfo({...terminfo, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await checkTokenAndRefresh();
            const response = await postData("school/term/create/", terminfo);
            toast.success("Term created successfully");
        } catch (error) {
            console.error("Error creating term", error);
            toast.error(error.message || "Error creating term");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h1>Create Term</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" name="name" value={terminfo.name} onChange={handleChange} />
                </Form.Group>
                <Form.Group controlId="start_date">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control type="date" name="start_date" value={terminfo.start_date} onChange={handleChange} />
                </Form.Group>
                <Form.Group controlId="end_date">
                    <Form.Label>End Date</Form.Label>
                    <Form.Control type="date" name="end_date" value={terminfo.end_date} onChange={handleChange} min={terminfo.start_date}/>
                </Form.Group>
                <SubmitButton loading={loading} text="Create Term" />
            </Form>
        </div>
    );  
};

export default CreateTerm;