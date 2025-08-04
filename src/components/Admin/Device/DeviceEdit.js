import React, { useEffect, useState } from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import { useParams, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../../../setup/axios';
import CustomHtmlEditor from '../../Common/CustomHtmlEditor';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';

const DeviceEdit = () => {
    const { id } = useParams();
    const [form, setForm] = useState({ name: '', code: '', category: '', markdownContent: '', image: '' });
    const [image, setImage] = useState(null);
    const [previewImg, setPreviewImg] = useState('');
    const [showFullImg, setShowFullImg] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
    const history = useHistory();

    useEffect(() => {
        axios.get('/api/v1/admin/device/update').then(res => {
            const device = res.DT.find(x => x.id === +id);
            if (device) {
                setForm(device);
                setPreviewImg(`${BACKEND_URL}${device.image}`);
            }
        });
    }, [id]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreviewImg(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.entries(form).forEach(([key, value]) => data.append(key, value));
        if (image) data.append('image', image);

        const res = await axios.put(`/api/v1/admin/device/update/${id}`, data);
        if (res.EC === 0) {
            toast.success('Cập nhật thiết bị thành công');
            history.push('/admin/device');
        } else {
            toast.error(res.EM || 'Lỗi cập nhật');
        }
    };

    return (
        <div className="container mt-4">
            <h4>Chỉnh sửa thiết bị</h4>
            <Row>
                <Col md={previewMode ? 6 : 12}>
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
                            <Form.Label>Ảnh đại diện hiện tại</Form.Label><br />
                            {previewImg && (
                                <img
                                    src={previewImg}
                                    alt="device preview"
                                    style={{ maxWidth: 150, height: 100, objectFit: 'cover', cursor: 'pointer' }}
                                    onClick={() => setShowFullImg(true)}
                                />
                            )}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Chọn ảnh mới (nếu có)</Form.Label>
                            <Form.Control type="file" onChange={handleImageChange} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <CustomHtmlEditor value={form.markdownContent} onChange={(val) => setForm({ ...form, markdownContent: val })} />
                        </Form.Group>

                        <div className="d-flex gap-2">
                            <Button variant="secondary" onClick={() => setPreviewMode(!previewMode)}>
                                {previewMode ? "Ẩn Preview" : "Fast Preview"}
                            </Button>
                            <Button type="submit" variant="primary">Lưu</Button>
                        </div>
                    </Form>
                </Col>

                {previewMode && (
                    <Col md={6}>
                        <Card className="h-100 overflow-auto mt-2 mt-md-0">
                            <Card.Body>
                                <h5>{form.name || "(Tên thiết bị)"}</h5>
                                <p><strong>Mã:</strong> {form.code || "(Mã chưa nhập)"}</p>
                                <p><strong>Loại:</strong> {form.category || "(Loại chưa nhập)"}</p>
                                {previewImg && <img src={previewImg} alt="preview" style={{ maxWidth: '100%', marginBottom: 10 }} />}
                                <div className="ql-editor" dangerouslySetInnerHTML={{ __html: form.markdownContent }} />
                            </Card.Body>
                        </Card>
                    </Col>
                )}
            </Row>

            {showFullImg && (
                <div
                    onClick={() => setShowFullImg(false)}
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.8)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 9999
                    }}
                >
                    <img
                        src={previewImg}
                        alt="full preview"
                        style={{ maxWidth: "90%", maxHeight: "90%", objectFit: "contain" }}
                    />
                </div>
            )}
        </div>
    );
};

export default DeviceEdit;
