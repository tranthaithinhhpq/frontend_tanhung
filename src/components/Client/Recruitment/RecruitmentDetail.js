

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../../setup/axios";
import { Button, Modal, Form, Row, Col, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import './RecruitmentDetail.scss';

const RecruitmentDetail = () => {
    const { id } = useParams();
    const [recruitment, setRecruitment] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        coverLetter: "",
    });
    const [cvFile, setCvFile] = useState(null);

    const validateForm = () => {
        let newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = "Họ tên là bắt buộc";
        }
        if (!formData.email.trim()) {
            newErrors.email = "Email là bắt buộc";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Email không hợp lệ";
        }
        if (!formData.phone.trim()) {
            newErrors.phone = "Số điện thoại là bắt buộc";
        } else if (!/^[0-9]+$/.test(formData.phone)) {
            newErrors.phone = "Chỉ được nhập số";
        }
        if (!formData.coverLetter.trim()) {
            newErrors.coverLetter = "Thư xin việc là bắt buộc";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // true nếu không có lỗi
    };


    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

    useEffect(() => {
        const fetchDetail = async () => {
            const res = await axios.get(`/api/v1/client/recruitment/${id}`);
            if (res.EC === 0) {
                setRecruitment(res.DT);
            } else {
                toast.error(res.EM);
            }
        };
        fetchDetail();
    }, [id]);

    const handleApply = async () => {
        if (!validateForm()) return; // Nếu lỗi thì không submit

        try {
            const form = new FormData();
            form.append("recruitmentId", id);
            form.append("fullName", formData.fullName);
            form.append("email", formData.email);
            form.append("phone", formData.phone);
            form.append("coverLetter", formData.coverLetter);
            if (cvFile) form.append("cvFile", cvFile);

            const res = await axios.post("/api/v1/client/application/apply", form, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (res.EC === 0) {
                toast.success("Ứng tuyển thành công");
                setShowModal(false);
                setFormData({ fullName: "", email: "", phone: "", coverLetter: "" });
                setCvFile(null);
                setErrors({});
            } else {
                toast.error(res.EM);
            }
        } catch (err) {
            console.error(err);
            toast.error("Lỗi khi ứng tuyển");
        }
    };


    if (!recruitment) return <p className="text-center mt-5">Đang tải...</p>;

    return (
        <div className="container mt-4">
            <Row>
                {/* Cột trái: Thông tin chi tiết */}
                <Col md={8}>
                    <h2 className="mb-2">{recruitment.title}</h2>
                    <p className="text-muted">
                        🏥 {recruitment.Specialty?.name}{" "}
                        | 📅 Hạn nộp: {recruitment.deadline || "Không rõ"}{" "}
                        | <Badge bg={recruitment.status === "OPEN" ? "success" : "secondary"}>
                            {recruitment.status === "OPEN" ? "Đang tuyển" : "Đã đóng"}
                        </Badge>
                    </p>

                    {recruitment.image && (
                        <img
                            src={`${BACKEND_URL}${recruitment.image}`}
                            alt="recruitment"
                            className="img-fluid rounded mb-4"
                        />
                    )}

                    {/* Thông tin chi tiết */}
                    <div className="job-detail-box">
                        <h5>📌 Mô tả công việc</h5>
                        <p style={{ whiteSpace: "pre-line" }}>
                            {recruitment.description || "Đang cập nhật"}
                        </p>
                        <hr />
                        <h5>✅ Yêu cầu</h5>
                        <p style={{ whiteSpace: "pre-line" }}>
                            {recruitment.requirement || "Đang cập nhật"}
                        </p>
                        <hr />
                        <h5>💰 Quyền lợi</h5>
                        <p style={{ whiteSpace: "pre-line" }}>
                            {recruitment.benefit || "Đang cập nhật"}
                        </p>
                    </div>
                </Col>


                <Col md={4}>
                    <div
                        className="p-3 border rounded shadow-sm"
                        style={{ position: "sticky", top: "150px" }}
                    >
                        <Button
                            variant={recruitment.status === "OPEN" ? "primary" : "secondary"}
                            size="lg"
                            className="w-100"
                            disabled={recruitment.status !== "OPEN"}
                            onClick={() => setShowModal(true)}
                        >
                            {recruitment.status === "OPEN" ? "Ứng tuyển ngay" : "Đang tạm dừng"}
                        </Button>

                        <div className="mt-3">
                            <p className="mb-1"><b>Hồ sơ ứng tuyển:</b></p>
                            <small>
                                HR sẽ nhận trực tiếp hồ sơ thông qua hệ thống ngay khi hoàn tất ứng tuyển.
                                Ứng viên vui lòng không liên hệ qua email và số điện thoại.
                            </small>
                            <p className="mb-1 mt-2"><b>Thông tin liên hệ:</b></p>
                            <small>email: nhansu@benhvientanhung.com</small>
                        </div>
                    </div>
                </Col>
            </Row>

            {/* Modal ứng tuyển */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Ứng tuyển vị trí: {recruitment.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>{"Họ tên (*)"}</Form.Label>
                            <Form.Control
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                isInvalid={!!errors.fullName}
                            />
                            <Form.Control.Feedback type="invalid">{errors.fullName}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>{"Email (*)"}</Form.Label>
                            <Form.Control
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>{"Số điện thoại (*)"}</Form.Label>
                            <Form.Control
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                isInvalid={!!errors.phone}
                            />
                            <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
                        </Form.Group>



                        <Form.Group className="mb-3">
                            <Form.Label>CV (PDF/DOCX)</Form.Label>
                            <Form.Control
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => setCvFile(e.target.files[0])}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>{"Thư xin việc (*)"}</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={formData.coverLetter}
                                onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                                isInvalid={!!errors.coverLetter}
                            />
                            <Form.Control.Feedback type="invalid">{errors.coverLetter}</Form.Control.Feedback>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Đóng</Button>
                    <Button variant="primary" onClick={handleApply}>Nộp hồ sơ</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default RecruitmentDetail;
