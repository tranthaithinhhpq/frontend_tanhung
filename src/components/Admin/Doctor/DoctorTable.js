import React, { useEffect, useState, useCallback } from 'react';
import { Table, Image, Modal, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import axios from '../../../setup/axios';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';

import './Doctor.scss';

const DoctorTable = () => {
    const [doctors, setDoctors] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit] = useState(5);
    const [totalPage, setTotalPage] = useState(0);
    const history = useHistory();

    const buildImgSrc = (path) => {
        if (!path) return '/default-doctor.jpg';
        return `${process.env.REACT_APP_BACKEND_URL}${path.startsWith('/') ? '' : '/'}${path.replace(/^src[\\/]+public[\\/]+/, '').replace(/\\/g, '/')}`;
    };

    const fetchDoctors = useCallback(async () => {
        try {
            const res = await axios.get(`/api/v1/doctor/read?page=${currentPage}&limit=${currentLimit}`);
            if (res.EC === 0) {
                setDoctors(res.DT.doctors || []);
                setTotalPage(res.DT.totalPages || 0);
            } else {
                toast.error(res.EM);
            }
        } catch (err) {
            console.error(err);
            toast.error("Lỗi tải danh sách bác sĩ");
        }
    }, [currentPage, currentLimit]);

    useEffect(() => {
        fetchDoctors();
    }, [fetchDoctors]);

    const handleDelete = async () => {
        if (!selectedDoctor) return;
        try {
            const res = await axios.delete(`/api/v1/doctor/${selectedDoctor.id}`);
            if (res.EC === 0) {
                toast.success(res.EM || "Xóa thành công");
                const nextPage = (doctors.length === 1 && currentPage > 1) ? currentPage - 1 : currentPage;
                setCurrentPage(nextPage);
                fetchDoctors();
                setShowModal(false);
            } else {
                toast.error(res.EM || "Lỗi xóa");
            }
        } catch (err) {
            console.error("❌ handleDelete error:", err);
            toast.error("Lỗi xóa bác sĩ");
        }
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected + 1);
    };

    return (
        <div className="container my-4">
            <h3>Quản lý bác sĩ</h3>
            <Button className="mb-3" onClick={() => history.push('/admin/doctor/new')}>
                <i className="fa fa-plus-circle"></i> Thêm bác sĩ
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
                    {doctors.length > 0 ? (
                        doctors.map((doc) => (
                            <tr key={doc.id}>
                                <td className="align-middle">
                                    <Image
                                        src={buildImgSrc(doc.image)}
                                        alt="doctor"
                                        thumbnail
                                        className="doctor-table-image"
                                    />
                                </td>
                                <td className="align-middle">{doc.doctorName}</td>
                                <td className="align-middle">{doc.Degree?.name || 'N/A'}</td>
                                <td className="align-middle">{doc.Position?.name || 'N/A'}</td>
                                <td className="align-middle">{doc.Specialty?.name || 'N/A'}</td>
                                <td className="align-middle">Đã đăng</td>
                                <td className="align-middle">
                                    <i
                                        className="fa fa-pencil edit"
                                        onClick={() => history.push(`/admin/doctor/edit/${doc.id}`)}
                                    ></i>
                                    <i
                                        className="fa fa-trash-o delete"
                                        onClick={() => {
                                            setSelectedDoctor(doc);
                                            setShowModal(true);
                                        }}
                                    ></i>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center">Không có bác sĩ</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {totalPage > 1 && (
                <ReactPaginate
                    nextLabel="next >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={3}
                    marginPagesDisplayed={2}
                    pageCount={totalPage}
                    previousLabel="< previous"
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


