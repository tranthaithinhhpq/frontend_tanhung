import React, { useEffect, useState, useCallback } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from '../../../setup/axios';
import Select from 'react-select';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import Scrollbars from 'react-custom-scrollbars';
import './Doctor.scss';

const DoctorDayOffTable = () => {
    const [dayOffList, setDayOffList] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [filterDoctor, setFilterDoctor] = useState(null);
    const [filterDate, setFilterDate] = useState(null);

    const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
    const [bulkDeleteDate, setBulkDeleteDate] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit] = useState(10);
    const [totalPage, setTotalPage] = useState(0);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [note, setNote] = useState('');
    const [slotOptions, setSlotOptions] = useState([]);
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [allDay, setAllDay] = useState(false);



    const fetchDoctors = async () => {
        try {
            const res = await axios.get('/api/v1/admin/doctor/read?page=1&limit=100');
            if (res.EC === 0) {
                const options = res.DT.doctors.map(d => ({ value: d.id, label: d.doctorName }));
                setDoctors(options);
            }
        } catch (err) {
            toast.error("Lỗi tải danh sách bác sĩ");
        }
    };

    const fetchDayOffPaginate = useCallback(async () => {
        try {
            let url = `/api/v1/admin/doctor-day-off/read?page=${currentPage}&limit=${currentLimit}`;
            if (filterDoctor?.value) url += `&doctorId=${filterDoctor.value}`;
            if (filterDate instanceof Date && !isNaN(filterDate.getTime())) {
                const dateStr = filterDate.getFullYear() + '-' +
                    String(filterDate.getMonth() + 1).padStart(2, '0') + '-' +
                    String(filterDate.getDate()).padStart(2, '0');
                url += `&date=${dateStr}`;
            }

            const res = await axios.get(url);
            if (res.EC === 0) {
                setDayOffList(res.DT.records || []);
                setTotalPage(res.DT.totalPages || 0);
            }
        } catch (err) {
            toast.error("Lỗi tải lịch nghỉ");
        }
    }, [currentPage, currentLimit, filterDoctor, filterDate]);

    useEffect(() => {
        fetchDoctors();
    }, []);

    useEffect(() => {
        fetchDayOffPaginate();
    }, [fetchDayOffPaginate]);

    useEffect(() => {
        if (selectedDoctor?.value && selectedDate instanceof Date && !isNaN(selectedDate.getTime())) {
            fetchSlots(selectedDoctor.value, selectedDate);
        }
    }, [selectedDoctor, selectedDate]);

    const fetchSlots = async (doctorId, date) => {
        try {
            const res = await axios.get('/api/v1/admin/doctor-day-off/create', {
                params: {
                    doctorId,
                    date: date.getFullYear() + '-' +
                        String(date.getMonth() + 1).padStart(2, '0') + '-' +
                        String(date.getDate()).padStart(2, '0')
                }
            });

            if (res.EC === 0) {
                const uniqueSlots = res.DT.reduce((acc, curr) => {
                    const exists = acc.find(s => s.id === curr.id);
                    if (!exists) acc.push(curr);
                    return acc;
                }, []);

                const formatted = uniqueSlots.map(slot => ({
                    value: slot.id,
                    label: `${slot.startTime} - ${slot.endTime}`
                }));

                setSlotOptions(formatted);
            }
        } catch (err) {
            toast.error("Lỗi tải khung giờ");
        }
    };

    // const handleSubmit = async () => {
    //     if (!selectedDoctor || !selectedDate) {
    //         toast.error("Vui lòng chọn bác sĩ và ngày nghỉ");
    //         return;
    //     }

    //     const date = selectedDate.getFullYear() + '-' +
    //         String(selectedDate.getMonth() + 1).padStart(2, '0') + '-' +
    //         String(selectedDate.getDate()).padStart(2, '0');

    //     const doctorId = selectedDoctor.value;
    //     const slotIds = allDay ? slotOptions.map(s => s.value) : selectedSlots.map(s => s.value);

    //     if (!allDay && slotIds.length === 0) {
    //         toast.error("Vui lòng chọn khung giờ nghỉ");
    //         return;
    //     }

    //     try {
    //         await axios.post('/api/v1/admin/doctor-day-off/create', {
    //             doctorId,
    //             date,
    //             slotId: slotIds,
    //             isActive: false,
    //             note
    //         });

    //         toast.success("Thêm mới thành công");
    //         setShowModal(false);
    //         fetchDayOffPaginate();
    //     } catch (err) {
    //         toast.error("Lỗi khi thêm lịch nghỉ");
    //     }
    // };



    const handleSubmit = async () => {
        if (!selectedDoctor || !selectedDate) {
            toast.error("Vui lòng chọn bác sĩ và ngày nghỉ");
            return;
        }

        const date = selectedDate.getFullYear() + '-' +
            String(selectedDate.getMonth() + 1).padStart(2, '0') + '-' +
            String(selectedDate.getDate()).padStart(2, '0');

        if (selectedDoctor.value === 'all') {
            try {
                await axios.post('/api/v1/admin/doctor-day-off/day-off-all', { date });
                toast.success("Đã đặt nghỉ toàn bộ bác sĩ trong ngày " + date);
                setShowModal(false);
                fetchDayOffPaginate();
            } catch (err) {
                toast.error("Lỗi khi thêm lịch nghỉ toàn bộ bác sĩ");
            }
            return;
        }

        // 🟢 case bác sĩ cụ thể
        const doctorId = selectedDoctor.value;
        const slotIds = allDay ? slotOptions.map(s => s.value) : selectedSlots.map(s => s.value);

        if (!allDay && slotIds.length === 0) {
            toast.error("Vui lòng chọn khung giờ nghỉ");
            return;
        }

        try {
            await axios.post('/api/v1/admin/doctor-day-off/create', {
                doctorId,
                date,
                slotId: slotIds,
                isActive: false,
                note
            });

            toast.success("Thêm mới thành công");
            setShowModal(false);
            fetchDayOffPaginate();
        } catch (err) {
            toast.error("Lỗi khi thêm lịch nghỉ");
        }
    };






    const handleDelete = (id) => {
        setDeleteId(id);
        setShowConfirmModal(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`/api/v1/admin/doctor-day-off/delete/${deleteId}`);
            toast.success("Xóa thành công");
            fetchDayOffPaginate();
        } catch (err) {
            toast.error("Lỗi khi xóa");
        } finally {
            setShowConfirmModal(false);
        }
    };

    const handlePageClick = (event) => {
        setCurrentPage(+event.selected + 1);
    };

    return (
        <div className="container py-4">
            <h4>Quản lý lịch nghỉ bác sĩ</h4>

            <div className="row mb-3">
                <div className="col-md-4 mb-2">
                    <Select
                        placeholder="Chọn bác sĩ"
                        options={doctors}
                        value={filterDoctor}
                        onChange={setFilterDoctor}
                        isClearable
                    />
                </div>
                <div className="col-md-4 mb-2">
                    <DatePicker
                        className="form-control"
                        selected={filterDate}
                        onChange={setFilterDate}
                        placeholderText="Chọn ngày"
                        dateFormat="yyyy-MM-dd"
                        isClearable
                    />
                </div>
                <div className="col-md-4 text-end">
                    <Button
                        className="me-2"
                        variant="danger"
                        onClick={() => {
                            setBulkDeleteDate(null);
                            setShowBulkDeleteModal(true);
                        }}
                    >
                        Xóa hàng loạt
                    </Button>
                    <Button onClick={() => {
                        setShowModal(true);
                        setSelectedDoctor(null);
                        setSelectedDate(null);
                        setSlotOptions([]);
                        setSelectedSlots([]);
                        setAllDay(false);
                        setNote('');
                    }}>+ Thêm lịch nghỉ</Button>
                </div>
            </div>

            <Scrollbars autoHeight autoHeightMax={400} autoHide>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Bác sĩ</th>
                            <th>Ngày nghỉ</th>
                            <th>Bắt đầu</th>
                            <th>Kết thúc</th>
                            <th>Ghi chú</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(dayOffList) && dayOffList.length > 0 ? dayOffList.map(item => (
                            <tr key={item.id}>
                                <td>{item.DoctorInfo?.doctorName || item.doctorId}</td>
                                <td>{item.date}</td>
                                <td>{item.WorkingSlotTemplate?.startTime || '-'}</td>
                                <td>{item.WorkingSlotTemplate?.endTime || '-'}</td>
                                <td>{item.note || ''}</td>
                                <td>
                                    <i className="fa fa-trash-o delete" onClick={() => handleDelete(item.id)}></i>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="6" className="text-center">Không có dữ liệu</td></tr>
                        )}
                    </tbody>
                </Table>
            </Scrollbars>

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

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm lịch nghỉ</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Bác sĩ</Form.Label>
                        <Select options={doctors} value={selectedDoctor} onChange={setSelectedDoctor} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Ngày nghỉ</Form.Label>
                        <DatePicker
                            selected={selectedDate}
                            onChange={setSelectedDate}
                            dateFormat="yyyy-MM-dd"
                            className="form-control"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Check
                            type="checkbox"
                            label="Nghỉ cả ngày"
                            checked={allDay}
                            onChange={(e) => {
                                const checked = e.target.checked;
                                setAllDay(checked);
                                setSelectedSlots(checked ? slotOptions : []);
                            }}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Chọn khung giờ nghỉ</Form.Label>
                        <Select
                            isMulti
                            options={slotOptions}
                            value={selectedSlots}
                            onChange={setSelectedSlots}
                            isDisabled={allDay || selectedDoctor?.value === 'all'} // disable luôn nếu chọn tất cả bác sĩ
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Ghi chú</Form.Label>
                        <Form.Control as="textarea" value={note} onChange={(e) => setNote(e.target.value)} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
                    <Button variant="primary" onClick={handleSubmit}>Thêm mới</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
                <Modal.Header closeButton><Modal.Title>Xác nhận xóa</Modal.Title></Modal.Header>
                <Modal.Body>Bạn chắc chắn muốn xóa lịch nghỉ này?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>Hủy</Button>
                    <Button variant="danger" onClick={confirmDelete}>Xóa</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showBulkDeleteModal} onHide={() => setShowBulkDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Xóa lịch nghỉ hàng loạt</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Chọn ngày giới hạn</Form.Label>
                        <DatePicker
                            selected={bulkDeleteDate}
                            onChange={setBulkDeleteDate}
                            dateFormat="yyyy-MM-dd"
                            className="form-control"
                            placeholderText="Chọn ngày"
                        />
                    </Form.Group>
                    <small className="text-muted">
                        Tất cả lịch nghỉ của bác sĩ **trước ngày này** sẽ bị xóa.
                    </small>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowBulkDeleteModal(false)}>Hủy</Button>
                    <Button variant="danger" onClick={async () => {
                        if (!bulkDeleteDate) {
                            toast.error("Vui lòng chọn ngày giới hạn");
                            return;
                        }

                        const dateStr = bulkDeleteDate.getFullYear() + '-' +
                            String(bulkDeleteDate.getMonth() + 1).padStart(2, '0') + '-' +
                            String(bulkDeleteDate.getDate()).padStart(2, '0');

                        try {
                            await axios.delete('/api/v1/admin/doctor-day-off/bulk-delete', {
                                data: { date: dateStr }   // ⬅️ gửi ngày về server
                            });
                            toast.success("Đã xóa lịch nghỉ trước ngày " + dateStr);
                            setShowBulkDeleteModal(false);
                            fetchDayOffPaginate();
                        } catch (err) {
                            toast.error("Lỗi khi xóa hàng loạt");
                        }
                    }}>
                        Xóa
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default DoctorDayOffTable;
