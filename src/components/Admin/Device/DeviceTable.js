import React, { useEffect, useState } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../../../setup/axios';
import '../../Admin/Doctor/Doctor.scss';
import ReactPaginate from 'react-paginate';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';

const DeviceTable = () => {
    const [devices, setDevices] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const history = useHistory();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [limit] = useState(5);

    const fetchData = async () => {
        try {
            const res = await axios.get(`/api/v1/device/paginate?page=${currentPage}&limit=${limit}`);
            if (res.EC === 0) {
                setDevices(res.DT.devices);
                setTotalPage(res.DT.totalPages);
            } else {
                toast.error(res.EM);
            }
        } catch (e) {
            toast.error("Lỗi khi tải dữ liệu");
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentPage]);

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

    const handlePageClick = (event) => {
        setCurrentPage(event.selected + 1);
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

            {totalPage > 1 && (
                <ReactPaginate
                    nextLabel="Next >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={3}
                    marginPagesDisplayed={2}
                    pageCount={totalPage}
                    previousLabel="< Prev"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    breakLabel="..."
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    containerClassName="pagination justify-content-center"
                    activeClassName="active"
                    forcePage={currentPage - 1}
                />
            )}
        </div>
    );
};

export default DeviceTable;
