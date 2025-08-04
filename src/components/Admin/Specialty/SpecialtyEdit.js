import React, { useEffect, useState } from 'react';
import { Form, Button, Image, Row, Col, Card } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import axios from '../../../setup/axios';
import { toast } from 'react-toastify';
import CustomHtmlEditor from '../../Common/CustomHtmlEditor';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';

const SpecialtyEdit = () => {
    const { id } = useParams();
    const history = useHistory();

    const [form, setForm] = useState({ name: '', description: '', markdownContent: '', image: '' });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState('');
    const [previewMode, setPreviewMode] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const res = await axios.get('/api/v1/admin/specialty/update');
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

        const res = await axios.put(`/api/v1/admin/specialty/update/${id}`, data);
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
            <Row>
                <Col md={previewMode ? 6 : 12}>
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

                        <Form.Group className="mb-3">
                            <CustomHtmlEditor
                                value={form.markdownContent}
                                onChange={(val) => setForm({ ...form, markdownContent: val })}
                            />
                        </Form.Group>

                        <div className="d-flex gap-2">
                            <Button variant="secondary" onClick={() => setPreviewMode(!previewMode)}>
                                {previewMode ? 'Ẩn Preview' : 'Fast Preview'}
                            </Button>
                            <Button type="submit" variant="primary">Lưu</Button>
                        </div>
                    </Form>
                </Col>

                {previewMode && (
                    <Col md={6}>
                        <Card className="h-100 overflow-auto">
                            <Card.Body>
                                <h2>{form.name || '(Tên chuyên khoa)'}</h2>
                                <p><strong>Mô tả:</strong> {form.description || '(Không có mô tả)'}</p>
                                {preview && <img src={preview} alt="preview" style={{ maxWidth: '100%', marginBottom: 10 }} />}
                                <div className="ql-editor" dangerouslySetInnerHTML={{ __html: form.markdownContent }} />
                            </Card.Body>
                        </Card>
                    </Col>
                )}
            </Row>
        </div>
    );
};

export default SpecialtyEdit;
