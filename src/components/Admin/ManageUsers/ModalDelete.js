import { Modal, Button } from "react-bootstrap";

const ModalDelete = ({ show, handleClose, confirmDeleteUser, dataModal }) => {
    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Delete</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                Are you sure to delete user&nbsp;
                <strong>{dataModal.email}</strong> ?
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={confirmDeleteUser}>
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalDelete;
