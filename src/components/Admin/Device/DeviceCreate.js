import React, { useState } from 'react';
import { Form, Button, Image, Row, Col, Card } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../../../setup/axios';
import CustomHtmlEditor from '../../Common/CustomHtmlEditor';

const DeviceCreate = () => {
    const [form, setForm] = useState({
        name: '',
        code: '',
        category: '',
        markdownContent: ''
    });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [showFullImg, setShowFullImg] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.entries(form).forEach(([key, value]) => data.append(key, value));
        if (image) data.append('image', image);

        const res = await axios.post('/api/v1/device', data);
        if (res.EC === 0) {
            toast.success('Tạo thiết bị thành công');
            history.push('/admin/device');
        } else {
            toast.error(res.EM || 'Lỗi tạo thiết bị');
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        console.log("file", file)
        setImage(file);
        console.log("image", image)
        if (file) {
            const previewURL = URL.createObjectURL(file);
            setPreview(previewURL);
        }
    };

    return (
        <div className="container mt-4">
            <h4>Tạo mới thiết bị</h4>
            <Row>
                <Col md={previewMode ? 6 : 12}>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Tên thiết bị</Form.Label>
                            <Form.Control
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Mã thiết bị</Form.Label>
                            <Form.Control
                                value={form.code}
                                onChange={(e) => setForm({ ...form, code: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Loại thiết bị</Form.Label>
                            <Form.Control
                                value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Ảnh đại diện</Form.Label>
                            <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
                            {preview && (
                                <div className="mt-3">
                                    <Image
                                        src={preview}
                                        thumbnail
                                        style={{ width: '180px', height: 'auto', objectFit: 'cover', cursor: 'pointer' }}
                                        onClick={() => setShowFullImg(true)}
                                    />
                                </div>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <CustomHtmlEditor
                                value={form.markdownContent}
                                onChange={(val) => setForm({ ...form, markdownContent: val })}
                            />
                        </Form.Group>



                        <div className="mt-3">
                            <Button variant="secondary" className="me-2" onClick={() => setPreviewMode(!previewMode)}>
                                {previewMode ? 'Ẩn Preview' : 'Fast Preview'}
                            </Button>
                            <Button type="submit">Tạo mới</Button>
                        </div>
                    </Form>
                </Col>

                {previewMode && (
                    <Col md={6}>
                        <Card className="h-100 overflow-auto">
                            <Card.Body>
                                <h2>{form.name || '(Tên thiết bị)'}</h2>
                                <p><strong>Mã thiết bị:</strong> {form.code || '(Chưa nhập)'}</p>
                                <p><strong>Loại thiết bị:</strong> {form.category || '(Chưa nhập)'}</p>
                                {preview && (
                                    <img
                                        src={preview}
                                        alt="preview"
                                        style={{ maxWidth: '100%', marginBottom: 10 }}
                                    />
                                )}
                                <div className="ql-editor" dangerouslySetInnerHTML={{ __html: form.markdownContent }} />
                            </Card.Body>
                        </Card>
                    </Col>
                )}
            </Row>

            {/* Modal xem ảnh lớn */}
            {showFullImg && (
                <div
                    onClick={() => setShowFullImg(false)}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.8)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 9999
                    }}
                >
                    <img
                        src={preview}
                        alt="Full preview"
                        style={{ maxWidth: "90%", maxHeight: "90%", objectFit: "contain" }}
                    />
                </div>
            )}
        </div>
    );
};

export default DeviceCreate;
