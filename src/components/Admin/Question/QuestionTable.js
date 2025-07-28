import React, { useEffect, useState, useCallback } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import axios from '../../../setup/axios';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';

const QuestionTable = () => {
    const [questions, setQuestions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(5);
    const [totalPage, setTotalPage] = useState(0);

    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        fullName: '',
        email: '',
        phoneNumber: '',
        questionTitle: '',
        questionContent: '',
        answerContent: '',
        status: 'pending'
    });

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [questionToDelete, setQuestionToDelete] = useState(null);

    const fetchQuestions = useCallback(async () => {
        try {
            const res = await axios.get(`/api/v1/question?page=${currentPage}&limit=${limit}`);
            if (res.EC === 0) {
                setQuestions(res.DT.rows);
                setTotalPage(res.DT.totalPages);
            } else {
                toast.error(res.EM);
            }
        } catch (err) {
            toast.error("Lỗi tải danh sách câu hỏi");
        }
    }, [currentPage, limit]);

    useEffect(() => {
        fetchQuestions();
    }, [fetchQuestions]);

    const handlePageClick = (event) => {
        setCurrentPage(event.selected + 1);
    };

    const handleAdd = () => {
        setFormData({
            id: null,
            fullName: '',
            email: '',
            phoneNumber: '',
            questionTitle: '',
            questionContent: '',
            answerContent: '',
            status: 'pending'
        });
        setIsEditMode(false);
        setShowModal(true);
    };

    const handleEdit = (question) => {
        setFormData(question);
        setIsEditMode(true);
        setShowModal(true);
    };

    const handleSave = async () => {
        try {
            const res = isEditMode
                ? await axios.put(`/api/v1/question/${formData.id}`, formData)
                : await axios.post(`/api/v1/question`, formData);

            if (res.EC === 0) {
                toast.success(res.EM);
                fetchQuestions();
                setShowModal(false);
            } else {
                toast.error(res.EM);
            }
        } catch (err) {
            toast.error("Lỗi khi lưu câu hỏi");
        }
    };

    const confirmDelete = async () => {
        try {
            const res = await axios.post(`/api/v1/question/delete`, { id: questionToDelete.id });
            if (res.EC === 0) {
                toast.success(res.EM);
                fetchQuestions();
            } else {
                toast.error(res.EM);
            }
        } catch (err) {
            toast.error("Lỗi khi xoá câu hỏi");
        } finally {
            setShowDeleteModal(false);
        }
    };

    return (
        <div className="container mt-4">
            <h3>Quản lý câu hỏi</h3>
            <Button className="mb-3" onClick={handleAdd}>
                <i className="fa fa-plus"></i> Thêm câu hỏi
            </Button>
            <Table bordered hover>
                <thead>
                    <tr>
                        <th>Họ tên</th>
                        <th>Email</th>
                        <th>Tiêu đề</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {questions.length > 0 ? questions.map((q) => (
                        <tr key={q.id}>
                            <td>{q.fullName}</td>
                            <td>{q.email}</td>
                            <td>{q.questionTitle}</td>
                            <td>{q.status}</td>
                            <td>
                                <i className="fa fa-pencil edit" onClick={() => handleEdit(q)}></i>
                                <i className="fa fa-trash delete text-danger" onClick={() => {
                                    setQuestionToDelete(q);
                                    setShowDeleteModal(true);
                                }}></i>
                            </td>
                        </tr>
                    )) : (
                        <tr><td colSpan="5" className="text-center">Không có câu hỏi</td></tr>
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
                    <Modal.Title>{isEditMode ? 'Sửa câu hỏi' : 'Thêm câu hỏi'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Họ tên</Form.Label>
                            <Form.Control type="text" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Số điện thoại</Form.Label>
                            <Form.Control type="text" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Tiêu đề câu hỏi</Form.Label>
                            <Form.Control type="text" value={formData.questionTitle} onChange={(e) => setFormData({ ...formData, questionTitle: e.target.value })} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Nội dung câu hỏi</Form.Label>
                            <Form.Control as="textarea" rows={3} value={formData.questionContent} onChange={(e) => setFormData({ ...formData, questionContent: e.target.value })} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Trả lời (gửi qua email)</Form.Label>
                            <Form.Control as="textarea" rows={3} value={formData.answerContent} onChange={(e) => setFormData({ ...formData, answerContent: e.target.value })} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Trạng thái</Form.Label>
                            <Form.Control as="select" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                                <option value="pending">Chờ xử lý</option>
                                <option value="answered">Đã trả lời</option>
                                <option value="spam">Spam</option>
                            </Form.Control>
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
                    Bạn có chắc muốn xoá câu hỏi này không?
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

export default QuestionTable;
