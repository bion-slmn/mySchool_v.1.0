import React from 'react';
import { Form, Button } from 'react-bootstrap';

const AdmitorNewStudent = ({ nextStep, handleInputChange, formData }) => {
    return (
        <div className='container'>
            <h3>Admission Type</h3>
            <Form.Group className="mb-3 c" >
                <Form.Label>Select Admission</Form.Label>
                <Form.Control
                    as="select"
                    name="admissionType"  // Change name to something more descriptive
                    value={formData.admissionType}  // Bind to formData
                    onChange={handleInputChange}  // Handle input change
                    required
                >
                    <option value="">Select...</option>
                    <option value="new">New Admission</option>
                    <option value="old">Old Student</option>
                </Form.Control>
            </Form.Group>

            {formData.admissionType && (
                <Button onClick={nextStep}>Next</Button>
            )}
        </div>
    );
}

export default AdmitorNewStudent;
