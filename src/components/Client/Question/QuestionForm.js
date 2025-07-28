import React, { useState } from 'react';
import axios from '../../../setup/axios';
import { toast } from 'react-toastify';

const QuestionForm = () => {
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        questionTitle: '',
        questionContent: ''
    });

    const handleSubmit = async () => {
        if (!form.fullName || !form.email || !form.questionTitle || !form.questionContent) {
            toast.error("Vui lòng điền đầy đủ các trường bắt buộc");
            return;
        }

        try {
            const res = await axios.post('/api/v1/question', form);
            if (res.EC === 0) {
                toast.success("Gửi câu hỏi thành công");
                setForm({
                    fullName: '',
                    email: '',
                    phoneNumber: '',
                    questionTitle: '',
                    questionContent: ''
                });
            } else {
                toast.error(res.EM || "Gửi thất bại");
            }
        } catch (error) {
            console.error("❌ Gửi câu hỏi lỗi:", error);
            toast.error("Lỗi khi gửi câu hỏi");
        }
    };

    return (
        <div className="container mt-4">
            <h3>Gửi câu hỏi cho bệnh viện</h3>

            <div className="mb-3">
                <label>Họ tên *</label>
                <input
                    className="form-control"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                />
            </div>

            <div className="mb-3">
                <label>Email *</label>
                <input
                    type="email"
                    className="form-control"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
            </div>

            <div className="mb-3">
                <label>Số điện thoại</label>
                <input
                    className="form-control"
                    value={form.phoneNumber}
                    onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                />
            </div>

            <div className="mb-3">
                <label>Tiêu đề câu hỏi *</label>
                <input
                    className="form-control"
                    value={form.questionTitle}
                    onChange={(e) => setForm({ ...form, questionTitle: e.target.value })}
                />
            </div>

            <div className="mb-3">
                <label>Nội dung câu hỏi *</label>
                <textarea
                    className="form-control"
                    rows={5}
                    value={form.questionContent}
                    onChange={(e) => setForm({ ...form, questionContent: e.target.value })}
                />
            </div>

            <button className="btn btn-primary" onClick={handleSubmit}>
                Gửi câu hỏi
            </button>
        </div>
    );
};

export default QuestionForm;
