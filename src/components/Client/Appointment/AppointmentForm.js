import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import axios from '../../../setup/axios';
import { toast } from 'react-toastify';

const AppointmentForm = () => {
    const [form, setForm] = useState({
        name: '',
        phone: '',
        dob: '',
        address: '',
        email: '',
        reason: ''
    });

    const [specialties, setSpecialties] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [selectedSpecialty, setSelectedSpecialty] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [scheduleTime, setScheduleTime] = useState('');

    // Lấy tất cả chuyên khoa
    useEffect(() => {
        axios.get('/api/v1/specialty/read').then(res => {
            if (res.EC === 0) {
                setSpecialties(res.DT.map(s => ({ value: s.id, label: s.name })));
            }
        });
    }, []);

    // Lấy danh sách bác sĩ theo chuyên khoa
    useEffect(() => {
        if (selectedSpecialty) {
            setSelectedDoctor(null);
            axios.get(`/api/v1/doctor/by-specialty/${selectedSpecialty.value}`).then(res => {
                if (res.EC === 0) {
                    setDoctors(res.DT.map(d => ({ value: d.id, label: d.username })));
                } else {
                    setDoctors([]);
                }
            });
        }
    }, [selectedSpecialty]);

    const handleSubmit = async () => {
        if (!selectedDoctor || !scheduleTime) {
            toast.error("Vui lòng chọn bác sĩ và thời gian");
            return;
        }

        const data = {
            ...form,
            specialtyId: selectedSpecialty.value,
            doctorId: selectedDoctor.value,
            scheduleTime
        };

        const res = await axios.post('/api/v1/booking/create', data);
        if (res.EC === 0) {
            toast.success("Đặt lịch thành công");
        } else {
            toast.error(res.EM || "Đặt lịch thất bại");
        }
    };

    return (
        <div className="container mt-4">
            <h3>Đặt lịch khám</h3>
            <div className="mb-3">
                <label>Tên</label>
                <input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="mb-3">
                <label>Số điện thoại</label>
                <input className="form-control" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="mb-3">
                <label>Ngày sinh</label>
                <input type="date" className="form-control" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} />
            </div>
            <div className="mb-3">
                <label>Địa chỉ</label>
                <input className="form-control" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
            </div>
            <div className="mb-3">
                <label>Email</label>
                <input className="form-control" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="mb-3">
                <label>Chuyên khoa</label>
                <Select options={specialties} value={selectedSpecialty} onChange={setSelectedSpecialty} />
            </div>
            <div className="mb-3">
                <label>Bác sĩ</label>
                <Select options={doctors} value={selectedDoctor} onChange={setSelectedDoctor} />
            </div>
            <div className="mb-3">
                <label>Thời gian khám</label>
                <input type="datetime-local" className="form-control" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} />
            </div>
            <div className="mb-3">
                <label>Lý do khám</label>
                <textarea className="form-control" value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} />
            </div>
            <button className="btn btn-primary" onClick={handleSubmit}>Đặt lịch</button>
        </div>
    );
};

export default AppointmentForm;
