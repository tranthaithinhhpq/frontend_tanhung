import React, { useEffect, useState } from 'react';
import axios from '../../../setup/axios';
import { Modal, Button, Table, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
// import Modal from 'react-bootstrap/Modal';

const DegreeManagement = () => {
    const [degrees, setDegrees] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState({ name: '', description: '' });
    const [pagination, setPagination] = useState({ totalPages: 0, currentPage: 1 });
    const [degreeToDelete, setDegreeToDelete] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);

    const fetchData = async (page = 1) => {
        const res = await axios.get(`/api/v1/admin/degree/paginate?page=${page}&limit=5`);
        if (res.EC === 0) {
            setDegrees(res.DT.rows);
            setPagination({ totalPages: res.DT.totalPages, currentPage: res.DT.currentPage });
        }
    };

    const handlePageClick = (event) => {
        const selectedPage = event.selected + 1;
        fetchData(selectedPage);
    };

    const handleDeleteConfirm = async () => {
        const res = await axios.post('/api/v1/admin/degree/delete', { id: degreeToDelete });
        if (res.EC === 0) {
            toast.success("Xóa thành công");
            fetchData(pagination.currentPage);
        } else toast.error(res.EM);
        setShowConfirm(false);
    };


    useEffect(() => {
        fetchData();
    }, []);

    const handleSave = async () => {
        if (!form.name) return toast.error("Vui lòng nhập tên");

        if (editId) {
            const res = await axios.put(`/api/v1/admin/degree/edit/${editId}`, form);
            if (res.EC === 0) {
                toast.success("Cập nhật thành công");
                setEditId(null);
            } else toast.error(res.EM);
        } else {
            const res = await axios.post('/api/v1/admin/degree/create', form);
            if (res.EC === 0) toast.success("Tạo mới thành công");
            else toast.error(res.EM);
        }

        setForm({ name: '', description: '' });
        setModalShow(false);
        fetchData();
    };

    const handleDelete = async (id) => {
        const res = await axios.post('/api/v1/admin/degree/delete', { id });
        if (res.EC === 0) {
            toast.success("Xóa thành công");
            fetchData();
        } else toast.error(res.EM);
    };

    const openEdit = (item) => {
        setForm({ name: item.name, description: item.description });
        setEditId(item.id);
        setModalShow(true);
    };

    return (
        <div className="container mt-4">
            <h3>Quản lý trình độ</h3>
            <Button onClick={() => { setModalShow(true); setEditId(null); setForm({ name: '', description: '' }); }}>Thêm mới</Button>
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
                    {degrees.map((item, index) => (
                        <tr key={item.id}>
                            <td>{index + 1}</td>
                            <td>{item.name}</td>
                            <td>{item.description}</td>
                            <td>
                                <Button variant="warning" size="sm" onClick={() => openEdit(item)}>Sửa</Button>{' '}
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => {
                                        setDegreeToDelete(item.id);
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

            <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn có chắc muốn xóa trình độ này?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>Hủy</Button>
                    <Button variant="danger" onClick={handleDeleteConfirm}>Xóa</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={modalShow} onHide={() => setModalShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editId ? 'Chỉnh sửa' : 'Thêm mới'} trình độ</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Tên trình độ</Form.Label>
                            <Form.Control
                                type="text"
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
                    <Button variant="secondary" onClick={() => setModalShow(false)}>Hủy</Button>
                    <Button variant="primary" onClick={handleSave}>Lưu</Button>
                </Modal.Footer>
            </Modal>

            <ReactPaginate
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
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                breakClassName="page-item"
                breakLinkClassName="page-link"
                activeClassName="active"
            />

        </div>
    );
};

export default DegreeManagement;
