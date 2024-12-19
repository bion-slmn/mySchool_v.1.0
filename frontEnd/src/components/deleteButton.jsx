import React from "react";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import { useAuth } from "../service/authService";
import { deleteData } from "../service/apiservice";

const DeleteButton = ({ endpoint, onSuccess, label = "Delete" }) => {
    const { checkTokenAndRefresh } = useAuth();

    const handleDelete = async () => {
        try {
            await checkTokenAndRefresh();
            await deleteData(endpoint);
            toast.success("Deleted successfully!");
            if (onSuccess) {
              onSuccess();
            } 
        } catch (error) {
            console.error("Error deleting:", error, error.message);
            toast.error(error.message || "Failed to delete. Please try again.");
        }
    };

    return (
        <Button variant="danger" onClick={handleDelete} size="sm">
            {label}
        </Button>
    );
};

export default DeleteButton;
