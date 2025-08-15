import React, { useEffect, useState } from 'react';
import axios from '../../../setup/axios';
import { toast } from 'react-toastify';
import { Modal, Button } from 'react-bootstrap';

const ImageManager = () => {
    const [images, setImages] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [imageToDelete, setImageToDelete] = useState(null);

    const loadImages = async () => {
        try {
            const res = await axios.get('/api/v1/admin/images/read');
            if (res.EC === 0) {
                setImages(res.DT);
            } else {
                toast.error(res.EM);
            }
        } catch (err) {
            console.error(err);
            toast.error("Lỗi tải danh sách ảnh");
        }
    };

    const confirmDelete = (filename) => {
        setImageToDelete(filename);
        setShowModal(true);
    };

    const handleDelete = async () => {
        try {
            const res = await axios.delete(`/api/v1/admin/images/delete/${imageToDelete}`);
            if (res.EC === 0) {
                toast.success("Xóa ảnh thành công");
                loadImages();
            } else {
                toast.error(res.EM);
            }
        } catch (err) {
            console.error(err);
            toast.error("Lỗi xóa ảnh");
        } finally {
            setShowModal(false);
            setImageToDelete(null);
        }
    };

    useEffect(() => {
        loadImages();
    }, []);

    return (
        <div className="container mt-4">
            <h3>Quản lý ảnh</h3>
            <div className="row">
                {images.map((img, idx) => (
                    <div className="col-md-3 mb-3" key={idx}>
                        <div className="card">
                            <img src={img.url} alt={img.name} className="card-img-top" />
                            <div className="card-body">
                                <p className="card-text">{img.name}</p>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => confirmDelete(img.name)}
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Xác nhận */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Bạn có chắc muốn xóa ảnh <b>{imageToDelete}</b> không?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Hủy
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Xác nhận xóa
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ImageManager;
