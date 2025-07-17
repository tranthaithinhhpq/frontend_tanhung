// File: BannerTable.js
import React, { useEffect, useState, useCallback } from 'react';
import { Table, Button, Modal, Form, Image } from 'react-bootstrap';
import axios from '../../../setup/axios';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
// import './Banner.scss';

const BannerTable = () => {
    const [banners, setBanners] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        title: '',
        imageDesktop: '',
        imagePhone: '',
        sortOrder: 0
    });
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';
    const [previewDesktop, setPreviewDesktop] = useState('');
    const [previewPhone, setPreviewPhone] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(5);
    const [totalPage, setTotalPage] = useState(0);

    const [fileDesktop, setFileDesktop] = useState(null);
    const [filePhone, setFilePhone] = useState(null);
    const [showFull, setShowFull] = useState({ type: '', show: false });


    const [bannerToDelete, setBannerToDelete] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);


    const fetchBanners = useCallback(async () => {
        try {
            const res = await axios.get(`/api/v1/banner?page=${currentPage}&limit=${limit}`);
            if (res.EC === 0) {
                if (res.EC === 0) {
                    setBanners(res.DT.rows || []);
                    setTotalPage(res.DT.totalPages || 0);
                } else {
                    toast.error(res.EM);
                }
                setTotalPage(res.DT.totalPages || 0);
            } else toast.error(res.EM);
        } catch (err) {
            toast.error("Lỗi tải danh sách banner");
        }
    }, [currentPage, limit]);


    const buildImgSrc = (raw) => {
        if (!raw) return '';
        if (raw.startsWith('blob:') || raw.startsWith('http')) return raw;
        return `${BACKEND_URL}${raw.startsWith('/') ? raw : `/${raw}`}`;
    };



    useEffect(() => { fetchBanners(); }, [fetchBanners]);

    const handlePageClick = (event) => { setCurrentPage(event.selected + 1); };

    const handleSave = async () => {
        try {
            const form = new FormData();
            form.append('title', formData.title);
            form.append('sortOrder', formData.sortOrder || 0);
            if (fileDesktop) form.append('imageDesktop', fileDesktop);
            if (filePhone) form.append('imagePhone', filePhone);

            let res;
            if (isEditMode) {
                res = await axios.put(`/api/v1/banner/${formData.id}`, form, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                res = await axios.post('/api/v1/banner', form, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            if (res && res.EC === 0) {
                toast.success(res.EM || "Thành công");
                fetchBanners();
                setShowModal(false);
            } else {
                const message = res?.EM || "Thất bại";
                toast.error(message);
                console.log("Response khi lưu banner:", res);
            }
        } catch (err) {
            console.error(err);
            toast.error("Lỗi khi lưu banner");
        }
    };


    const handleEdit = (banner) => {
        setFormData(banner);
        setPreviewDesktop(banner.imageDesktop || '');
        setPreviewPhone(banner.imagePhone || '');
        setFileDesktop(null);
        setFilePhone(null);
        setIsEditMode(true);
        setShowModal(true);
    };

    const handleAdd = () => {
        setFormData({ id: null, title: '', imageDesktop: '', imagePhone: '', sortOrder: 0 });
        setIsEditMode(false);
        setFileDesktop(null); // reset file nếu có
        setFilePhone(null);
        setPreviewDesktop(null); // reset ảnh preview
        setPreviewPhone(null);
        setShowModal(true);
    };

    const handleImageDesktop = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileDesktop(file);
            setPreviewDesktop(URL.createObjectURL(file));
        }
    };

    const handleImagePhone = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFilePhone(file);
            setPreviewPhone(URL.createObjectURL(file));
        }
    };

    const handleDelete = (banner) => {
        setShowDeleteModal(true);
    };
    const confirmDelete = async () => {
        console.log("Xoá banner:", bannerToDelete);
        if (!bannerToDelete) return;

        try {
            const res = await axios.delete(`/api/v1/banner/${bannerToDelete.id}`);
            if (res.EC === 0) {
                toast.success("Đã xoá banner");
                fetchBanners();
            } else {
                toast.error(res.EM || "Lỗi xoá");
            }
        } catch (err) {
            console.error(err);
            toast.error("Lỗi hệ thống khi xoá");
        } finally {
            setShowDeleteModal(false);
            setBannerToDelete(null);
        }
    };


    return (
        <div className="container mt-4">
            <h3>Quản lý Banner</h3>
            <Button className="mb-3" onClick={handleAdd}>
                <i className="fa fa-plus"></i> Thêm banner
            </Button>
            <Table bordered hover>
                <thead>
                    <tr>
                        <th>Tiêu đề</th>
                        <th>Desktop(1920x600px)</th>
                        <th>Mobile(750x500px)</th>
                        <th>Sort</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {banners.length > 0 ? banners.map(item => (
                        <tr key={item.id}>
                            <td>{item.title}</td>
                            <td>
                                {item.imageDesktop
                                    ? <img src={`${BACKEND_URL}${item.imageDesktop}`} alt="desktop" height={50} style={{ objectFit: 'cover' }} />
                                    : 'N/A'}
                            </td>
                            <td>
                                {item.imagePhone
                                    ? <img src={`${BACKEND_URL}${item.imagePhone}`} alt="phone" height={50} style={{ objectFit: 'cover' }} />
                                    : 'N/A'}
                            </td>
                            <td>{item.sortOrder}</td>
                            <td>
                                <i className="fa fa-pencil edit" onClick={() => handleEdit(item)}></i>
                                <i
                                    className="fa fa-trash delete text-danger"
                                    onClick={() => {
                                        console.log("Set banner to delete:", item); // kiểm tra
                                        setBannerToDelete(item);
                                        setShowDeleteModal(true);
                                    }}
                                ></i>
                            </td>
                        </tr>
                    )) : (
                        <tr><td colSpan="5" className="text-center">Không có banner</td></tr>
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
                    <Modal.Title>{isEditMode ? 'Cập nhật' : 'Thêm'} Banner</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Tiêu đề</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Ảnh Desktop</Form.Label>
                            <Form.Control type="file" accept="image/*" onChange={handleImageDesktop} />
                            {previewDesktop && (
                                <div className="mt-2">
                                    <img
                                        src={buildImgSrc(previewDesktop)}
                                        alt="desktop preview"
                                        height={70}
                                        onClick={() => setShowFull({ type: 'desktop', show: true })}
                                        style={{ cursor: 'pointer', border: '1px solid #ccc' }}
                                    />
                                </div>
                            )}
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Ảnh Mobile</Form.Label>
                            <Form.Control type="file" accept="image/*" onChange={handleImagePhone} />
                            {previewPhone && (
                                <div className="mt-2">
                                    <img
                                        src={buildImgSrc(previewPhone)}
                                        alt="mobile preview"
                                        height={70}
                                        onClick={() => setShowFull({ type: 'phone', show: true })}
                                        style={{ cursor: 'pointer', border: '1px solid #ccc' }}
                                    />
                                </div>
                            )}
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Thứ tự</Form.Label>
                            <Form.Control
                                type="number"
                                value={formData.sortOrder}
                                onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
                    <Button variant="primary" onClick={handleSave}>Lưu</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xoá</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Bạn có chắc muốn xoá banner không?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Hủy
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Xác nhận xoá
                    </Button>
                </Modal.Footer>
            </Modal>

            {showFull.show && (
                <div
                    onClick={() => setShowFull({ ...showFull, show: false })}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 9999,
                        background: 'rgba(0,0,0,0.8)', display: 'flex',
                        justifyContent: 'center', alignItems: 'center'
                    }}
                >
                    <img
                        src={buildImgSrc(showFull.type === 'desktop' ? previewDesktop : previewPhone)}
                        alt="full"
                        style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }}
                    />
                </div>
            )}
        </div>
    );
};

export default BannerTable;
