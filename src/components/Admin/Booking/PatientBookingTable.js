import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from '../../../setup/axios';
import Select from 'react-select';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import '../../Admin/Doctor/Doctor.scss';
import { useHistory } from 'react-router-dom';
import Scrollbars from 'react-custom-scrollbars';


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
    const history = useHistory();

    const scrollbarRef = useRef();
    const [scrollHeight, setScrollHeight] = useState(window.innerHeight);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const [specialties, setSpecialties] = useState([]);
    const [filterSpecialty, setFilterSpecialty] = useState(null);
    const [filterStatus, setFilterStatus] = useState(null);

    const [filterStartDate, setFilterStartDate] = useState(null);
    const [filterEndDate, setFilterEndDate] = useState(null);
    const [dateMode, setDateMode] = useState('single'); // 'single' | 'range'

    const statusOptions = [
        { value: 'pending', label: 'Chờ xác nhận' },
        { value: 'confirmed', label: 'Đã xác nhận' },
        { value: 'done', label: 'Đã khám' },
        { value: 'cancelled', label: 'Đã hủy' }
    ];

    const fetchSpecialties = async () => {
        const res = await axios.get('/api/v1/specialty/read'); // hoặc endpoint phù hợp
        if (res.EC === 0) {
            const options = res.DT.map(s => ({ value: s.id, label: s.name }));
            setSpecialties(options);
        }
    };


    const fetchDoctors = async () => {
        const res = await axios.get('/api/v1/doctor/list?page=1&limit=100');
        if (res.EC === 0) {
            const options = res.DT.doctors.map(d => ({ value: d.id, label: d.doctorName }));
            setDoctors(options);
        }
    };

    const fetchBookings = async () => {
        let url = `/api/v1/booking?page=${currentPage}&limit=${limit}`;
        if (filterSpecialty?.value) url += `&specialtyId=${filterSpecialty.value}`;
        if (filterStatus?.value) url += `&status=${filterStatus.value}`;
        if (filterDoctor?.value) url += `&doctorId=${filterDoctor.value}`;
        if (filterDate instanceof Date && !isNaN(filterDate.getTime())) {
            // const dateStr = filterDate.toISOString().split('T')[0];
            const dateStr = filterDate.toLocaleDateString('en-CA'); // yyyy-MM-dd theo local
            url += `&date=${dateStr}`;
        }
        if (filterStartDate instanceof Date && !isNaN(filterStartDate)) {
            const fromDate = filterStartDate.toLocaleDateString('en-CA');
            url += `&startDate=${fromDate}`;
        }
        if (filterEndDate instanceof Date && !isNaN(filterEndDate)) {
            const toDate = filterEndDate.toLocaleDateString('en-CA');
            url += `&endDate=${toDate}`;
        }

        const res = await axios.get(url);
        if (res.EC === 0) {
            setBookings(res.DT.records);
            setTotalPage(res.DT.totalPages);
        }
    };



    useEffect(() => {
        fetchDoctors();
        fetchSpecialties();
    }, []);

    useEffect(() => {
        const updateHeight = () => {
            setScrollHeight(window.innerHeight);
        };
        updateHeight();

        window.addEventListener("resize", updateHeight);
        return () => window.removeEventListener("resize", updateHeight);
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [
        currentPage,
        filterDoctor,
        filterDate,
        filterStatus,
        filterSpecialty,
        filterStartDate,
        filterEndDate
    ]);


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

    const confirmDelete = (id) => {
        setDeleteId(id);
        setShowConfirmModal(true);
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







    const handleDelete = async () => {
        try {
            await axios.delete(`/api/v1/booking/${deleteId}`);
            toast.success("Xóa thành công");
            fetchBookings();
        } catch (err) {
            console.error(err);
            toast.error("Lỗi khi xóa lịch");
        } finally {
            setShowConfirmModal(false);
            setDeleteId(null);
        }
    };

    return (

        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <h4 className="mb-0">📋 Quản lý lịch khám bệnh nhân</h4>
                <div className="d-flex gap-2">
                    <Button variant="success" onClick={() => toast.info("Chức năng đang phát triển")}>
                        <i className="fa fa-file-excel-o me-1" /> Xuất Excel
                    </Button>
                    <Button variant="primary" onClick={() => history.push('/admin/booking/new')}>
                        <i className="fa fa-plus-circle me-1" /> Đặt lịch khám
                    </Button>
                </div>
            </div>

            <div className="row g-3 mb-3">
                <div className="col-md-3">
                    <Select placeholder="Chọn bác sĩ" options={doctors} value={filterDoctor} onChange={setFilterDoctor} isClearable />
                </div>
                <div className="col-md-3">
                    <Select placeholder="Chọn chuyên khoa" options={specialties} value={filterSpecialty} onChange={setFilterSpecialty} isClearable />
                </div>
                <div className="col-md-3">
                    <Select placeholder="Chọn trạng thái" options={statusOptions} value={filterStatus} onChange={setFilterStatus} isClearable />
                </div>
                <div className="col-md-3">
                    <Form.Select value={dateMode} onChange={(e) => {
                        setDateMode(e.target.value);
                        setFilterDate(null);
                        setFilterStartDate(null);
                        setFilterEndDate(null);
                    }}>
                        <option value="single">Lọc theo ngày</option>
                        <option value="range">Lọc theo khoảng thời gian</option>
                    </Form.Select>
                </div>
            </div>

            <div className="row g-3 mb-4">
                {dateMode === 'single' && (
                    <div className="col-md-3">
                        <DatePicker className="form-control" selected={filterDate} onChange={setFilterDate}
                            placeholderText="Chọn ngày khám" dateFormat="yyyy-MM-dd" isClearable />
                    </div>
                )}
                {dateMode === 'range' && (
                    <>
                        <div className="col-md-3">
                            <DatePicker className="form-control" selected={filterStartDate} onChange={setFilterStartDate}
                                placeholderText="Từ ngày" dateFormat="yyyy-MM-dd" isClearable />
                        </div>
                        <div className="col-md-3">
                            <DatePicker className="form-control" selected={filterEndDate} onChange={setFilterEndDate}
                                placeholderText="Đến ngày" dateFormat="yyyy-MM-dd" isClearable />
                        </div>
                    </>
                )}
            </div>


            <div className="table-responsive-custom" style={{ minWidth: '900px' }}>

                <Table striped bordered hover className="booking-table">
                    <thead>
                        <tr>
                            <th>Bệnh nhân</th>
                            <th>Ngày sinh</th>
                            <th>Điện thoại</th>
                            <th>Bác sĩ</th>
                            <th>Chuyên khoa</th>
                            <th>Ngày khám</th>
                            <th>Khung giờ</th>
                            <th>Dịch vụ</th>
                            <th>Lý do khám</th>
                            <th>Giá tiền</th>
                            <th>Trạng thái</th>
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
                                <td>{item.DoctorInfo?.Specialty?.name || ''}</td>
                                <td>{item.scheduleTime?.split('T')[0]}</td>
                                <td>{item.WorkingSlotTemplate?.startTime} - {item.WorkingSlotTemplate?.endTime}</td>
                                <td>{item.ServicePrice?.name}</td>
                                <td>{item.reason}</td>
                                <td>{item.ServicePrice?.price?.toLocaleString('vi-VN')}đ</td>
                                <td>{item.status}</td>
                                <td>


                                    <i
                                        className="fa fa-pencil edit"
                                        onClick={() => history.push(`/admin/booking/${item.id}`)}
                                    ></i>

                                    <i className="fa fa-trash-o delete" onClick={() => confirmDelete(item.id)}></i>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="7" className="text-center">Không có lịch khám</td></tr>
                        )}
                    </tbody>
                </Table>
            </div>


        </div>

    );
};

export default PatientBookingTable;
