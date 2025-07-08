import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useParams, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../../../setup/axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const DeviceEdit = () => {
    const { id } = useParams();
    const [form, setForm] = useState({ name: '', code: '', category: '', markdownContent: '' });
    const [image, setImage] = useState(null);
    const history = useHistory();

    useEffect(() => {
        axios.get('/api/v1/device/read').then(res => {
            const device = res.DT.find(x => x.id === +id);
            if (device) setForm(device);
        });
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.entries(form).forEach(([key, value]) => data.append(key, value));
        if (image) data.append('image', image);

        const res = await axios.put(`/api/v1/device/${id}`, data);
        if (res.EC === 0) {
            toast.success('Cập nhật thiết bị thành công');
            history.push('/admin/device');
        }
    };

    return (
        <div className="container mt-4">
            <h4>Chỉnh sửa thiết bị</h4>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Tên thiết bị</Form.Label>
                    <Form.Control value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Mã thiết bị</Form.Label>
                    <Form.Control value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Loại thiết bị</Form.Label>
                    <Form.Control value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Chi tiết thiết bị</Form.Label>
                    <ReactQuill value={form.markdownContent} onChange={(val) => setForm({ ...form, markdownContent: val })} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Ảnh mới (nếu có)</Form.Label>
                    <Form.Control type="file" onChange={(e) => setImage(e.target.files[0])} />
                </Form.Group>
                <Button type="submit">Lưu</Button>
            </Form>
        </div>
    );
};

export default DeviceEdit;
