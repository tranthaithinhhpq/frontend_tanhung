import React, { useEffect, useState } from 'react';
import axios from '../../../setup/axios';
import { Table, Modal, Button, Form } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';

const PageTextContentManagement = () => {
    const [list, setList] = useState([]);
    const [form, setForm] = useState({ section: '', title: '', contentText: '', sortOrder: 1 });
    const [editId, setEditId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [pagination, setPagination] = useState({ totalPages: 0, currentPage: 1 });

    const fetchData = async (page = 1) => {
        const res = await axios.get(`/api/v1/admin/page-text-content/read?page=${page}&limit=5`);
        if (res.EC === 0) {
            setList(res.DT.rows);
            setPagination({ totalPages: res.DT.totalPages, currentPage: res.DT.currentPage });
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleSave = async () => {
        if (!form.section || !form.title) return toast.error("Vui lòng nhập đầy đủ");

        const res = editId
            ? await axios.put(`/api/v1/admin/page-text-content/update/${editId}`, form)
            : await axios.post(`/api/v1/admin/page-text-content/create`, form);

        if (res.EC === 0) toast.success(editId ? "Cập nhật thành công" : "Tạo mới thành công");
        else toast.error(res.EM);

        setShowModal(false);
        setForm({ section: '', title: '', contentText: '', sortOrder: 1 });
        setEditId(null);
        fetchData(pagination.currentPage);
    };

    const handleDelete = async () => {
        const res = await axios.post(`/api/v1/admin/page-text-content/delete`, { id: deleteId });
        if (res.EC === 0) {
            toast.success("Xóa thành công");
            fetchData(pagination.currentPage);
        } else toast.error(res.EM);
        setShowConfirm(false);
    };

    const handlePageClick = (e) => {
        fetchData(e.selected + 1);
    };

    return (
        <div className="container mt-4">
            <h3>Quản lý nội dung văn bản</h3>
            <Button onClick={() => { setForm({ section: '', title: '', contentText: '', sortOrder: 1 }); setEditId(null); setShowModal(true); }}>
                Thêm mới
            </Button>

            <Table striped bordered hover className="mt-3">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Section</th>
                        <th>Tiêu đề</th>
                        <th>Nội dung</th>
                        <th>Thứ tự</th>
                        <th style={{ minWidth: '110px' }}>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {list.map((item, idx) => (
                        <tr key={item.id}>
                            <td>{(pagination.currentPage - 1) * 5 + idx + 1}</td>
                            <td>{item.section}</td>
                            <td>{item.title}</td>
                            <td>{item.contentText}</td>
                            <td>{item.sortOrder}</td>
                            <td>
                                <Button variant="warning" size="sm" onClick={() => { setForm(item); setEditId(item.id); setShowModal(true); }}>
                                    Sửa
                                </Button>{' '}
                                <Button variant="danger" size="sm" onClick={() => { setDeleteId(item.id); setShowConfirm(true); }}>
                                    Xóa
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

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

            {/* Modal thêm/sửa */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editId ? 'Chỉnh sửa' : 'Thêm'} nội dung</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Section *</Form.Label>
                        <Form.Control
                            value={form.section}
                            onChange={(e) => setForm({ ...form, section: e.target.value })}
                            disabled={!!editId} // 👈 Chỉ cho nhập khi đang tạo mới
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Tiêu đề *</Form.Label>
                        <Form.Control value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Nội dung</Form.Label>
                        <Form.Control as="textarea" rows={4} value={form.contentText} onChange={(e) => setForm({ ...form, contentText: e.target.value })} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Thứ tự hiển thị</Form.Label>
                        <Form.Control type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: +e.target.value })} />
                    </Form.Group>
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
                <Modal.Body>Bạn có chắc muốn xóa nội dung này?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>Hủy</Button>
                    <Button variant="danger" onClick={handleDelete}>Xóa</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default PageTextContentManagement;
