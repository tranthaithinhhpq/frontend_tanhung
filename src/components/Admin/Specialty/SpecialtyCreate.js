import React, { useState } from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import axios from '../../../setup/axios';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import CustomHtmlEditor from '../../Common/CustomHtmlEditor';

const SpecialtyCreate = () => {
    const [form, setForm] = useState({ name: '', description: '', markdownContent: '' });
    const [image, setImage] = useState(null);
    const [previewImg, setPreviewImg] = useState('');
    const [previewMode, setPreviewMode] = useState(false);
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', form.name);
        data.append('description', form.description);
        data.append('markdownContent', form.markdownContent);
        data.append('image', image);

        const res = await axios.post('/api/v1/admin/specialty/create', data);
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
                            <Form.Label>Ảnh</Form.Label>
                            <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
                            {previewImg && (
                                <div className="mt-2">
                                    <img
                                        src={previewImg}
                                        alt="preview"
                                        style={{ maxWidth: 150, maxHeight: 150, objectFit: 'cover' }}
                                    />
                                </div>
                            )}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <CustomHtmlEditor
                                value={form.markdownContent}
                                onChange={(value) => setForm({ ...form, markdownContent: value })}
                            />
                        </Form.Group>

                        <div className="d-flex">
                            <Button
                                variant="secondary"
                                className="me-2"
                                onClick={() => setPreviewMode(!previewMode)}
                            >
                                {previewMode ? 'Ẩn Preview' : 'Fast Preview'}
                            </Button>
                            <Button type="submit" variant="primary">Tạo mới</Button>
                        </div>
                    </Form>
                </Col>

                {previewMode && (
                    <Col md={6}>
                        <Card className="h-100 overflow-auto mt-2">
                            <Card.Body>
                                <h4>{form.name || '(Tên chuyên khoa)'}</h4>
                                <p><strong>Mô tả ngắn:</strong> {form.description || '(Chưa có mô tả)'}</p>
                                {previewImg && (
                                    <img
                                        src={previewImg}
                                        alt="preview full"
                                        style={{ maxWidth: '100%', height: 'auto', marginBottom: 10 }}
                                    />
                                )}
                                <div className="ql-editor" dangerouslySetInnerHTML={{ __html: form.markdownContent }} />
                            </Card.Body>
                        </Card>
                    </Col>
                )}
            </Row>
        </div>
    );
};

export default SpecialtyCreate;
