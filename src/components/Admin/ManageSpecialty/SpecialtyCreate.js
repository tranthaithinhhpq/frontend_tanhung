import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from '../../../setup/axios';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';

const SpecialtyCreate = () => {
    const [form, setForm] = useState({ name: '', description: '', markdownContent: '' });
    const [image, setImage] = useState(null);
    const [previewImg, setPreviewImg] = useState('');
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', form.name);
        data.append('description', form.description);
        data.append('markdownContent', form.markdownContent);
        data.append('image', image);

        const res = await axios.post('/api/v1/specialty', data);
        if (res.EC === 0) {
            toast.success('Tạo chuyên khoa thành công');
            history.push('/admin/specialty');
        } else {
            toast.error(res.EM || 'Lỗi khi tạo chuyên khoa');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreviewImg(URL.createObjectURL(file));
        }
    };

    return (
        <div className="container mt-4">
            <h4>Tạo mới chuyên khoa</h4>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Tên chuyên khoa</Form.Label>
                    <Form.Control
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Mô tả ngắn</Form.Label>
                    <Form.Control
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Nội dung chi tiết</Form.Label>
                    <ReactQuill
                        value={form.markdownContent}
                        onChange={(value) => setForm({ ...form, markdownContent: value })}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Ảnh</Form.Label>
                    <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
                </Form.Group>
                {previewImg && (
                    <div className="mb-3">
                        <img
                            src={previewImg}
                            alt="preview"
                            style={{ maxWidth: 150, maxHeight: 150, objectFit: 'cover' }}
                        />
                    </div>
                )}
                <Button type="submit">Tạo mới</Button>
            </Form>
        </div>
    );
};

export default SpecialtyCreate;
