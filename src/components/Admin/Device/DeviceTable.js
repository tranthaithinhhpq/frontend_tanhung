import React, { useEffect, useState } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../../../setup/axios';
import '../../Admin/Doctor/Doctor.scss';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';

const DeviceTable = () => {
    const [devices, setDevices] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const history = useHistory();

    const fetchData = async () => {
        const res = await axios.get('/api/v1/device/read');
        if (res.EC === 0) setDevices(res.DT);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openDeleteModal = (device) => {
        setSelectedDevice(device);
        setShowModal(true);
    };

    const closeDeleteModal = () => {
        setSelectedDevice(null);
        setShowModal(false);
    };

    const confirmDelete = async () => {
        if (!selectedDevice) return;

        const res = await axios.delete(`/api/v1/device/${selectedDevice.id}`);
        if (res.EC === 0) {
            toast.success('Xóa thành công');
            fetchData();
        } else {
            toast.error('Xóa thất bại');
        }
        closeDeleteModal();
    };

    return (
        <div className="container mt-4">
            <h3>Danh sách thiết bị</h3>
            <Button className="mb-3" onClick={() => history.push('/admin/device/new')}>
                <i className="fa fa-plus-circle"></i> Thêm mới
            </Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Tên</th>
                        <th>Mã</th>
                        <th>Loại</th>
                        <th>Ảnh</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {devices.map((item, idx) => (
                        <tr key={item.id}>
                            <td>{idx + 1}</td>
                            <td>{item.name}</td>
                            <td>{item.code}</td>
                            <td>{item.category}</td>
                            <td>
                                <img src={`${BACKEND_URL}${item.image}`} alt="device" style={{ width: 60, height: 40, objectFit: 'cover' }} />
                            </td>
                            <td>


                                <i variant="warning" className="fa fa-pencil edit" onClick={() => history.push(`/admin/device/edit/${item.id}`)}></i>
                                <i variant="danger" className="fa fa-trash-o delete" onClick={() => openDeleteModal(item)}></i>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal xác nhận xóa */}
            <Modal show={showModal} onHide={closeDeleteModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Bạn có chắc muốn xóa thiết bị <strong>{selectedDevice?.name}</strong> không?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeDeleteModal}>Hủy</Button>
                    <Button variant="danger" onClick={confirmDelete}>Xóa</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default DeviceTable;
