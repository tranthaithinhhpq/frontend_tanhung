

import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Button, Form, Card, Row, Col, Image } from 'react-bootstrap';
import axios from '../../../setup/axios';
import { toast } from 'react-toastify';
import CustomHtmlEditor from '../../Common/CustomHtmlEditor';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

const PageEdit = () => {
    const { id } = useParams();
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
    const [currentImage, setCurrentImage] = useState(null);
    const [showFullImg, setShowFullImg] = useState(false);

    useEffect(() => {
        fetchPage();
    }, [id]);

    const fetchPage = async () => {
        try {
            const res = await axios.get(`/api/v1/admin/page/update/${id}`);
            if (res.EC === 0) {
                const data = res.DT;
                setSlug(data.slug);
                setTitle(data.title);
                setSection(data.section || 'about');
                setVideoYoutubeId(data.videoYoutubeId || '');
                setStatus(data.status);
                setContentThumbnail(data.contentThumbnail || '');
                if (data.image) {
                    setCurrentImage(`${BACKEND_URL}${data.image}`);
                }
            } else {
                toast.error(res.EM || 'Không tìm thấy dữ liệu');
            }
        } catch (err) {
            toast.error('Lỗi khi lấy dữ liệu');
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        if (file) {
            const previewURL = URL.createObjectURL(file);
            setPreview(previewURL);
        }
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
            formData.append('status', status);
            formData.append('contentThumbnail', contentThumbnail);
            if (image) formData.append('image', image);

            const res = await axios.put(`/api/v1/admin/page/update/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.EC === 0) {
                toast.success('Cập nhật thành công!');
                history.push('/admin/page');
            } else {
                toast.error(res.EM);
            }
        } catch (err) {
            toast.error('Lỗi khi cập nhật dữ liệu!');
            console.error(err);
        }
    };

    return (
        <div className="container py-4">
            <h3>Chỉnh sửa trang</h3>
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
                        <Form.Select value={section} onChange={(e) => setSection(e.target.value)}>
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
                        {preview ? (
                            <Image
                                src={preview}
                                thumbnail
                                className="mt-2"
                                style={{ width: '180px', height: 'auto', cursor: 'pointer' }}
                                onClick={() => setShowFullImg(true)}
                            />
                        ) : currentImage && (
                            <Image
                                src={currentImage}
                                thumbnail
                                className="mt-2"
                                style={{ width: '180px', height: 'auto', cursor: 'pointer' }}
                                onClick={() => setShowFullImg(true)}
                            />
                        )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <CustomHtmlEditor value={contentThumbnail} onChange={setContentThumbnail} />
                    </Form.Group>

                    <div className="mb-3">
                        <Button variant="secondary" className="me-2" onClick={() => setPreviewMode(!previewMode)}>
                            {previewMode ? 'Ẩn Preview' : 'Xem trước'}
                        </Button>
                        <Button variant="primary" onClick={handleSubmit}>Cập nhật</Button>
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
                                {(preview || currentImage) && (
                                    <img
                                        src={preview || currentImage}
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
                        src={preview || currentImage}
                        alt="Full preview"
                        style={{ maxWidth: "90%", maxHeight: "90%", objectFit: "contain" }}
                    />
                </div>
            )}
        </div>
    );
};

export default PageEdit;
