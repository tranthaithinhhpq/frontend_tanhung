import React, { useEffect, useState } from 'react';
import axios from '../../../setup/axios';
import { Table, Modal, Button, Form } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import Select from 'react-select';

const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

const WorkingSlotTemplateManagement = () => {
    const [slots, setSlots] = useState([]);
    const [form, setForm] = useState({ doctorId: '', dayOfWeek: 1, startTime: '', endTime: '', isActive: true });
    const [doctors, setDoctors] = useState([]);
    const [doctorFilter, setDoctorFilter] = useState('');
    const [pagination, setPagination] = useState({ totalPages: 0, currentPage: 1 });
    const [editId, setEditId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const doctorOptions = doctors.map(doc => ({
        value: doc.id,
        label: doc.doctorName
    }));

    useEffect(() => {
        fetchDoctors();
        fetchData();
    }, []);

    const fetchDoctors = async () => {
        try {
            const res = await axios.get('/api/v1/doctor-schedule');
            if (res.EC === 0) {
                setDoctors(res.DT); // giữ nguyên dạng [{ id, doctorName }]
            }
        } catch (err) {
            toast.error("Lỗi tải danh sách bác sĩ");
        }
    };

    const fetchData = async (page = 1, doctorName = '') => {
        const res = await axios.get(`/api/v1/admin/working-slot-template/read?page=${page}&limit=5&doctorName=${doctorName}`);
        if (res.EC === 0) {
            setSlots(res.DT.rows);
            setPagination({ totalPages: res.DT.totalPages, currentPage: res.DT.currentPage });
        }
    };

    const handlePageClick = (e) => fetchData(e.selected + 1, doctorFilter);

    const handleSearch = () => fetchData(1, doctorFilter);

    const handleSave = async () => {
        const { doctorId, dayOfWeek, startTime, endTime } = form;
        if (!doctorId || !startTime || !endTime) return toast.error('Vui lòng nhập đầy đủ');

        const res = editId
            ? await axios.put(`/api/v1/admin/working-slot-template/update/${editId}`, form)
            : await axios.post(`/api/v1/admin/working-slot-template/create`, form);

        if (res.EC === 0) toast.success(editId ? 'Cập nhật thành công' : 'Tạo mới thành công');
        else toast.error(res.EM);

        setShowModal(false);
        setForm({ doctorId: '', dayOfWeek: 1, startTime: '', endTime: '', isActive: true });
        setEditId(null);
        fetchData(pagination.currentPage, doctorFilter);
    };

    const handleDelete = async () => {
        const res = await axios.post(`/api/v1/admin/working-slot-template/delete`, { id: deleteId });
        if (res.EC === 0) toast.success('Xóa thành công');
        else toast.error(res.EM);
        setShowConfirm(false);
        fetchData(pagination.currentPage, doctorFilter);
    };

    return (
        <div className="container mt-4">
            <h3>Quản lý khung giờ làm việc bác sĩ</h3>

            <div className="d-flex gap-2 align-items-center my-2">
                <Select
                    options={doctorOptions}
                    value={doctorOptions.find(opt => opt.label === doctorFilter) || null}
                    onChange={(selected) => setDoctorFilter(selected ? selected.label : '')}
                    placeholder="Chọn bác sĩ cần lọc"
                    isClearable
                    className="flex-grow-1"
                    styles={{ container: base => ({ ...base, maxWidth: '300px' }) }}
                />
                <Button variant="secondary" onClick={handleSearch}>Lọc</Button>
                <Button onClick={() => { setEditId(null); setForm({ doctorId: '', dayOfWeek: 1, startTime: '', endTime: '', isActive: true }); setShowModal(true); }}>
                    Thêm mới
                </Button>
            </div>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Bác sĩ</th>
                        <th>Thứ</th>
                        <th>Bắt đầu</th>
                        <th>Kết thúc</th>
                        <th>Hoạt động</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {slots.map((item, idx) => (
                        <tr key={item.id}>
                            <td>{(pagination.currentPage - 1) * 5 + idx + 1}</td>
                            <td>{item.doctor?.doctorName || '---'}</td>
                            <td>{days[item.dayOfWeek]}</td>
                            <td>{item.startTime}</td>
                            <td>{item.endTime}</td>
                            <td>{item.isActive ? '✅' : '❌'}</td>
                            <td>
                                <Button
                                    size="sm"
                                    variant="warning"
                                    onClick={() => {
                                        setEditId(item.id);
                                        setForm({
                                            doctorId: item.doctorId,
                                            dayOfWeek: item.dayOfWeek,
                                            startTime: item.startTime,
                                            endTime: item.endTime,
                                            isActive: item.isActive
                                        });
                                        setShowModal(true);
                                    }}
                                >
                                    Sửa
                                </Button>{' '}
                                <Button
                                    size="sm"
                                    variant="danger"
                                    onClick={() => {
                                        setDeleteId(item.id);
                                        setShowConfirm(true);
                                    }}
                                >
                                    Xóa
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <ReactPaginate
                breakLabel="..."
                nextLabel=">"
                onPageChange={handlePageClick}
                pageRangeDisplayed={2}
                marginPagesDisplayed={1}
                pageCount={pagination.totalPages}
                previousLabel="<"
                containerClassName="pagination justify-content-center mt-3"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                breakClassName="page-item"
                breakLinkClassName="page-link"
                activeClassName="active"
            />

            {/* Modal thêm/sửa */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editId ? 'Cập nhật' : 'Thêm mới'} khung giờ</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {console.log("form.doctorId =", form.doctorId)}
                    {console.log("doctors =", doctors)}
                    <Form.Group className="mb-2">
                        <Form.Label>Bác sĩ</Form.Label>
                        <Form.Control
                            plaintext
                            readOnly
                            value={doctors.find(d => String(d.id) === String(form.doctorId))?.doctorName || 'Không xác định'}


                        />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Thứ</Form.Label>
                        <Form.Select value={form.dayOfWeek} onChange={(e) => setForm({ ...form, dayOfWeek: +e.target.value })}>
                            {days.map((day, idx) => (
                                <option key={idx} value={idx}>{day}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Giờ bắt đầu</Form.Label>
                        <Form.Control type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Giờ kết thúc</Form.Label>
                        <Form.Control type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
                    </Form.Group>
                    <Form.Check
                        type="checkbox"
                        label="Hoạt động"
                        checked={form.isActive}
                        onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
                    <Button variant="primary" onClick={handleSave}>Lưu</Button>
                </Modal.Footer>
            </Modal>

            {/* Modal xác nhận xóa */}
            <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn có chắc muốn xóa khung giờ này?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>Hủy</Button>
                    <Button variant="danger" onClick={handleDelete}>Xóa</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default WorkingSlotTemplateManagement;
