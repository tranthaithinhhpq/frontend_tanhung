import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from '../../../setup/axios';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import moment from 'moment';

const BookingCreate = () => {
    const [form, setForm] = useState({
        name: '', phone: '', dob: '', address: '', email: '', reason: ''
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


    // Load specialties
    useEffect(() => {
        axios.get('/api/v1/specialty/read').then(res => {
            if (res.EC === 0) {
                setSpecialties(res.DT.map(s => ({ value: s.id, label: s.name })));
            }
        });
    }, []);

    // Load doctors và dịch vụ theo specialty
    useEffect(() => {
        if (selectedSpecialty) {
            setSelectedDoctor(null);
            setSelectedService(null);

            axios.get(`/api/v1/doctor/by-specialty/${selectedSpecialty.value}`).then(res => {
                if (res.EC === 0) {
                    setDoctors(res.DT.map(d => ({ value: d.id, label: d.doctorName })));
                }
            });

            axios.get(`/api/v1/service-price/selectable/${selectedSpecialty.value}`).then(res => {
                if (res.EC === 0) {
                    const mapped = [];
                    res.DT.forEach(s => {
                        // Giá dịch vụ thường
                        mapped.push({
                            value: s.id,
                            label: `${s.name} - ${s.price.toLocaleString()}đ`,
                            type: 'regular'
                        });

                        // Nếu có giá bảo hiểm và > 0 thì thêm lựa chọn thứ 2
                        if (s.priceInsurance && s.priceInsurance > 0) {
                            mapped.push({
                                value: s.id,
                                label: `${s.name} (có BHYT) - ${s.priceInsurance.toLocaleString()}đ`,
                                type: 'insurance'
                            });
                        }
                    });

                    setServices(mapped);
                }
            });
        }
    }, [selectedSpecialty]);

    // Load lịch bác sĩ
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
                    setTimeSlots([]);
                }
            });
        }
    }, [selectedDoctor]);

    // Xử lý chọn ngày khám
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

    // Gửi lịch hẹn
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
            serviceType: selectedService?.type || 'regular',  // 👈 Gửi lên nếu muốn biết loại giá
            scheduleTime: moment(`${format(selectedDate, "yyyy-MM-dd")} ${selectedTime.time}`, "YYYY-MM-DD HH:mm").toISOString()
        };

        try {
            const res = await axios.post('/api/v1/booking/create', data);
            if (res.EC === 0) {
                toast.success("Đặt lịch thành công");
                setForm({ name: '', phone: '', dob: '', address: '', email: '', reason: '' });
                setSelectedSpecialty(null);
                setSelectedDoctor(null);
                setSelectedService(null);
                setSelectedDate(null);
                setSelectedTime(null);
                setTimeSlots([]);
            } else {
                toast.error(res.EM || "Đặt lịch thất bại");
            }
        } catch (err) {
            toast.error("Lỗi khi gửi yêu cầu đặt lịch");
        }
    };

    return (
        <div className="container mt-4">
            <h3>Admin - Đặt lịch khám</h3>

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
                <Select options={specialties} value={selectedSpecialty} onChange={setSelectedSpecialty} />
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

            <button className="btn btn-primary" onClick={handleSubmit}>Đặt lịch</button>
        </div>
    );
};

export default BookingCreate;
