import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import axios from '../../../setup/axios';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import './PageImageContentTable.scss';

const PageImageContentTable = () => {
    const [items, setItems] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({ id: null, section: '', title: '', sortOrder: 0 });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [limit] = useState(5);
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';
    const [showFull, setShowFull] = useState({ show: false, src: '' });

    const fetchData = useCallback(async () => {
        try {
            const res = await axios.get(`/api/v1/pageimagecontent?page=${currentPage}&limit=${limit}`);
            if (res.EC === 0) {
                setItems(res.DT.rows || []);
                setTotalPage(res.DT.totalPages || 0);
            } else toast.error(res.EM);
        } catch (err) {
            toast.error("Lỗi tải dữ liệu");
        }
    }, [currentPage, limit]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const buildImgSrc = (raw) => {
        if (!raw) return '';
        if (raw.startsWith('blob:') || raw.startsWith('http')) return raw;
        return `${BACKEND_URL}${raw.startsWith('/') ? raw : `/${raw}`}`;
    };

    const handlePageClick = (e) => setCurrentPage(e.selected + 1);

    const handleEdit = (item) => {
        setFormData(item);
        setPreview(item.image || '');
        setIsEditMode(true);
        setFile(null);
        setShowModal(true);
    };

    const handleAdd = () => {
        setFormData({ id: null, section: '', title: '', sortOrder: 0 });
        setFile(null);
        setPreview('');
        setIsEditMode(false);
        setShowModal(true);
    };

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        try {
            const form = new FormData();
            form.append('section', formData.section);
            form.append('title', formData.title);
            form.append('sortOrder', formData.sortOrder);
            if (file) form.append('image', file);

            let res;
            if (isEditMode) {
                res = await axios.put(`/api/v1/pageimagecontent/${formData.id}`, form, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                res = await axios.post('/api/v1/pageimagecontent', form, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            if (res && res.EC === 0) {
                toast.success(res.EM);
                fetchData();
                setShowModal(false);
            } else toast.error(res.EM);
        } catch (err) {
            toast.error("Lỗi khi lưu dữ liệu");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xoá?")) return;
        try {
            const res = await axios.delete(`/api/v1/pageimagecontent/${id}`);
            if (res.EC === 0) {
                toast.success("Đã xoá");
                fetchData();
            } else toast.error(res.EM);
        } catch (err) {
            toast.error("Lỗi khi xoá");
        }
    };

    return (
        <div className="container mt-4">
            <h3>Quản lý PageImageContent</h3>
            <Button className="mb-3" onClick={handleAdd}>
                <i className="fa fa-plus"></i> Thêm
            </Button>
            <Table bordered hover>
                <thead>
                    <tr>
                        <th>Section</th>
                        <th>Title</th>
                        <th>Image</th>
                        <th>Sort</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {items.length > 0 ? items.map(item => (
                        <tr key={item.id}>
                            <td>{item.section}</td>
                            <td>{item.title}</td>
                            <td>
                                {item.image ? (
                                    <img
                                        src={buildImgSrc(item.image)}
                                        alt="preview"
                                        height={50}
                                        style={{ objectFit: 'cover', cursor: 'pointer' }}
                                        onClick={() => setShowFull({ show: true, src: buildImgSrc(item.image) })}
                                    />
                                ) : 'N/A'}
                            </td>
                            <td>{item.sortOrder}</td>
                            <td>
                                <i className="fa fa-pencil edit" onClick={() => handleEdit(item)}></i>
                                <i className="fa fa-trash delete text-danger" onClick={() => handleDelete(item.id)}></i>
                            </td>
                        </tr>
                    )) : (
                        <tr><td colSpan="5" className="text-center">Không có dữ liệu</td></tr>
                    )}
                </tbody>
            </Table>

            {totalPage > 1 && (
                <ReactPaginate
                    pageCount={totalPage}
                    onPageChange={handlePageClick}
                    containerClassName="pagination justify-content-center"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousLabel={<span className="page-link">&lt;</span>}
                    nextLabel={<span className="page-link">&gt;</span>}
                    breakLabel={<span className="page-link">...</span>}
                    activeClassName="active"
                    forcePage={currentPage - 1}
                    previousClassName={`page-item ${currentPage === 1 ? 'disabled' : ''}`}
                    nextClassName={`page-item ${currentPage === totalPage ? 'disabled' : ''}`}
                />
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditMode ? 'Cập nhật' : 'Thêm'} PageImageContent</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Section</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.section}
                                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Sort Order</Form.Label>
                            <Form.Control
                                type="number"
                                value={formData.sortOrder}
                                onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Ảnh</Form.Label>
                            <Form.Control type="file" accept="image/*" onChange={handleImage} />
                            {preview && (
                                <div className="mt-2">
                                    <img
                                        src={buildImgSrc(preview)}
                                        alt="preview"
                                        height={70}
                                        style={{ cursor: 'pointer', border: '1px solid #ccc' }}
                                        onClick={() => setShowFull({ show: true, src: buildImgSrc(preview) })}
                                    />
                                </div>
                            )}
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
                    <Button variant="primary" onClick={handleSave}>Lưu</Button>
                </Modal.Footer>
            </Modal>

            {showFull.show && (
                <div
                    onClick={() => setShowFull({ show: false, src: '' })}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.7)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 9999
                    }}
                >
                    <img
                        src={showFull.src}
                        alt="full"
                        className="preview-fullscreen"
                    />
                </div>
            )}
        </div>
    );
};

export default PageImageContentTable;
