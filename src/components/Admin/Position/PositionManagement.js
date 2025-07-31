import React, { useEffect, useState } from 'react';
import axios from '../../../setup/axios';
import { Modal, Button, Table, Form } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';

const PositionManagement = () => {
    const [positions, setPositions] = useState([]);
    const [form, setForm] = useState({ name: '', description: '' });
    const [editId, setEditId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [positionToDelete, setPositionToDelete] = useState(null);
    const [pagination, setPagination] = useState({ totalPages: 0, currentPage: 1 });

    const fetchData = async (page = 1) => {
        const res = await axios.get(`/api/v1/position/paginate?page=${page}&limit=5`);
        if (res.EC === 0) {
            setPositions(res.DT.rows);
            setPagination({ totalPages: res.DT.totalPages, currentPage: res.DT.currentPage });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSave = async () => {
        if (!form.name) return toast.error("Vui lòng nhập tên");

        if (editId) {
            const res = await axios.put(`/api/v1/position/${editId}`, form);
            if (res.EC === 0) toast.success("Cập nhật thành công");
            else toast.error(res.EM);
        } else {
            const res = await axios.post(`/api/v1/position`, form);
            if (res.EC === 0) toast.success("Tạo mới thành công");
            else toast.error(res.EM);
        }

        setShowModal(false);
        setForm({ name: '', description: '' });
        setEditId(null);
        fetchData(pagination.currentPage);
    };

    const handleDelete = async () => {
        const res = await axios.post('/api/v1/position/delete', { id: positionToDelete });
        if (res.EC === 0) {
            toast.success("Xóa thành công");
            fetchData(pagination.currentPage);
        } else toast.error(res.EM);
        setShowConfirm(false);
    };

    const handlePageClick = (event) => {
        const selectedPage = event.selected + 1;
        fetchData(selectedPage);
    };

    return (
        <div className="container mt-4">
            <h3>Quản lý chức danh (Position)</h3>
            <Button onClick={() => { setShowModal(true); setEditId(null); setForm({ name: '', description: '' }); }}>
                Thêm mới
            </Button>

            <Table striped bordered hover className="mt-3">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Tên</th>
                        <th>Mô tả</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {positions.map((item, idx) => (
                        <tr key={item.id}>
                            <td>{(pagination.currentPage - 1) * 5 + idx + 1}</td>
                            <td>{item.name}</td>
                            <td>{item.description}</td>
                            <td>
                                <Button
                                    variant="warning"
                                    size="sm"
                                    onClick={() => {
                                        setForm({ name: item.name, description: item.description });
                                        setEditId(item.id);
                                        setShowModal(true);
                                    }}
                                >
                                    Sửa
                                </Button>{' '}
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => {
                                        setPositionToDelete(item.id);
                                        setShowConfirm(true);
                                    }}
                                >
                                    Xóa
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* <ReactPaginate
                breakLabel="..."
                nextLabel=">>"
                onPageChange={handlePageClick}
                pageRangeDisplayed={2}
                marginPagesDisplayed={1}
                pageCount={pagination.totalPages}
                previousLabel="<<"
                containerClassName="pagination justify-content-center mt-3"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                activeClassName="active"
            /> */}

            <ReactPaginate
                breakLabel="..."
                nextLabel=">"
                onPageChange={handlePageClick}
                pageRangeDisplayed={2}
                marginPagesDisplayed={1}
                pageCount={pagination.totalPages}
                previousLabel="<"
                containerClassName="pagination justify-content-center mt-3"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                breakClassName="page-item"
                breakLinkClassName="page-link"
                activeClassName="active"
            />

            {/* Modal Thêm/Sửa */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editId ? 'Cập nhật' : 'Thêm'} chức danh</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Tên</Form.Label>
                            <Form.Control
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Mô tả</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
                    <Button variant="primary" onClick={handleSave}>Lưu</Button>
                </Modal.Footer>
            </Modal>

            {/* Modal xác nhận xóa */}
            <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn có chắc muốn xóa chức danh này?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>Hủy</Button>
                    <Button variant="danger" onClick={handleDelete}>Xóa</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default PositionManagement;
