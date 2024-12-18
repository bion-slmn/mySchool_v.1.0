import React, { useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { updateData } from "../../service/apiservice";

const UpdateButton = ({ endpoint, data, onSuccess, buttonText}) => {
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const response = await updateData(endpoint, data);
            toast.success("Update successful!");
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            toast.error(error.message || "Failed to update. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            variant="primary"
            onClick={handleUpdate}
            disabled={loading }  // Disables button during loading
            className="me-2"
        >
            {loading || isLoading ? (
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
            ) : (
                buttonText || "Update"
            )}
        </Button>
    );
};

export default UpdateButton;
