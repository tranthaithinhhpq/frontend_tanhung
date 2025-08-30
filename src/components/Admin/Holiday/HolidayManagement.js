import React, { useEffect, useState } from 'react';
import axios from '../../../setup/axios';
import { Modal, Button, Table, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

const HolidayManagement = () => {
    const [holidays, setHolidays] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState({ date: null, description: '' });
    const [pagination, setPagination] = useState({ totalPages: 0, currentPage: 1 });
    const [holidayToDelete, setHolidayToDelete] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);


    const fetchData = async (page = 1) => {
        const res = await axios.get(`/api/v1/admin/holiday/paginate?page=${page}&limit=5`);
        if (res.EC === 0) {
            setHolidays(res.DT.rows);
            setPagination({ totalPages: res.DT.totalPages, currentPage: res.DT.currentPage });
        } else toast.error(res.EM);
    };

    const handlePageClick = (event) => {
        const selectedPage = event.selected + 1;
        fetchData(selectedPage);
    };

    const handleDeleteConfirm = async () => {
        const res = await axios.post('/api/v1/admin/holiday/delete', { id: holidayToDelete });
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
        if (!form.date) return toast.error("Vui lòng chọn ngày");

        const payload = {
            date: format(form.date, 'yyyy-MM-dd'), // giữ đúng ngày local
            description: form.description
        };

        if (editId) {
            const res = await axios.put(`/api/v1/admin/holiday/update/${editId}`, payload);
            if (res.EC === 0) {
                toast.success("Cập nhật thành công");
                setEditId(null);
            } else toast.error(res.EM);
        } else {
            const res = await axios.post('/api/v1/admin/holiday/create', payload);
            if (res.EC === 0) toast.success("Tạo mới thành công");
            else toast.error(res.EM);
        }

        setForm({ date: null, description: '' });
        setModalShow(false);
        fetchData();
    };

    const openEdit = (item) => {
        setForm({
            date: new Date(item.date),
            description: item.description
        });
        setEditId(item.id);
        setModalShow(true);
    };

    return (
        <div className="container mt-4">
            <h3>Quản lý ngày nghỉ lễ</h3>
            <Button
                onClick={() => {
                    setModalShow(true);
                    setEditId(null);
                    setForm({ date: null, description: '' });
                }}
            >
                Thêm mới
            </Button>
            <Table striped bordered hover className="mt-3">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Ngày nghỉ</th>
                        <th>Mô tả</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {holidays.map((item, index) => (
                        <tr key={item.id}>
                            <td>{index + 1}</td>
                            <td>{item.date}</td>
                            <td>{item.description}</td>
                            <td>
                                <Button
                                    variant="warning"
                                    size="sm"
                                    onClick={() => openEdit(item)}
                                >
                                    Sửa
                                </Button>{' '}
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => {
                                        setHolidayToDelete(item.id);
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

            {/* Modal xác nhận xóa */}
            <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn có chắc muốn xóa ngày nghỉ này?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>Hủy</Button>
                    <Button variant="danger" onClick={handleDeleteConfirm}>Xóa</Button>
                </Modal.Footer>
            </Modal>

            {/* Modal thêm/sửa */}
            <Modal show={modalShow} onHide={() => setModalShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editId ? 'Chỉnh sửa' : 'Thêm mới'} ngày nghỉ</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Ngày nghỉ</Form.Label>
                            <DatePicker
                                selected={form.date}
                                onChange={(date) => setForm({ ...form, date })}
                                dateFormat="yyyy-MM-dd"
                                className="form-control"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Mô tả</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
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

            {/* Pagination */}
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

export default HolidayManagement;
