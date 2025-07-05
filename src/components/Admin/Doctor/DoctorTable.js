// import React, { useEffect, useState } from 'react';
// import { Table, Button, Image, Modal } from 'react-bootstrap';
// import { useHistory } from 'react-router-dom';
// import axios from '../../../setup/axios';
// import { toast } from 'react-toastify';

// const DoctorTable = () => {
//     const [doctors, setDoctors] = useState([]);
//     const [showModal, setShowModal] = useState(false);
//     const [selectedDoctor, setSelectedDoctor] = useState(null);
//     const history = useHistory();

//     const fetchDoctors = async () => {
//         try {
//             const res = await axios.get('/api/v1/doctor/list'); // API trả danh sách doctor + info
//             if (res.EC === 0) {
//                 setDoctors(res.DT);
//             } else {
//                 toast.error(res.EM);
//             }
//         } catch (err) {
//             console.error(err);
//             toast.error("Lỗi tải danh sách bác sĩ");
//         }
//     };

//     useEffect(() => {
//         fetchDoctors();
//     }, []);

//     const handleDelete = async () => {
//         if (!selectedDoctor) return;
//         try {
//             const res = await axios.delete(`/api/v1/doctor/${selectedDoctor.id}`);
//             if (res.EC === 0) {
//                 toast.success("Xóa thành công");
//                 fetchDoctors();
//                 setShowModal(false);
//             } else {
//                 toast.error(res.EM);
//             }
//         } catch (err) {
//             console.error(err);
//             toast.error("Lỗi xóa bác sĩ");
//         }
//     };

//     return (
//         <div className="container my-4">
//             <h3>Quản lý bác sĩ</h3>
//             <Button className="mb-3" onClick={() => history.push('/admin/doctor/new')}>
//                 Thêm bác sĩ
//             </Button>
//             <Table striped bordered hover>
//                 <thead>
//                     <tr>
//                         <th>Hình ảnh</th>
//                         <th>Tên bác sĩ</th>
//                         <th>Học vị</th>
//                         <th>Chức vụ</th>
//                         <th>Khoa phòng</th>
//                         <th>Trạng thái</th>
//                         <th>Hành động</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {doctors.map(doc => (
//                         <tr key={doc.id}>
//                             <td>
//                                 <Image
//                                     src={`${process.env.REACT_APP_BACKEND_URL}/${doc.image.replace(/^src[\\/]+public[\\/]+/, '').replace(/\\/g, '/')}`}
//                                     alt="doctor"
//                                     thumbnail
//                                     style={{ width: 80, height: 80, objectFit: 'cover' }}
//                                 />
//                             </td>
//                             <td>{doc.username}</td>
//                             <td>{doc.DoctorInfo?.Degree?.name || 'N/A'}</td>
//                             <td>{doc.DoctorInfo?.Position?.name || 'N/A'}</td>
//                             <td>{doc.DoctorInfo?.Specialty?.name || 'N/A'}</td>
//                             <td>{doc.DoctorInfo ? 'Đã đăng' : 'Chưa đăng'}</td>
//                             <td>
//                                 <Button
//                                     variant="warning"
//                                     size="sm"
//                                     className="me-2"
//                                     onClick={() => history.push(`/admin/doctor/edit/${doc.id}`)}
//                                 >
//                                     Sửa
//                                 </Button>
//                                 <Button
//                                     variant="danger"
//                                     size="sm"
//                                     onClick={() => {
//                                         setSelectedDoctor(doc);
//                                         setShowModal(true);
//                                     }}
//                                 >
//                                     Xóa
//                                 </Button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </Table>

//             {/* Modal xác nhận xóa */}
//             <Modal show={showModal} onHide={() => setShowModal(false)}>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Xác nhận xóa</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     Bạn có chắc muốn xóa bác sĩ <strong>{selectedDoctor?.username}</strong> không?
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={() => setShowModal(false)}>
//                         Hủy
//                     </Button>
//                     <Button variant="danger" onClick={handleDelete}>
//                         Xóa
//                     </Button>
//                 </Modal.Footer>
//             </Modal>
//         </div>
//     );
// };

// export default DoctorTable;


import React, { useEffect, useState } from 'react';
import { Table, Button, Image, Modal } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import axios from '../../../setup/axios';
import { toast } from 'react-toastify';

const DoctorTable = () => {
    const [doctors, setDoctors] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const history = useHistory();

    const buildImgSrc = (path) => {
        if (!path) return '/default-doctor.jpg';
        return `${process.env.REACT_APP_BACKEND_URL}${path.startsWith('/') ? '' : '/'}${path.replace(/^src[\\/]+public[\\/]+/, '').replace(/\\/g, '/')}`;
    };


    const fetchDoctors = async () => {
        try {
            const res = await axios.get('/api/v1/doctor/list');
            if (res.EC === 0) {
                setDoctors(res.DT);
            } else {
                toast.error(res.EM);
            }
        } catch (err) {
            console.error(err);
            toast.error("Lỗi tải danh sách bác sĩ");
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    const handleDelete = async () => {
        if (!selectedDoctor) return;
        try {
            const res = await axios.delete(`/api/v1/doctor/${selectedDoctor.id}`);
            if (res.EC === 0) {
                toast.success("Xóa thành công");
                fetchDoctors();
                setShowModal(false);
            } else {
                toast.error(res.EM);
            }
        } catch (err) {
            console.error(err);
            toast.error("Lỗi xóa bác sĩ");
        }
    };

    return (
        <div className="container my-4">
            <h3>Quản lý bác sĩ</h3>
            <Button className="mb-3" onClick={() => history.push('/admin/doctor/new')}>
                Thêm bác sĩ
            </Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Hình ảnh</th>
                        <th>Tên bác sĩ</th>
                        <th>Học vị</th>
                        <th>Chức vụ</th>
                        <th>Khoa phòng</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {doctors.map(doc => (
                        <tr key={doc.id}>
                            <td className="align-middle">
                                <Image
                                    src={buildImgSrc(doc.image)}
                                    alt="doctor"
                                    thumbnail
                                    style={{ width: 80, height: 80, objectFit: 'cover' }}
                                />
                            </td>
                            <td className="align-middle">{doc.username}</td>
                            <td className="align-middle">{doc.DoctorInfo?.Degree?.name || 'N/A'}</td>
                            <td className="align-middle">{doc.DoctorInfo?.Position?.name || 'N/A'}</td>
                            <td className="align-middle">{doc.DoctorInfo?.Specialty?.name || 'N/A'}</td>
                            <td className="align-middle">{doc.DoctorInfo ? 'Đã đăng' : 'Chưa đăng'}</td>
                            <td className="align-middle">
                                <Button
                                    variant="warning"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => history.push(`/admin/doctor/edit/${doc.id}`)}
                                // onClick={() => history.push(`/admin/doctor/edit/${doctor.id}`)}
                                >
                                    Sửa
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => {
                                        setSelectedDoctor(doc);
                                        setShowModal(true);
                                    }}
                                >
                                    Xóa
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>

            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Bạn có chắc muốn xóa bác sĩ <strong>{selectedDoctor?.username}</strong> không?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Hủy
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Xóa
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default DoctorTable;

