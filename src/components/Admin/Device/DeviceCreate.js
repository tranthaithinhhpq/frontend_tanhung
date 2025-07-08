// import React, { useState } from 'react';
// import { Form, Button } from 'react-bootstrap';
// import { useHistory } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import axios from '../../../setup/axios';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';

// const DeviceCreate = () => {
//     const [form, setForm] = useState({ name: '', code: '', category: '', markdownContent: '' });
//     const [image, setImage] = useState(null);
//     const history = useHistory();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const data = new FormData();
//         Object.entries(form).forEach(([key, value]) => data.append(key, value));
//         if (image) data.append('image', image);

//         const res = await axios.post('/api/v1/device', data);
//         if (res.EC === 0) {
//             toast.success('Tạo thiết bị thành công');
//             history.push('/admin/device');
//         } else {
//             toast.error(res.EM || 'Lỗi tạo thiết bị');
//         }
//     };

//     return (
//         <div className="container mt-4">
//             <h4>Tạo mới thiết bị</h4>
//             <Form onSubmit={handleSubmit}>
//                 <Form.Group className="mb-3">
//                     <Form.Label>Tên thiết bị</Form.Label>
//                     <Form.Control value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                     <Form.Label>Mã thiết bị</Form.Label>
//                     <Form.Control value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                     <Form.Label>Loại thiết bị</Form.Label>
//                     <Form.Control value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                     <Form.Label>Chi tiết thiết bị</Form.Label>
//                     <ReactQuill value={form.markdownContent} onChange={(val) => setForm({ ...form, markdownContent: val })} />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                     <Form.Label>Ảnh đại diện</Form.Label>
//                     <Form.Control type="file" onChange={(e) => setImage(e.target.files[0])} />
//                 </Form.Group>
//                 <Button type="submit">Tạo mới</Button>
//             </Form>
//         </div>
//     );
// };

// export default DeviceCreate;



import React, { useState } from 'react';
import { Form, Button, Image } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../../../setup/axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const DeviceCreate = () => {
    const [form, setForm] = useState({
        name: '',
        code: '',
        category: '',
        markdownContent: ''
    });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
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
        setImage(file);
        if (file) {
            const previewURL = URL.createObjectURL(file);
            setPreview(previewURL);
        }
    };

    return (
        <div className="container mt-4">
            <h4>Tạo mới thiết bị</h4>
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
                    <Form.Label>Chi tiết thiết bị</Form.Label>
                    <ReactQuill
                        value={form.markdownContent}
                        onChange={(val) => setForm({ ...form, markdownContent: val })}
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
                                style={{ width: '180px', height: 'auto', objectFit: 'cover' }}
                            />
                        </div>
                    )}
                </Form.Group>

                <Button type="submit">Tạo mới</Button>
            </Form>
        </div>
    );
};

export default DeviceCreate;
