import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { useAuth } from "../service/authService";
import { deleteData } from "../service/apiservice";

const DeleteButton = ({ endpoint, onSuccess, label = "Delete" }) => {
    const { checkTokenAndRefresh } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        try {
            setLoading(true);
            await checkTokenAndRefresh();
            await deleteData(endpoint);
            toast.success("Deleted successfully!");
            if (onSuccess) {
                onSuccess();
            }
            setShowModal(false); // Close modal after success
        } catch (error) {
            console.error("Error deleting:", error, error.message);
            toast.error(error.message || "Failed to delete. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Delete Button */}
            <Button variant="danger" onClick={() => setShowModal(true)} size="sm">
                {label}
            </Button>

            {/* Confirmation Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered >
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this item? This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete} disabled={loading}>
                        {loading ? "Deleting..." : "Delete"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default DeleteButton;
