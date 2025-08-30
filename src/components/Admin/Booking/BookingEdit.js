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

    const [holidays, setHolidays] = useState([]);

    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);

    const [availableDates, setAvailableDates] = useState([]);
    const [scheduleMap, setScheduleMap] = useState({});
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [timeSlots, setTimeSlots] = useState([]);

    // ✅ Lưu lại chuyên khoa gốc của booking để cho phép giữ nguyên dù hiện tại không selectable
    const [originalSpecialtyId, setOriginalSpecialtyId] = useState(null);

    // Load thông tin lịch hẹn hiện tại
    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const res = await axios.get(`/api/v1/admin/booking/update/${id}`);
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

                    setSelectedSpecialty({ value: b.specialtyId, label: b.specialtyName, meta: { isSelectable: undefined } });
                    setOriginalSpecialtyId(b.specialtyId);

                    setSelectedDoctor({ value: b.doctorId, label: b.doctorName });
                    setSelectedService(b.servicePriceId ? { value: b.servicePriceId, label: b.serviceName } : null);

                    const date = moment(b.scheduleTime).toDate();
                    const timeLabel = moment(b.scheduleTime).format("HH:mm");

                    setSelectedDate(date);
                    setSelectedTime({ value: b.slotId, label: timeLabel, time: timeLabel });

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

    // Load specialties (chỉ chuyên khoa cho phép đặt lịch)
    useEffect(() => {
        axios.get('/api/v1/specialty/read').then(res => {
            if (res.EC === 0) {
                const list = Array.isArray(res.DT) ? res.DT : [];
                const allowed = list.filter(s =>
                    s?.isSelectable === true || s?.isSelectable === 1 || s?.isSelectable === '1'
                );
                setSpecialties(
                    allowed.map(s => ({
                        value: s.id,
                        label: s.name,
                        meta: { isSelectable: true }
                    }))
                );
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
                    const mapped = [];
                    res.DT.forEach(s => {
                        mapped.push({
                            value: s.id,
                            label: `${s.name} - ${s.price.toLocaleString()}đ`,
                            type: 'regular'
                        });
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

                    // Nếu KHÔNG phải lần load đầu tiên và đã có selectedDate thì load lại time slots
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
        axios.get('/api/v1/holiday/list')
            .then(res => {
                if (res.EC === 0) {
                    // convert thành array Date object
                    setHolidays(res.DT.map(h => new Date(h.date)));
                }
            })
            .catch(err => console.error('❌ Lỗi load holiday:', err));
    }, []);

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
        if (!form.name.trim()) {
            toast.error("Vui lòng nhập họ tên bệnh nhân");
            return;
        }
        if (!form.phone.trim()) {
            toast.error("Vui lòng nhập số điện thoại");
            return;
        }
        if (!form.reason.trim()) {
            toast.error("Vui lòng nhập lý do khám");
            return;
        }
        if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
            toast.error("Email không hợp lệ");
            return;
        }
        if (!selectedSpecialty) {
            toast.error("Vui lòng chọn chuyên khoa");
            return;
        }
        if (!selectedDoctor) {
            toast.error("Vui lòng chọn bác sĩ");
            return;
        }
        if (!selectedDate) {
            toast.error("Vui lòng chọn ngày khám");
            return;
        }
        if (!selectedTime) {
            toast.error("Vui lòng chọn giờ khám");
            return;
        }

        // ✅ Guard: chỉ cho phép chọn chuyên khoa cho phép đặt lịch.
        // - Nếu chuyên khoa đang chọn nằm trong danh sách selectable (meta.isSelectable === true) => OK.
        // - Nếu KHÔNG, chỉ cho phép nếu đây là chuyên khoa gốc của booking (user không đổi chuyên khoa).
        const isSelectable = selectedSpecialty?.meta?.isSelectable === true;
        const isOriginal = selectedSpecialty?.value === originalSpecialtyId;
        if (!isSelectable && !isOriginal) {
            toast.error("Chuyên khoa này hiện không cho phép đặt lịch. Vui lòng chọn chuyên khoa khác.");
            return;
        }

        const data = {
            ...form,
            specialtyId: selectedSpecialty.value,
            doctorId: selectedDoctor.value,
            slotId: selectedTime.value,
            servicePriceId: selectedService?.value,
            serviceType: selectedService?.type || 'regular',
            scheduleTime: moment(`${format(selectedDate, "yyyy-MM-dd")} ${selectedTime.time}`, "YYYY-MM-DD HH:mm").toISOString()
        };

        try {
            const res = await axios.put(`/api/v1/admin/booking/update/${id}`, data);
            if (res.EC === 0) {
                toast.success("Cập nhật lịch thành công");
                history.push('/admin/booking');
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
                    placeholder={specialties.length ? "Chọn chuyên khoa" : "Không có chuyên khoa cho phép đặt lịch"}
                    isDisabled={!specialties.length}
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
                    excludeDates={holidays}
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


