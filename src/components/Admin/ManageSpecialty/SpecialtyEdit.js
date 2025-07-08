import React, { useEffect, useState } from 'react';
import { Form, Button, Image } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from '../../../setup/axios';
import { toast } from 'react-toastify';
import { useHistory, useParams } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';

const SpecialtyEdit = () => {
    const { id } = useParams();
    const [form, setForm] = useState({ name: '', description: '', markdownContent: '', image: '' });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState('');
    const history = useHistory();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const res = await axios.get('/api/v1/specialty/read');
        const current = res.DT.find(item => item.id === +id);
        if (current) {
            setForm(current);
            setPreview(`${BACKEND_URL}${current.image}`);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', form.name);
        data.append('description', form.description);
        data.append('markdownContent', form.markdownContent);
        if (image) data.append('image', image);

        const res = await axios.put(`/api/v1/specialty/${id}`, data);
        if (res.EC === 0) {
            toast.success('Cập nhật thành công');
            history.push('/admin/specialty');
        } else {
            toast.error(res.EM || 'Lỗi cập nhật');
        }
    };

    return (
        <div className="container mt-4">
            <h4>Chỉnh sửa chuyên khoa</h4>
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
                    <Form.Label>Ảnh hiện tại / preview ảnh mới</Form.Label><br />
                    {preview && (
                        <Image
                            src={preview}
                            thumbnail
                            style={{ width: 150, height: 150, objectFit: 'cover', marginBottom: 10 }}
                        />
                    )}
                    <Form.Control type="file" onChange={handleFileChange} />
                </Form.Group>
                <Button type="submit">Lưu</Button>
            </Form>
        </div>
    );
};

export default SpecialtyEdit;
