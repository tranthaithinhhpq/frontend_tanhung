import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from '../../../setup/axios';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const AppointmentForm = () => {
    const [form, setForm] = useState({
        name: '', phone: '', dob: '', address: '', email: '', reason: ''
    });
    const [specialties, setSpecialties] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [selectedSpecialty, setSelectedSpecialty] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [availableDates, setAvailableDates] = useState([]);
    const [scheduleMap, setScheduleMap] = useState({});
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [timeSlots, setTimeSlots] = useState([]);

    // Load danh sách chuyên khoa
    useEffect(() => {
        axios.get('/api/v1/specialty/read').then(res => {
            if (res.EC === 0) {
                setSpecialties(res.DT.map(s => ({ value: s.id, label: s.name })));
            }
        }).catch(err => console.error("❌ Lỗi load specialty:", err));
    }, []);

    // Load bác sĩ theo chuyên khoa
    useEffect(() => {
        if (selectedSpecialty) {
            setSelectedDoctor(null);
            axios.get(`/api/v1/doctor/by-specialty/${selectedSpecialty.value}`).then(res => {
                if (res.EC === 0) {
                    setDoctors(res.DT.map(d => ({ value: d.id, label: d.doctorName })));
                } else {
                    setDoctors([]);
                }
            }).catch(err => console.error("❌ Lỗi load doctor:", err));
        }
    }, [selectedSpecialty]);

    // Load lịch làm việc theo bác sĩ
    useEffect(() => {
        if (selectedDoctor) {
            axios.get(`/api/v1/doctor/${selectedDoctor.value}/schedule`).then(res => {
                if (res.EC === 0) {
                    const mappedDates = res.DT.map(item => new Date(item.date));
                    const schedule = res.DT.reduce((acc, item) => {
                        acc[item.date] = item.slots;
                        return acc;
                    }, {});
                    setAvailableDates(mappedDates);
                    setScheduleMap(schedule);
                    setSelectedDate(null);
                    setSelectedTime(null);
                }
            }).catch(err => console.error("❌ Lỗi load schedule:", err));
        }
    }, [selectedDoctor]);

    // Cập nhật khung giờ khi chọn ngày
    const handleDateChange = (date) => {
        setSelectedDate(date);
        const dateStr = format(date, "yyyy-MM-dd");
        const slots = scheduleMap[dateStr] || [];

        const formattedSlots = slots.map(s => ({
            value: s.time,
            label: s.time,
            slotId: s.slotId
        }));

        setTimeSlots(formattedSlots);
        setSelectedTime(null);
    };

    const handleSubmit = async () => {
        if (!selectedDoctor || !selectedDate || !selectedTime) {
            toast.error("Vui lòng chọn đầy đủ bác sĩ, ngày và giờ khám");
            return;
        }

        const data = {
            ...form,
            specialtyId: selectedSpecialty.value,
            doctorId: selectedDoctor.value,
            slotId: selectedTime.slotId,
            scheduleTime: `${format(selectedDate, "yyyy-MM-dd")} ${selectedTime.value}`
        };

        try {
            const res = await axios.post('/api/v1/booking/create', data);
            if (res.EC === 0) {
                toast.success("Đặt lịch thành công");
                setForm({ name: '', phone: '', dob: '', address: '', email: '', reason: '' });
                setSelectedSpecialty(null);
                setSelectedDoctor(null);
                setSelectedDate(null);
                setSelectedTime(null);
                setTimeSlots([]);
            } else {
                toast.error(res.EM || "Đặt lịch thất bại");
            }
        } catch (err) {
            console.error("❌ Lỗi gửi lịch hẹn:", err);
            toast.error("Lỗi khi gửi yêu cầu đặt lịch");
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
                <label>Ngày khám</label>
                <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    minDate={new Date()}
                    includeDates={availableDates}
                    placeholderText="Chọn ngày khả dụng"
                    className="form-control"
                />
            </div>
            <div className="mb-3">
                <label>Khung giờ khám</label>
                <Select
                    options={timeSlots}
                    value={selectedTime}
                    onChange={setSelectedTime}
                    placeholder="Chọn giờ khám"
                    isDisabled={!selectedDate}
                />
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
