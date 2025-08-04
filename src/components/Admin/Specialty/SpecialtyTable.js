import React, { useEffect, useState } from 'react';
import { Table, Image, Modal, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import axios from '../../../setup/axios';
import { toast } from 'react-toastify';
import '../../Admin/Doctor/Doctor.scss';

const SpecialtyTable = () => {
    const [specialties, setSpecialties] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedSpecialty, setSelectedSpecialty] = useState(null);
    const history = useHistory();

    const buildImgSrc = (path) => {
        if (!path) return '/default-image.png';
        return `${process.env.REACT_APP_BACKEND_URL}${path.startsWith('/') ? '' : '/'}${path.replace(/^src[\\/]+public[\\/]+/, '').replace(/\\/g, '/')}`;
    };

    const fetchSpecialties = async () => {
        try {
            const res = await axios.get('/api/v1/admin/specialty/read');
            if (res.EC === 0) {
                setSpecialties(res.DT);
            } else {
                toast.error(res.EM || 'Không lấy được danh sách chuyên khoa');
            }
        } catch (err) {
            console.error(err);
            toast.error('Lỗi tải danh sách chuyên khoa');
        }
    };

    useEffect(() => {
        fetchSpecialties();
    }, []);

    const handleDelete = async () => {
        if (!selectedSpecialty) return;
        try {
            const res = await axios.delete(`/api/v1/admin/specialty/delete/${selectedSpecialty.id}`);
            if (res.EC === 0) {
                toast.success('Xóa thành công');
                fetchSpecialties();
                setShowModal(false);
            } else {
                toast.error(res.EM || 'Xóa thất bại');
            }
        } catch (err) {
            console.error(err);
            toast.error('Lỗi xóa chuyên khoa');
        }
    };

    return (
        <div className="container my-4">
            <h3>Quản lý chuyên khoa</h3>
            <Button className="mb-3" onClick={() => history.push('/admin/specialty/create')}>
                <i className="fa fa-plus-circle"></i> Thêm mới
            </Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Ảnh (4x3)</th>
                        <th>Tên chuyên khoa</th>
                        <th>Mô tả</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {specialties.length > 0 ? (
                        specialties.map((sp) => (
                            <tr key={sp.id}>
                                <td className="align-middle">
                                    <Image
                                        src={buildImgSrc(sp.image)}
                                        alt="specialty"
                                        thumbnail
                                        className="doctor-table-image"
                                    />
                                </td>
                                <td className="align-middle">{sp.name}</td>
                                <td className="align-middle">{sp.description}</td>
                                <td className="align-middle">
                                    <i
                                        className="fa fa-pencil edit"
                                        onClick={() => history.push(`/admin/specialty/edit/${sp.id}`)}
                                    ></i>
                                    <i
                                        className="fa fa-trash-o delete"
                                        onClick={() => {
                                            setSelectedSpecialty(sp);
                                            setShowModal(true);
                                        }}
                                    ></i>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center">Không có chuyên khoa</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Bạn có chắc muốn xóa chuyên khoa <strong>{selectedSpecialty?.name}</strong> không?
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

export default SpecialtyTable;
