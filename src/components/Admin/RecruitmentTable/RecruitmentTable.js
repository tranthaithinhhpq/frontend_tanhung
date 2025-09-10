import React, { useEffect, useState, useCallback } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import axios from '../../../setup/axios';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import Select from 'react-select';

const RecruitmentTable = () => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [recruitmentToDelete, setRecruitmentToDelete] = useState(null);
    const [recruitments, setRecruitments] = useState([]);
    const [specialties, setSpecialties] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        title: '',
        departmentId: null,
        description: '',
        requirement: '',
        benefit: '',
        deadline: '',
        status: 'OPEN',
        image: '',
    });
    const [preview, setPreview] = useState('');
    const [file, setFile] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(5);
    const [totalPage, setTotalPage] = useState(0);

    const fetchRecruitments = useCallback(async () => {
        try {
            const res = await axios.get(`/api/v1/admin/recruitment/read?page=${currentPage}&limit=${limit}`);
            if (res.EC === 0) {
                setRecruitments(res.DT.rows);
                setTotalPage(res.DT.totalPages);
            } else toast.error(res.EM);
        } catch {
            toast.error("Lỗi tải danh sách");
        }
    }, [currentPage, limit]);

    const fetchSpecialties = async () => {
        const res = await axios.get('/api/v1/specialty/read?page=1&limit=100');
        if (res.EC === 0) setSpecialties(res.DT);
    };

    useEffect(() => {
        fetchRecruitments();
        fetchSpecialties();
    }, [fetchRecruitments]);

    const handleSave = async () => {
        try {
            const form = new FormData();
            Object.keys(formData).forEach(k => {
                if (k !== 'id' && k !== 'image') form.append(k, formData[k]);
            });
            if (file) form.append('image', file);

            let res;
            if (isEditMode) {
                res = await axios.put(`/api/v1/admin/recruitment/update/${formData.id}`, form, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                res = await axios.post('/api/v1/admin/recruitment/create', form, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            if (res.EC === 0) {
                toast.success(res.EM);
                fetchRecruitments();
                setShowModal(false);
            } else toast.error(res.EM);
        } catch {
            toast.error("Lỗi khi lưu");
        }
    };

    const confirmDelete = async () => {
        if (!recruitmentToDelete) return;
        try {
            const res = await axios.post('/api/v1/admin/recruitment/delete', {
                id: recruitmentToDelete.id,
                image: recruitmentToDelete.image
            });
            if (res.EC === 0) {
                toast.success("Đã xoá");
                fetchRecruitments();
            } else toast.error(res.EM);
        } catch {
            toast.error("Lỗi khi xoá");
        } finally {
            setShowDeleteModal(false);
            setRecruitmentToDelete(null);
        }
    };

    const handleEdit = (item) => {
        setFormData(item);
        setPreview(item.image ? `${process.env.REACT_APP_BACKEND_URL}${item.image}` : '');
        setFile(null);
        setIsEditMode(true);
        setShowModal(true);
    };

    const handleAdd = () => {
        setFormData({ id: null, title: '', departmentId: null, description: '', requirement: '', benefit: '', deadline: '', status: 'OPEN' });
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



    return (
        <div className="container mt-4">
            <h3>Quản lý Tuyển dụng</h3>
            <Button className="mb-3" onClick={handleAdd}>
                <i className="fa fa-plus"></i> Thêm tin
            </Button>
            <Table bordered hover>
                <thead>
                    <tr>
                        <th>Tiêu đề</th>
                        <th>Chuyên khoa</th>
                        <th>Deadline</th>
                        <th>Ảnh</th>
                        <th>Status</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {recruitments.length > 0 ? recruitments.map(item => (
                        <tr key={item.id}>
                            <td>{item.title}</td>
                            <td>{item.Specialty?.name || 'N/A'}</td>
                            <td>{item.deadline}</td>
                            <td>{item.image ? <img src={`${process.env.REACT_APP_BACKEND_URL}${item.image}`} alt="recruitment" height={50} /> : 'N/A'}</td>
                            <td>{item.status}</td>
                            <td>
                                <i className="fa fa-pencil edit" onClick={() => handleEdit(item)}></i>
                                <i
                                    className="fa fa-trash delete text-danger"
                                    onClick={() => {
                                        setRecruitmentToDelete(item);
                                        setShowDeleteModal(true);
                                    }}
                                ></i>
                            </td>
                        </tr>
                    )) : <tr><td colSpan="6" className="text-center">Không có dữ liệu</td></tr>}
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
                    previousLabel="<"
                    nextLabel=">"
                    previousClassName="page-item"
                    nextClassName="page-item"
                    previousLinkClassName="page-link"
                    nextLinkClassName="page-link"
                />
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{isEditMode ? "Cập nhật" : "Thêm"} Tuyển dụng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Tiêu đề</Form.Label>
                            <Form.Control value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Chuyên khoa</Form.Label>
                            <Select
                                options={specialties.map(s => ({ value: s.id, label: s.name }))}
                                value={specialties.find(s => s.id === formData.departmentId) ? { value: formData.departmentId, label: specialties.find(s => s.id === formData.departmentId).name } : null}
                                onChange={(opt) => setFormData({ ...formData, departmentId: opt.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Mô tả</Form.Label>
                            <Form.Control as="textarea" rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Yêu cầu</Form.Label>
                            <Form.Control as="textarea" rows={3} value={formData.requirement} onChange={(e) => setFormData({ ...formData, requirement: e.target.value })} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Quyền lợi</Form.Label>
                            <Form.Control as="textarea" rows={3} value={formData.benefit} onChange={(e) => setFormData({ ...formData, benefit: e.target.value })} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Deadline</Form.Label>
                            <Form.Control type="date" value={formData.deadline} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Ảnh</Form.Label>
                            <Form.Control type="file" accept="image/*" onChange={handleImage} />
                            {preview && <img src={preview} alt="preview" height={70} className="mt-2" />}
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Trạng thái</Form.Label>
                            <Form.Select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                                <option value="OPEN">OPEN</option>
                                <option value="CLOSED">CLOSED</option>
                            </Form.Select>
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
                    Bạn có chắc muốn xoá tin tuyển dụng
                    <strong> {recruitmentToDelete?.title}</strong> không?
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
        </div>
    );
};

export default RecruitmentTable;
