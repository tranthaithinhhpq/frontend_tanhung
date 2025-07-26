import React, { useEffect, useState } from 'react';
import { Button, Table, Modal, Form } from 'react-bootstrap';
import axios from '../../../setup/axios';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';

const PageAdmin = () => {
    const [pages, setPages] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentPage, setCurrentPage] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const history = useHistory();
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';

    const [form, setForm] = useState({
        slug: '',
        title: '',
        contentThumbnail: '',
        videoYoutubeId: '',
        status: true
    });

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        try {
            const res = await axios.get('/api/v1/page');
            if (res.EC === 0) {
                setPages(res.DT); // ← bạn phải gọi setPages
            } else {
                toast.error(res.EM);
            }
        } catch (err) {
            toast.error("Lỗi kết nối server");
        }
    };


    const handleSave = async () => {
        try {
            if (editMode) {
                const res = await axios.put(`/api/v1/page/${currentPage.id}`, form);
                if (res?.EC === 0) {
                    toast.success('Cập nhật thành công');
                    fetchPages();
                    setShowModal(false);
                } else toast.error(res?.EM);
            } else {
                const res = await axios.post('/api/v1/page', form);
                if (res?.EC === 0) {
                    toast.success('Tạo trang thành công');
                    fetchPages();
                    setShowModal(false);
                } else toast.error(res?.EM);
            }
        } catch (err) {
            console.error(err);
            toast.error('Lỗi khi lưu trang');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc muốn xoá?')) return;
        try {
            const res = await axios.delete(`/api/v1/page/${id}`);
            if (res?.EC === 0) {
                toast.success('Xoá thành công');
                fetchPages();
            } else toast.error(res?.EM);
        } catch (err) {
            console.error(err);
            toast.error('Lỗi khi xoá');
        }
    };

    return (
        <div className="container py-4">
            <h3>Quản lý các trang</h3>
            <Button className="mb-3" onClick={() => history.push('/admin/page-new')}>+ Thêm mới</Button>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Hình ảnh</th>
                        <th>Slug</th>
                        <th>Tiêu đề</th>
                        <th>Youtube ID</th>
                        <th>Trạng thái</th>
                        <th>Thuộc trang</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {pages && pages.length > 0 ? (
                        pages.map((item, index) => (
                            <tr key={item.id}>
                                <td>{index + 1}</td>
                                <td><img src={`${BACKEND_URL}${item.image}`} alt="device" style={{ width: 60, height: 40, objectFit: 'cover' }} /></td>
                                <td>{item.slug}</td>
                                <td>{item.title}</td>
                                <td>{item.videoYoutubeId}</td>
                                <td>{item.status ? 'Hiển thị' : 'Ẩn'}</td>
                                <td>{item.section}</td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => history.push(`/admin/page/edit/${item.id}`)}
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => {
                                            setCurrentPage(item);
                                            setShowDeleteModal(true);
                                        }}
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center">Không có dữ liệu</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editMode ? 'Cập nhật trang' : 'Tạo trang mới'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Slug</Form.Label>
                        <Form.Control value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Tiêu đề</Form.Label>
                        <Form.Control value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Ảnh Thumbnail</Form.Label>
                        <Form.Control value={form.contentThumbnail} onChange={e => setForm({ ...form, contentThumbnail: e.target.value })} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Youtube ID</Form.Label>
                        <Form.Control value={form.videoYoutubeId} onChange={e => setForm({ ...form, videoYoutubeId: e.target.value })} />
                    </Form.Group>
                    <Form.Check
                        type="checkbox"
                        label="Hiển thị"
                        checked={form.status}
                        onChange={() => setForm({ ...form, status: !form.status })}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Lưu
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xoá</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Bạn có chắc muốn xoá trang: <strong>{currentPage?.title}</strong>?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Hủy
                    </Button>
                    <Button
                        variant="danger"
                        onClick={async () => {
                            try {
                                const res = await axios.delete(`/api/v1/page/${currentPage?.id}`);
                                if (res?.EC === 0) {
                                    toast.success('Xoá thành công');
                                    fetchPages();
                                } else toast.error(res?.EM);
                            } catch (err) {
                                toast.error('Lỗi khi xoá');
                            } finally {
                                setShowDeleteModal(false);
                            }
                        }}
                    >
                        Xác nhận xoá
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default PageAdmin;
