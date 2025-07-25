// // import React, { useState } from 'react';
// // import { Button, Form, Card } from 'react-bootstrap';
// // import ReactQuill from 'react-quill';
// // import 'react-quill/dist/quill.snow.css';
// // import axios from '../../../setup/axios';
// // import { toast } from 'react-toastify';

// // const PageCreate = () => {
// //     const [slug, setSlug] = useState('');
// //     const [title, setTitle] = useState('');
// //     const [videoYoutubeId, setVideoYoutubeId] = useState('');
// //     const [status, setStatus] = useState(true);
// //     const [contentThumbnail, setContentThumbnail] = useState('');
// //     const [previewMode, setPreviewMode] = useState(false);

// //     const handleSubmit = async () => {
// //         if (!slug || !title || !contentThumbnail) {
// //             toast.error('Vui lòng điền đầy đủ thông tin!');
// //             return;
// //         }

// //         try {
// //             const res = await axios.post('/api/v1/page', {
// //                 slug,
// //                 title,
// //                 videoYoutubeId,
// //                 status,
// //                 contentThumbnail
// //             });

// //             console.log("res.data value : ", res.data);
// //             console.log("res : ", res);

// //             if (res.EC === 0) {
// //                 toast.success('Tạo trang thành công!');
// //                 // reset
// //                 setSlug('');
// //                 setTitle('');
// //                 setVideoYoutubeId('');
// //                 setStatus(true);
// //                 setContentThumbnail('');
// //             } else {
// //                 toast.error(res.EM);
// //             }
// //         } catch (err) {
// //             toast.error('Lỗi khi gửi dữ liệu!');
// //             console.error(err);
// //         }
// //     };

// //     return (
// //         <div className="container py-4">
// //             <h3>Tạo mới trang hiển thị client</h3>
// //             <Form.Group className="mb-3">
// //                 <Form.Label>Slug:</Form.Label>
// //                 <Form.Control value={slug} onChange={e => setSlug(e.target.value)} placeholder="slug-example" />
// //             </Form.Group>

// //             <Form.Group className="mb-3">
// //                 <Form.Label>Tiêu đề:</Form.Label>
// //                 <Form.Control value={title} onChange={e => setTitle(e.target.value)} />
// //             </Form.Group>

// //             <Form.Group className="mb-3">
// //                 <Form.Label>Video Youtube ID (nếu có):</Form.Label>
// //                 <Form.Control value={videoYoutubeId} onChange={e => setVideoYoutubeId(e.target.value)} />
// //             </Form.Group>

// //             <Form.Group className="mb-3">
// //                 <Form.Label>Trạng thái:</Form.Label>
// //                 <Form.Check
// //                     type="switch"
// //                     label={status ? "Hiển thị" : "Ẩn"}
// //                     checked={status}
// //                     onChange={() => setStatus(!status)}
// //                 />
// //             </Form.Group>

// //             <Form.Group className="mb-3">
// //                 <Form.Label>Nội dung trang (dùng làm content hiển thị client):</Form.Label>
// //                 <ReactQuill value={contentThumbnail} onChange={setContentThumbnail} />
// //             </Form.Group>

// //             <div className="mb-3">
// //                 <Button variant="secondary" className="me-2" onClick={() => setPreviewMode(!previewMode)}>
// //                     {previewMode ? 'Ẩn Preview' : 'Xem trước'}
// //                 </Button>
// //                 <Button variant="primary" onClick={handleSubmit}>Lưu trang</Button>
// //             </div>

// //             {previewMode && (
// //                 <Card className="mt-4">
// //                     <Card.Body>
// //                         <h4>{title}</h4>
// //                         <p><strong>Slug:</strong> {slug}</p>
// //                         <p><strong>Youtube:</strong> {videoYoutubeId}</p>
// //                         <div className="ql-editor" dangerouslySetInnerHTML={{ __html: contentThumbnail }} />
// //                     </Card.Body>
// //                 </Card>
// //             )}
// //         </div>
// //     );
// // };

// // export default PageCreate;


// import React, { useState } from 'react';
// import { useHistory } from 'react-router-dom';
// import { Button, Form, Card, Row, Col } from 'react-bootstrap';
// import axios from '../../../setup/axios';
// import { toast } from 'react-toastify';
// import CustomHtmlEditor from '../../Common/CustomHtmlEditor';

// const PageCreate = () => {
//     const history = useHistory();

//     const [slug, setSlug] = useState('');
//     const [title, setTitle] = useState('');
//     const [videoYoutubeId, setVideoYoutubeId] = useState('');
//     const [status, setStatus] = useState(true);
//     const [contentThumbnail, setContentThumbnail] = useState('');
//     const [previewMode, setPreviewMode] = useState(false);

//     const handleSubmit = async () => {
//         if (!slug || !title || !contentThumbnail) {
//             toast.error('Vui lòng điền đầy đủ thông tin!');
//             return;
//         }

//         try {
//             const res = await axios.post('/api/v1/page', {
//                 slug,
//                 title,
//                 videoYoutubeId,
//                 status,
//                 contentThumbnail
//             });

//             if (res.EC === 0) {
//                 toast.success('Tạo trang thành công!');
//                 history.push('/admin/page');
//             } else {
//                 toast.error(res.EM || 'Tạo trang thất bại');
//             }
//         } catch (err) {
//             toast.error('Lỗi khi tạo trang!');
//             console.error(err);
//         }
//     };

//     return (
//         <div className="container py-4">
//             <h3>Thêm mới trang</h3>
//             <Row>
//                 <Col md={previewMode ? 6 : 12}>
//                     <Form.Group className="mb-3">
//                         <Form.Label>Slug:</Form.Label>
//                         <Form.Control value={slug} onChange={e => setSlug(e.target.value)} />
//                     </Form.Group>

//                     <Form.Group className="mb-3">
//                         <Form.Label>Tiêu đề:</Form.Label>
//                         <Form.Control value={title} onChange={e => setTitle(e.target.value)} />
//                     </Form.Group>

//                     <Form.Group className="mb-3">
//                         <Form.Label>Video Youtube ID (nếu có):</Form.Label>
//                         <Form.Control value={videoYoutubeId} onChange={e => setVideoYoutubeId(e.target.value)} />
//                     </Form.Group>

//                     <Form.Group className="mb-3">
//                         <Form.Label>Trạng thái:</Form.Label>
//                         <Form.Check
//                             type="switch"
//                             label={status ? "Hiển thị" : "Ẩn"}
//                             checked={status}
//                             onChange={() => setStatus(!status)}
//                         />
//                     </Form.Group>

//                     <Form.Group className="mb-3">
//                         <Form.Label>Nội dung trang:</Form.Label>
//                         <CustomHtmlEditor value={contentThumbnail} onChange={setContentThumbnail} />
//                     </Form.Group>

//                     <div className="mb-3">
//                         <Button variant="secondary" className="me-2" onClick={() => setPreviewMode(!previewMode)}>
//                             {previewMode ? 'Ẩn Preview' : 'Xem trước'}
//                         </Button>
//                         <Button variant="primary" onClick={handleSubmit}>Tạo mới</Button>
//                     </div>
//                 </Col>

//                 {previewMode && (
//                     <Col md={6}>
//                         <Card className="h-100 overflow-auto mt-2 mt-md-0">
//                             <Card.Body>
//                                 <h4>{title || '(Tiêu đề)'}</h4>
//                                 <p><strong>Slug:</strong> {slug}</p>
//                                 <p><strong>Youtube:</strong> {videoYoutubeId || '(Không có)'}</p>
//                                 <p><strong>Trạng thái:</strong> {status ? 'Hiển thị' : 'Ẩn'}</p>
//                                 <div className="ql-editor" dangerouslySetInnerHTML={{ __html: contentThumbnail }} />
//                             </Card.Body>
//                         </Card>
//                     </Col>
//                 )}
//             </Row>
//         </div>
//     );
// };

// export default PageCreate;


import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Form, Card, Row, Col } from 'react-bootstrap';
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

    const handleSubmit = async () => {
        if (!slug || !title || !contentThumbnail || !section) {
            toast.error('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        try {
            const res = await axios.post('/api/v1/page', {
                slug,
                title,
                section,
                videoYoutubeId,
                status,
                contentThumbnail
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
                            <option value="about">about</option>
                            <option value="client">client</option>
                            <option value="recruitment">recruitment</option>
                            <option value="price">price</option>
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
                                <div className="ql-editor" dangerouslySetInnerHTML={{ __html: contentThumbnail }} />
                            </Card.Body>
                        </Card>
                    </Col>
                )}
            </Row>
        </div>
    );
};

export default PageCreate;
