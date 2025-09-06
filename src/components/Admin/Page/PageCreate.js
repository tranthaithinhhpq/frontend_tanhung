import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Form, Card, Row, Col, Image } from 'react-bootstrap';
import axios from '../../../setup/axios';
import { toast } from 'react-toastify';
import CustomHtmlEditor from '../../Common/CustomHtmlEditor';

const PageCreate = () => {
    const history = useHistory();

    const [slug, setSlug] = useState('');
    const [title, setTitle] = useState('');
    const [videoYoutubeId, setVideoYoutubeId] = useState('');
    const [status, setStatus] = useState(true);
    const [section, setSection] = useState('about');
    const [contentThumbnail, setContentThumbnail] = useState('');
    const [previewMode, setPreviewMode] = useState(false);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [showFullImg, setShowFullImg] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const fileName = file.name;

        // Regex: chỉ cho phép chữ không dấu, số, gạch dưới, gạch ngang, dấu chấm
        const validRegex = /^[a-zA-Z0-9._-]+$/;

        if (!validRegex.test(fileName)) {
            toast.error("Tên file không hợp lệ! Chỉ cho phép chữ không dấu, số, gạch dưới (_), gạch ngang (-), và dấu chấm (.)");
            e.target.value = ""; // reset input file
            return;
        }

        setImage(file);
        const previewURL = URL.createObjectURL(file);
        setPreview(previewURL);
    };




    const handleSubmit = async () => {
        if (!slug || !title || !contentThumbnail || !section) {
            toast.error('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('slug', slug);
            formData.append('title', title);
            formData.append('section', section);
            formData.append('videoYoutubeId', videoYoutubeId);
            formData.append('status', status); // boolean sẽ tự chuyển thành "true"/"false"
            formData.append('contentThumbnail', contentThumbnail);
            if (image) formData.append('image', image); // 👈 đây là file ảnh

            const res = await axios.post('/api/v1/admin/page/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (res.EC === 0) {
                toast.success('Tạo trang thành công!');
                history.push('/admin/page');
            } else {
                toast.error(res.EM || 'Tạo trang thất bại');
            }
        } catch (err) {
            toast.error('Lỗi khi tạo trang!');
            console.error(err);
        }
    };

    return (
        <div className="container py-4">
            <h3>Thêm mới trang</h3>
            <Row>
                <Col md={previewMode ? 6 : 12}>
                    <Form.Group className="mb-3">
                        <Form.Label>Slug:</Form.Label>
                        <Form.Control value={slug} onChange={e => setSlug(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Tiêu đề:</Form.Label>
                        <Form.Control value={title} onChange={e => setTitle(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Section:</Form.Label>
                        <Form.Select value={section} onChange={e => setSection(e.target.value)}>
                            <option value="about">Giới thiệu</option>
                            <option value="client">Khách hàng</option>
                            <option value="contact">Liên hệ</option>
                            <option value="price">Bảng giá</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Video Youtube ID (nếu có):</Form.Label>
                        <Form.Control value={videoYoutubeId} onChange={e => setVideoYoutubeId(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Trạng thái:</Form.Label>
                        <Form.Check
                            type="switch"
                            label={status ? "Hiển thị" : "Ẩn"}
                            checked={status}
                            onChange={() => setStatus(!status)}
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
                        <CustomHtmlEditor value={contentThumbnail} onChange={setContentThumbnail} />
                    </Form.Group>

                    <div className="mb-3">
                        <Button variant="secondary" className="me-2" onClick={() => setPreviewMode(!previewMode)}>
                            {previewMode ? 'Ẩn Preview' : 'Xem trước'}
                        </Button>
                        <Button variant="primary" onClick={handleSubmit}>Tạo mới</Button>
                    </div>
                </Col>

                {previewMode && (
                    <Col md={6}>
                        <Card className="h-100 overflow-auto mt-2 mt-md-0">
                            <Card.Body>
                                <h4>{title || '(Tiêu đề)'}</h4>
                                <p><strong>Slug:</strong> {slug}</p>
                                <p><strong>Section:</strong> {section}</p>
                                <p><strong>Youtube:</strong> {videoYoutubeId || '(Không có)'}</p>
                                <p><strong>Trạng thái:</strong> {status ? 'Hiển thị' : 'Ẩn'}</p>
                                {preview && (
                                    <img
                                        src={preview}
                                        alt="preview"
                                        style={{ maxWidth: '100%', marginBottom: 10 }}
                                    />
                                )}
                                <div className="ql-editor" dangerouslySetInnerHTML={{ __html: contentThumbnail }} />
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

export default PageCreate;
