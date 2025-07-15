import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from '../../../setup/axios';
import { toast } from 'react-toastify';
import { useParams, useHistory } from 'react-router-dom';
import { format } from 'date-fns';
import moment from 'moment';

const BookingEdit = () => {
    const { id } = useParams(); // ID của booking cần sửa
    const history = useHistory();
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [form, setForm] = useState({
        name: '', phone: '', dob: '', address: '', email: '', reason: '', status: 'PENDING'
    });

    const [specialties, setSpecialties] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [selectedSpecialty, setSelectedSpecialty] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);

    const [availableDates, setAvailableDates] = useState([]);
    const [scheduleMap, setScheduleMap] = useState({});
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [timeSlots, setTimeSlots] = useState([]);

    // Load thông tin lịch hẹn hiện tại
    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const res = await axios.get(`/api/v1/booking/${id}`);
                if (res.EC === 0) {
                    const b = res.DT;
                    setForm({
                        name: b.name,
                        phone: b.phone,
                        dob: b.dob?.split('T')[0] || '',
                        address: b.address,
                        email: b.email,
                        reason: b.reason
                    });

                    setSelectedSpecialty({ value: b.specialtyId, label: b.specialtyName });
                    setSelectedDoctor({ value: b.doctorId, label: b.doctorName });
                    setSelectedService(b.servicePriceId ? { value: b.servicePriceId, label: b.serviceName } : null);
                    const date = moment(b.scheduleTime).toDate();
                    const timeLabel = moment(b.scheduleTime).format("HH:mm");

                    setSelectedDate(date);
                    setSelectedTime({ value: b.slotId, label: timeLabel, time: timeLabel });
                } else {
                    toast.error(res.EM);
                }
            } catch (err) {
                toast.error("Không thể tải lịch hẹn");
            }
        };
        fetchBooking();
    }, [id]);

    // Load specialties
    useEffect(() => {
        axios.get('/api/v1/specialty/read').then(res => {
            if (res.EC === 0) {
                setSpecialties(res.DT.map(s => ({ value: s.id, label: s.name })));
            }
        });
    }, []);

    // Load doctors, dịch vụ theo specialty
    useEffect(() => {
        if (selectedSpecialty) {
            axios.get(`/api/v1/doctor/by-specialty/${selectedSpecialty.value}`).then(res => {
                if (res.EC === 0) {
                    setDoctors(res.DT.map(d => ({ value: d.id, label: d.doctorName })));
                }
            });

            axios.get(`/api/v1/service-price/selectable/${selectedSpecialty.value}`).then(res => {
                if (res.EC === 0) {
                    setServices(res.DT.map(s => ({
                        value: s.id,
                        label: `${s.name} - ${s.price.toLocaleString()}đ`
                    })));
                }
            });
        }
    }, [selectedSpecialty]);


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

                    // ✅ Nếu KHÔNG phải lần load đầu tiên và đã có selectedDate thì load lại time slots
                    if (!isFirstLoad && selectedDate) {
                        const dateStr = format(selectedDate, "yyyy-MM-dd");
                        const slots = schedule[dateStr] || [];
                        const formattedSlots = slots.map(s => ({
                            value: s.slotId,
                            label: s.time,
                            time: s.time
                        }));
                        setTimeSlots(formattedSlots);
                        setSelectedTime(null); // reset khung giờ (user chọn lại)
                    }
                }
            });
        }
    }, [selectedDoctor]);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const res = await axios.get(`/api/v1/booking/${id}`);
                if (res.EC === 0) {
                    const b = res.DT;
                    setForm({
                        name: b.name,
                        phone: b.phone,
                        dob: b.dob?.split('T')[0] || '',
                        address: b.address,
                        email: b.email,
                        reason: b.reason,
                        status: b.status || 'PENDING'
                    });

                    setSelectedSpecialty({ value: b.specialtyId, label: b.specialtyName });
                    setSelectedDoctor({ value: b.doctorId, label: b.doctorName });
                    setSelectedService(b.servicePriceId ? { value: b.servicePriceId, label: b.serviceName } : null);

                    const date = moment(b.scheduleTime).toDate();
                    const timeLabel = moment(b.scheduleTime).format("HH:mm");

                    setSelectedDate(date);
                    setSelectedTime({ value: b.slotId, label: timeLabel, time: timeLabel });

                    // ✅ Đánh dấu đã load lần đầu
                    setIsFirstLoad(false);
                } else {
                    toast.error(res.EM);
                }
            } catch (err) {
                toast.error("Không thể tải lịch hẹn");
            }
        };
        fetchBooking();
    }, [id]);

    const handleDateChange = (date) => {
        setSelectedDate(date);
        const dateStr = format(date, "yyyy-MM-dd");
        const slots = scheduleMap[dateStr] || [];

        const formattedSlots = slots.map(s => ({
            value: s.slotId,
            label: s.time,
            time: s.time
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
            slotId: selectedTime.value,
            servicePriceId: selectedService?.value,
            scheduleTime: moment(`${format(selectedDate, "yyyy-MM-dd")} ${selectedTime.time}`, "YYYY-MM-DD HH:mm").toISOString()
        };

        try {
            const res = await axios.put(`/api/v1/booking/${id}`, data);
            if (res.EC === 0) {
                toast.success("Cập nhật lịch thành công");
                history.push('/admin/booking'); // hoặc reload lại
            } else {
                toast.error(res.EM);
            }
        } catch (err) {
            toast.error("Lỗi khi cập nhật lịch");
        }
    };

    const convertStatusLabel = (status) => {
        switch (status) {
            case 'PENDING': return 'Chờ xác nhận';
            case 'CONFIRMED': return 'Đã xác nhận';
            case 'CANCELLED': return 'Đã hủy';
            case 'RESCHEDULED': return 'Đã dời lịch';
            case 'CHECKED_IN': return 'Đã đến khám';
            case 'COMPLETED': return 'Đã khám xong';
            case 'NO_SHOW': return 'Không đến';
            default: return status;
        }
    };


    return (
        <div className="container mt-4">
            <h3>Chỉnh sửa lịch hẹn</h3>

            <div className="mb-3"><label>Họ tên bệnh nhân</label>
                <input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>

            <div className="mb-3"><label>Số điện thoại</label>
                <input className="form-control" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>

            <div className="mb-3"><label>Ngày sinh</label>
                <input type="date" className="form-control" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} />
            </div>

            <div className="mb-3"><label>Địa chỉ</label>
                <input className="form-control" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
            </div>

            <div className="mb-3"><label>Email</label>
                <input className="form-control" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>

            <div className="mb-3"><label>Lý do khám</label>
                <input className="form-control" value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} />
            </div>

            <div className="mb-3"><label>Chuyên khoa</label>
                {/* <Select options={specialties} value={selectedSpecialty} onChange={setSelectedSpecialty} /> */}
                <Select
                    options={specialties}
                    value={selectedSpecialty}
                    onChange={(selected) => {
                        setSelectedSpecialty(selected);
                        setSelectedDoctor(null);
                        setDoctors([]);
                        setSelectedService(null);
                        setServices([]);
                        setSelectedDate(null);
                        setAvailableDates([]);
                        setScheduleMap({});
                        setSelectedTime(null);
                        setTimeSlots([]);
                    }}
                />
            </div>

            <div className="mb-3"><label>Bác sĩ</label>
                <Select options={doctors} value={selectedDoctor} onChange={setSelectedDoctor} />
            </div>

            <div className="mb-3"><label>Dịch vụ khám</label>
                <Select options={services} value={selectedService} onChange={setSelectedService} placeholder="Chọn dịch vụ" isDisabled={!services.length} />
            </div>

            <div className="mb-3"><label>Ngày khám</label>
                <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    minDate={new Date()}
                    maxDate={new Date(new Date().setDate(new Date().getDate() + 30))}
                    includeDates={availableDates}
                    placeholderText="Chọn ngày khả dụng"
                    className="form-control"
                />
            </div>

            <div className="mb-3"><label>Khung giờ khám</label>
                <Select options={timeSlots} value={selectedTime} onChange={setSelectedTime} placeholder="Chọn giờ khám" isDisabled={!selectedDate} />
            </div>

            <div className="mb-3"><label>Trạng thái</label>
                <Select
                    options={[
                        { value: 'PENDING', label: 'Chờ xác nhận' },
                        { value: 'CONFIRMED', label: 'Đã xác nhận' },
                        { value: 'CANCELLED', label: 'Đã hủy' },
                        { value: 'RESCHEDULED', label: 'Đã dời lịch' },
                        { value: 'CHECKED_IN', label: 'Đã đến khám' },
                        { value: 'COMPLETED', label: 'Đã khám xong' },
                        { value: 'NO_SHOW', label: 'Không đến' },
                    ]}
                    value={{ value: form.status, label: convertStatusLabel(form.status) }}
                    onChange={(selected) => setForm({ ...form, status: selected.value })}
                />
            </div>

            <button className="btn btn-primary" onClick={handleSubmit}>Cập nhật</button>
        </div>
    );
};

export default BookingEdit;




