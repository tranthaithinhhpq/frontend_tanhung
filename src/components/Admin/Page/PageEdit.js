// import React, { useEffect, useState } from 'react';
// import { useParams, useHistory } from 'react-router-dom';
// import { Button, Form, Card } from 'react-bootstrap';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
// import axios from '../../../setup/axios';
// import { toast } from 'react-toastify';

// const PageEdit = () => {
//     const { id } = useParams();
//     const history = useHistory();

//     const [slug, setSlug] = useState('');
//     const [title, setTitle] = useState('');
//     const [videoYoutubeId, setVideoYoutubeId] = useState('');
//     const [status, setStatus] = useState(true);
//     const [contentThumbnail, setContentThumbnail] = useState('');
//     const [previewMode, setPreviewMode] = useState(false);

//     useEffect(() => {
//         fetchPage();
//     }, [id]);

//     const fetchPage = async () => {
//         try {
//             const res = await axios.get(`/api/v1/page/${id}`);
//             if (res.EC === 0) {
//                 const data = res.DT;
//                 setSlug(data.slug);
//                 setTitle(data.title);
//                 setVideoYoutubeId(data.videoYoutubeId || '');
//                 setStatus(data.status);
//                 setContentThumbnail(data.contentThumbnail || '');
//             } else {
//                 toast.error(res.EM || 'Không tìm thấy dữ liệu');
//             }
//         } catch (err) {
//             toast.error('Lỗi khi lấy dữ liệu');
//         }
//     };

//     const handleSubmit = async () => {
//         if (!slug || !title || !contentThumbnail) {
//             toast.error('Vui lòng điền đầy đủ thông tin!');
//             return;
//         }

//         try {
//             const res = await axios.put(`/api/v1/page/${id}`, {
//                 slug,
//                 title,
//                 videoYoutubeId,
//                 status,
//                 contentThumbnail
//             });
//             if (res.EC === 0) {
//                 toast.success('Cập nhật thành công!');
//                 history.push('/admin/page');
//             } else {
//                 toast.error(res.EM);
//             }
//         } catch (err) {
//             toast.error('Lỗi khi cập nhật dữ liệu!');
//             console.error(err);
//         }
//     };

//     return (
//         <div className="container py-4">
//             <h3>Chỉnh sửa trang</h3>
//             <Form.Group className="mb-3">
//                 <Form.Label>Slug:</Form.Label>
//                 <Form.Control value={slug} onChange={e => setSlug(e.target.value)} />
//             </Form.Group>

//             <Form.Group className="mb-3">
//                 <Form.Label>Tiêu đề:</Form.Label>
//                 <Form.Control value={title} onChange={e => setTitle(e.target.value)} />
//             </Form.Group>

//             <Form.Group className="mb-3">
//                 <Form.Label>Video Youtube ID (nếu có):</Form.Label>
//                 <Form.Control value={videoYoutubeId} onChange={e => setVideoYoutubeId(e.target.value)} />
//             </Form.Group>

//             <Form.Group className="mb-3">
//                 <Form.Label>Trạng thái:</Form.Label>
//                 <Form.Check
//                     type="switch"
//                     label={status ? "Hiển thị" : "Ẩn"}
//                     checked={status}
//                     onChange={() => setStatus(!status)}
//                 />
//             </Form.Group>

//             <Form.Group className="mb-3">
//                 <Form.Label>Nội dung trang:</Form.Label>
//                 <ReactQuill value={contentThumbnail} onChange={setContentThumbnail} />
//             </Form.Group>

//             <div className="mb-3">
//                 <Button variant="secondary" className="me-2" onClick={() => setPreviewMode(!previewMode)}>
//                     {previewMode ? 'Ẩn Preview' : 'Xem trước'}
//                 </Button>
//                 <Button variant="primary" onClick={handleSubmit}>Cập nhật</Button>
//             </div>

//             {previewMode && (
//                 <Card className="mt-4">
//                     <Card.Body>
//                         <h4>{title}</h4>
//                         <p><strong>Slug:</strong> {slug}</p>
//                         <p><strong>Youtube:</strong> {videoYoutubeId}</p>
//                         <div className="ql-editor" dangerouslySetInnerHTML={{ __html: contentThumbnail }} />
//                     </Card.Body>
//                 </Card>
//             )}
//         </div>
//     );
// };

// export default PageEdit;

import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Button, Form, Card, Row, Col } from 'react-bootstrap';
import axios from '../../../setup/axios';
import { toast } from 'react-toastify';
import CustomHtmlEditor from '../../Common/CustomHtmlEditor';


const PageEdit = () => {
    const { id } = useParams();
    const history = useHistory();

    const [slug, setSlug] = useState('');
    const [title, setTitle] = useState('');
    const [videoYoutubeId, setVideoYoutubeId] = useState('');
    const [status, setStatus] = useState(true);
    const [contentThumbnail, setContentThumbnail] = useState('');
    const [previewMode, setPreviewMode] = useState(false);
    const [section, setSection] = useState('about');

    useEffect(() => {
        fetchPage();
    }, [id]);

    const fetchPage = async () => {
        try {
            const res = await axios.get(`/api/v1/page/${id}`);
            if (res.EC === 0) {
                const data = res.DT;
                setSlug(data.slug);
                setTitle(data.title);
                setSection(data.section || 'about');
                setVideoYoutubeId(data.videoYoutubeId || '');
                setStatus(data.status);
                setContentThumbnail(data.contentThumbnail || '');
            } else {
                toast.error(res.EM || 'Không tìm thấy dữ liệu');
            }
        } catch (err) {
            toast.error('Lỗi khi lấy dữ liệu');
        }
    };

    const handleSubmit = async () => {
        if (!slug || !title || !contentThumbnail) {
            toast.error('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        try {
            const res = await axios.put(`/api/v1/page/${id}`, {
                slug,
                title,
                section,
                videoYoutubeId,
                status,
                contentThumbnail
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
                            <option value="about">About</option>
                            <option value="client">Client</option>
                            <option value="recruitment">Recruitment</option>
                            <option value="price">Price</option>
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
                        <Form.Label>Nội dung trang:</Form.Label>
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
                                <div className="ql-editor" dangerouslySetInnerHTML={{ __html: contentThumbnail }} />
                            </Card.Body>
                        </Card>
                    </Col>
                )}
            </Row>
        </div>
    );
};

export default PageEdit;
