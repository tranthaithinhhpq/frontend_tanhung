import React, { useEffect, useState, useCallback } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from '../../../setup/axios';
import Select from 'react-select';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import '../../Admin/Doctor/Doctor.scss';


const PatientBookingTable = () => {
    const [bookings, setBookings] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [filterDoctor, setFilterDoctor] = useState(null);
    const [filterDate, setFilterDate] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const [totalPage, setTotalPage] = useState(0);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState(null);




    const fetchDoctors = async () => {
        const res = await axios.get('/api/v1/doctor/list?page=1&limit=100');
        if (res.EC === 0) {
            const options = res.DT.doctors.map(d => ({ value: d.id, label: d.doctorName }));
            setDoctors(options);
        }
    };

    const fetchBookings = useCallback(async () => {
        let url = `/api/v1/booking?page=${currentPage}&limit=${limit}`;
        if (filterDoctor?.value) url += `&doctorId=${filterDoctor.value}`;
        if (filterDate instanceof Date && !isNaN(filterDate.getTime())) {
            const year = filterDate.getFullYear();
            const month = (filterDate.getMonth() + 1).toString().padStart(2, '0');
            const day = filterDate.getDate().toString().padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`; // local date string
            url += `&date=${dateStr}`;
        }

        const res = await axios.get(url);
        if (res.EC === 0) {
            setBookings(res.DT.records);
            setTotalPage(res.DT.totalPages);
        }
    }, [currentPage, limit, filterDoctor, filterDate]);


    useEffect(() => {
        fetchDoctors();
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const handlePageClick = (event) => {
        setCurrentPage(+event.selected + 1);
    };
    const isValidDate = (value) => {
        const date = new Date(value);
        return value && !isNaN(date.getTime());
    };
    const handleEdit = (booking) => {
        setEditData({
            ...booking,
            dob: isValidDate(booking.dob) ? new Date(booking.dob) : null,
            scheduleTime: isValidDate(booking.scheduleTime) ? new Date(booking.scheduleTime) : null,
        });
        setShowEditModal(true);
    };

    const handleSaveEdit = async () => {
        try {
            const payload = {
                ...editData,
                dob: editData.dob ? editData.dob.toLocaleDateString('en-CA') : null, // yyyy-mm-dd
                scheduleTime: editData.scheduleTime?.toISOString() || null,
            };

            await axios.put(`/api/v1/booking/${editData.id}`, payload);
            toast.success("Cập nhật thành công");
            setShowEditModal(false);
            fetchBookings(); // refresh lại bảng
        } catch (err) {
            console.error(err);
            toast.error("Lỗi khi cập nhật");
        }
    };







    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa lịch khám này?")) return;
        try {
            await axios.delete(`/api/v1/booking/${id}`);
            toast.success("Xóa thành công");
            fetchBookings(); // refresh lại danh sách
        } catch (err) {
            console.error(err);
            toast.error("Lỗi khi xóa lịch");
        }
    };

    return (
        <div className="container py-4">
            <h4>Quản lý lịch khám bệnh nhân</h4>
            <div className="text-end mb-3">

            </div>
            <div className="row mb-3">
                <div className="col-md-4">
                    <Select
                        placeholder="Chọn bác sĩ"
                        options={doctors}
                        value={filterDoctor}
                        onChange={setFilterDoctor}
                        isClearable
                    />
                </div>
                <div className="col-md-4">
                    <DatePicker
                        className="form-control"
                        selected={filterDate}
                        onChange={setFilterDate}
                        placeholderText="Chọn ngày khám"
                        dateFormat="yyyy-MM-dd"
                        isClearable
                    />
                </div>
            </div>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Bệnh nhân</th>
                        <th>Ngày sinh</th>
                        <th>Điện thoại</th>
                        <th>Bác sĩ</th>
                        <th>Ngày khám</th>
                        <th>Khung giờ</th>
                        <th>Dịch vụ</th>
                        <th>Lý do khám</th>
                        <th>Giá tiền</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.length > 0 ? bookings.map((item) => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.dob}</td>
                            <td>{item.phone}</td>
                            <td>{item.DoctorInfo?.doctorName || item.doctorId}</td>
                            <td>{item.scheduleTime?.split('T')[0]}</td>
                            <td>{item.WorkingSlotTemplate?.startTime} - {item.WorkingSlotTemplate?.endTime}</td>
                            <td>{item.ServicePrice?.name}</td>
                            <td>{item.reason}</td>
                            <td>{item.ServicePrice?.price?.toLocaleString('vi-VN')}đ</td>
                            <td>
                                <i className="fa fa-pencil edit me-2" onClick={() => handleEdit(item)}></i>
                                <i className="fa fa-trash-o delete" onClick={() => handleDelete(item.id)}></i>
                            </td>
                        </tr>
                    )) : (
                        <tr><td colSpan="7" className="text-center">Không có lịch khám</td></tr>
                    )}
                </tbody>
            </Table>

            {totalPage > 0 && (
                <ReactPaginate
                    nextLabel=">"
                    onPageChange={handlePageClick}
                    pageCount={totalPage}
                    forcePage={currentPage - 1}
                    previousLabel="<"
                    containerClassName="pagination justify-content-center mt-3"
                    activeClassName="active"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                />
            )}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Sửa lịch khám</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {editData && (
                        <>
                            <Form.Group className="mb-3">
                                <Form.Label>Họ tên</Form.Label>
                                <Form.Control
                                    value={editData.name}
                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Ngày sinh</Form.Label>
                                <DatePicker
                                    className="form-control"
                                    selected={isValidDate(editData.dob) ? new Date(editData.dob) : null}
                                    onChange={(date) => setEditData({ ...editData, dob: date })}
                                    dateFormat="yyyy-MM-dd"
                                    placeholderText="Chọn ngày sinh"
                                    isClearable
                                />

                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Điện thoại</Form.Label>
                                <Form.Control
                                    value={editData.phone}
                                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Ngày khám</Form.Label>
                                <DatePicker
                                    className="form-control"
                                    selected={editData.scheduleTime}
                                    onChange={(date) => setEditData({ ...editData, scheduleTime: date })}
                                    dateFormat="yyyy-MM-dd"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Lý do khám</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    value={editData.reason}
                                    onChange={(e) => setEditData({ ...editData, reason: e.target.value })}
                                />
                            </Form.Group>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>Hủy</Button>
                    <Button variant="primary" onClick={handleSaveEdit}>Lưu thay đổi</Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default PatientBookingTable;
