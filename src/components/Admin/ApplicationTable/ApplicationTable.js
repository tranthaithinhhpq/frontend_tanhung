import React, { useEffect, useState, useCallback } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import axios from '../../../setup/axios';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import Select from 'react-select';

const ApplicationTable = () => {
    const [applications, setApplications] = useState([]);
    const [recruitments, setRecruitments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showCoverModal, setShowCoverModal] = useState(false);
    const [currentCoverLetter, setCurrentCoverLetter] = useState('');
    const [formData, setFormData] = useState({
        id: null,
        recruitmentId: null,
        fullName: '',
        email: '',
        phone: '',
        coverLetter: '',
        status: 'PENDING',
        cvFile: ''
    });
    const [file, setFile] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(5);
    const [totalPage, setTotalPage] = useState(0);

    const fetchApplications = useCallback(async () => {
        try {
            const res = await axios.get(`/api/v1/admin/application/read?page=${currentPage}&limit=${limit}`);
            if (res.EC === 0) {
                setApplications(res.DT.rows);
                setTotalPage(res.DT.totalPages);
            } else toast.error(res.EM);
        } catch {
            toast.error("Lỗi tải danh sách");
        }
    }, [currentPage, limit]);

    const fetchRecruitments = async () => {
        const res = await axios.get('/api/v1/admin/recruitment/read?page=1&limit=100');
        if (res.EC === 0) setRecruitments(res.DT.rows);
    };

    useEffect(() => {
        fetchApplications();
        fetchRecruitments();
    }, [fetchApplications]);

    const handleSave = async () => {
        try {
            const form = new FormData();
            Object.keys(formData).forEach(k => {
                if (k !== 'id' && k !== 'cvFile') form.append(k, formData[k]);
            });
            if (file) form.append('cvFile', file);

            let res;
            if (isEditMode) {
                res = await axios.put(`/api/v1/admin/application/update/${formData.id}`, form, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                res = await axios.post('/api/v1/admin/application/create', form, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            if (res.EC === 0) {
                toast.success(res.EM);
                fetchApplications();
                setShowModal(false);
            } else toast.error(res.EM);
        } catch {
            toast.error("Lỗi khi lưu");
        }
    };

    const handleEdit = (item) => {
        setFormData(item);
        setFile(null);
        setIsEditMode(true);
        setShowModal(true);
    };

    const handleAdd = () => {
        setFormData({ id: null, recruitmentId: null, fullName: '', email: '', phone: '', coverLetter: '', status: 'PENDING' });
        setFile(null);
        setIsEditMode(false);
        setShowModal(true);
    };

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (file) setFile(file);
    };

    const handleDelete = async (item) => {
        try {
            const res = await axios.post('/api/v1/admin/application/delete', { id: item.id, cvFile: item.cvFile });
            if (res.EC === 0) {
                toast.success("Đã xoá");
                fetchApplications();
            } else toast.error(res.EM);
        } catch {
            toast.error("Lỗi khi xoá");
        }
    };

    return (
        <div className="container mt-4">
            <h3>Quản lý Ứng viên</h3>
            <Button className="mb-3" onClick={handleAdd}>
                <i className="fa fa-plus"></i> Thêm hồ sơ
            </Button>
            <Table bordered hover>
                <thead>
                    <tr>
                        <th>Họ tên</th>
                        <th>Email</th>
                        <th>SĐT</th>
                        <th>Vị trí</th>
                        <th>CV</th>
                        <th>Thư xin việc</th>
                        <th>Status</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {applications.length > 0 ? applications.map(item => (
                        <tr key={item.id}>
                            <td>{item.fullName}</td>
                            <td>{item.email}</td>
                            <td>{item.phone}</td>
                            <td>{item.Recruitment?.title || "N/A"}</td>
                            <td>
                                {item.cvFile
                                    ? <a href={`${process.env.REACT_APP_BACKEND_URL}${item.cvFile}`} target="_blank" rel="noreferrer">Xem CV</a>
                                    : 'N/A'}
                            </td>
                            <td>
                                {item.coverLetter ? (
                                    <Button
                                        variant="info"
                                        size="sm"
                                        onClick={() => {
                                            setCurrentCoverLetter(item.coverLetter);
                                            setShowCoverModal(true);
                                        }}
                                    >
                                        Xem
                                    </Button>
                                ) : 'N/A'}
                            </td>
                            <td>{item.status}</td>
                            <td>
                                <i className="fa fa-pencil edit" onClick={() => handleEdit(item)}></i>
                                <i className="fa fa-trash delete text-danger" onClick={() => handleDelete(item)}></i>
                            </td>
                        </tr>
                    )) : <tr><td colSpan="7" className="text-center">Không có dữ liệu</td></tr>}
                </tbody>
            </Table>

            {totalPage > 1 && (
                <ReactPaginate
                    pageCount={totalPage}
                    onPageChange={(e) => setCurrentPage(e.selected + 1)}
                    containerClassName="pagination justify-content-center"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    activeClassName="active"
                    forcePage={currentPage - 1}
                />
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{isEditMode ? "Cập nhật" : "Thêm"} Hồ sơ</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Vị trí</Form.Label>
                            <Select
                                options={recruitments.map(r => ({ value: r.id, label: r.title }))}
                                value={recruitments.find(r => r.id === formData.recruitmentId) ? { value: formData.recruitmentId, label: recruitments.find(r => r.id === formData.recruitmentId).title } : null}
                                onChange={(opt) => setFormData({ ...formData, recruitmentId: opt.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Họ tên</Form.Label>
                            <Form.Control value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Số điện thoại</Form.Label>
                            <Form.Control value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Thư xin việc</Form.Label>
                            <Form.Control as="textarea" rows={3} value={formData.coverLetter} onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>CV</Form.Label>
                            <Form.Control type="file" accept=".pdf,.doc,.docx" onChange={handleFile} />
                            {formData.cvFile && !file && (
                                <div className="mt-2">
                                    <a href={`${process.env.REACT_APP_BACKEND_URL}${formData.cvFile}`} target="_blank" rel="noreferrer">Xem CV hiện tại</a>
                                </div>
                            )}
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Trạng thái</Form.Label>
                            <Form.Select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                                <option value="PENDING">PENDING</option>
                                <option value="REVIEWED">REVIEWED</option>
                                <option value="ACCEPTED">ACCEPTED</option>
                                <option value="REJECTED">REJECTED</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
                    <Button variant="primary" onClick={handleSave}>Lưu</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showCoverModal} onHide={() => setShowCoverModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Thư xin việc</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p style={{ whiteSpace: 'pre-line' }}>{currentCoverLetter}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCoverModal(false)}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ApplicationTable;
