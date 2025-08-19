// // ✅ FRONTEND - AppointmentForm.js
// import React, { useEffect, useState } from 'react';
// import Select from 'react-select';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import axios from '../../../setup/axios';
// import { toast } from 'react-toastify';
// import { format } from 'date-fns';
// import moment from 'moment';


// const AppointmentForm = () => {
//     const [form, setForm] = useState({
//         name: '', phone: '', dob: '', address: '', email: '', reason: ''
//     });
//     const [specialties, setSpecialties] = useState([]);
//     const [doctors, setDoctors] = useState([]);
//     const [selectedSpecialty, setSelectedSpecialty] = useState(null);
//     const [selectedDoctor, setSelectedDoctor] = useState(null);
//     const [availableDates, setAvailableDates] = useState([]);
//     const [scheduleMap, setScheduleMap] = useState({});
//     const [selectedDate, setSelectedDate] = useState(null);
//     const [selectedTime, setSelectedTime] = useState(null);
//     const [timeSlots, setTimeSlots] = useState([]);
//     const [services, setServices] = useState([]);
//     const [selectedService, setSelectedService] = useState(null);

//     // Load specialties
//     useEffect(() => {
//         axios.get('/api/v1/specialty/read')
//             .then(res => {
//                 if (res.EC === 0) {
//                     setSpecialties(res.DT.map(s => ({ value: s.id, label: s.name })));
//                 }
//             }).catch(err => console.error("❌ Lỗi load specialty:", err));
//     }, []);

//     // Load doctors theo specialty
//     useEffect(() => {
//         if (selectedSpecialty) {
//             setSelectedDoctor(null);
//             setSelectedService(null);

//             axios.get(`/api/v1/doctor/by-specialty/${selectedSpecialty.value}`)
//                 .then(res => {
//                     if (res.EC === 0) {
//                         setDoctors(res.DT.map(d => ({ value: d.id, label: d.doctorName })));
//                     } else setDoctors([]);
//                 });

//             // ✅ Thay phần trong useEffect load service:
//             axios.get(`/api/v1/service-price/selectable/${selectedSpecialty.value}`).then(res => {
//                 if (res.EC === 0) {
//                     const mapped = [];

//                     res.DT.forEach(s => {
//                         // Giá thường
//                         mapped.push({
//                             value: s.id,
//                             label: `${s.name} - ${s.price.toLocaleString()}đ`,
//                             type: 'regular'
//                         });

//                         // Giá BHYT nếu có
//                         if (s.priceInsurance && s.priceInsurance > 0) {
//                             mapped.push({
//                                 value: s.id,
//                                 label: `${s.name} (có BHYT) - ${s.priceInsurance.toLocaleString()}đ`,
//                                 type: 'insurance'
//                             });
//                         }
//                     });

//                     setServices(mapped);
//                 } else {
//                     setServices([]);
//                 }
//             });
//         }
//     }, [selectedSpecialty]);

//     // Load schedule khi chọn bác sĩ
//     useEffect(() => {
//         if (selectedDoctor) {
//             axios.get(`/api/v1/doctor/${selectedDoctor.value}/schedule`).then(res => {
//                 if (res.EC === 0) {
//                     const mappedDates = res.DT.map(item => new Date(item.date));
//                     const schedule = res.DT.reduce((acc, item) => {
//                         acc[item.date] = item.slots;
//                         return acc;
//                     }, {});
//                     setAvailableDates(mappedDates);
//                     setScheduleMap(schedule);
//                     setSelectedDate(null);
//                     setSelectedTime(null);
//                     setTimeSlots([]);

//                 }
//             }).catch(err => console.error("❌ Lỗi load schedule:", err));
//         }
//     }, [selectedDoctor]);

//     // ✅ Handle change ngày khám
//     const handleDateChange = (date) => {
//         setSelectedDate(date);
//         const dateStr = format(date, "yyyy-MM-dd");
//         const slots = scheduleMap[dateStr] || [];

//         const formattedSlots = slots.map(s => ({
//             value: s.slotId,
//             label: s.time,
//             time: s.time
//         }));

//         setTimeSlots(formattedSlots);
//         console.log("timeSlots: ", formattedSlots);
//         setSelectedTime(null);
//     };


//     const handleSubmit = async () => {
//         // ✅ Kiểm tra các trường bắt buộc
//         if (!form.name.trim()) {
//             toast.error("Vui lòng nhập họ tên");
//             return;
//         }
//         if (form.name.length < 3) {
//             toast.error("Họ tên phải có ít nhất 3 ký tự");
//             return;
//         }

//         const phoneRegex = /^(0|\+84)[0-9]{9}$/;
//         if (!form.phone.trim() || !phoneRegex.test(form.phone.trim())) {
//             toast.error("Vui lòng nhập số điện thoại hợp lệ (bắt đầu bằng 0 hoặc +84, có 10 số)");
//             return;
//         }

//         if (!form.dob) {
//             toast.error("Vui lòng nhập ngày sinh");
//             return;
//         }

//         const dobDate = new Date(form.dob);
//         if (dobDate > new Date()) {
//             toast.error("Ngày sinh không được lớn hơn hiện tại");
//             return;
//         }

//         if (!form.address.trim()) {
//             toast.error("Vui lòng nhập địa chỉ");
//             return;
//         }

//         if (form.email.trim()) {
//             const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//             if (!emailRegex.test(form.email.trim())) {
//                 toast.error("Email không hợp lệ");
//                 return;
//             }
//         }

//         if (!selectedSpecialty) {
//             toast.error("Vui lòng chọn chuyên khoa");
//             return;
//         }

//         if (!selectedDoctor) {
//             toast.error("Vui lòng chọn bác sĩ");
//             return;
//         }

//         if (!selectedDate) {
//             toast.error("Vui lòng chọn ngày khám");
//             return;
//         }

//         if (!selectedTime) {
//             toast.error("Vui lòng chọn giờ khám");
//             return;
//         }

//         if (!form.reason.trim()) {
//             toast.error("Vui lòng nhập lý do khám");
//             return;
//         }

//         const data = {
//             ...form,
//             specialtyId: selectedSpecialty.value,
//             doctorId: selectedDoctor.value,
//             slotId: selectedTime.value,
//             servicePriceId: selectedService?.value,
//             serviceType: selectedService?.type || 'regular',
//             scheduleTime: moment(`${format(selectedDate, "yyyy-MM-dd")} ${selectedTime.time}`, "YYYY-MM-DD HH:mm").toISOString()
//         };

//         try {
//             const res = await axios.post('/api/v1/booking/create', data);
//             if (res.EC === 0) {
//                 toast.success("Đặt lịch thành công");
//                 setForm({ name: '', phone: '', dob: '', address: '', email: '', reason: '' });
//                 setSelectedSpecialty(null);
//                 setSelectedDoctor(null);
//                 setSelectedDate(null);
//                 setSelectedTime(null);
//                 setTimeSlots([]);
//             } else {
//                 toast.error(res.EM || "Đặt lịch thất bại");
//             }
//         } catch (err) {
//             console.error("❌ Lỗi gửi lịch hẹn:", err);
//             toast.error("Lỗi khi gửi yêu cầu đặt lịch");
//         }
//     };


//     return (
//         <div className="container mt-4">
//             <h3>Đặt lịch khám</h3>
//             <div className="mb-3">
//                 <label>Tên</label>
//                 <input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
//             </div>
//             <div className="mb-3">
//                 <label>Số điện thoại</label>
//                 <input className="form-control" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
//             </div>
//             <div className="mb-3">
//                 <label>Ngày sinh</label>
//                 <input type="date" className="form-control" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} />
//             </div>
//             <div className="mb-3">
//                 <label>Địa chỉ</label>
//                 <input className="form-control" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
//             </div>
//             <div className="mb-3">
//                 <label>Email</label>
//                 <input className="form-control" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
//             </div>
//             <div className="mb-3">
//                 <label>Chuyên khoa</label>
//                 <Select options={specialties} value={selectedSpecialty} onChange={setSelectedSpecialty} />
//             </div>
//             <div className="mb-3">
//                 <label>Bác sĩ</label>
//                 <Select options={doctors} value={selectedDoctor} onChange={setSelectedDoctor} />
//             </div>
//             <div className="mb-3">
//                 <label>Dịch vụ khám</label>
//                 <Select
//                     options={services}
//                     value={selectedService}
//                     onChange={setSelectedService}
//                     placeholder="Chọn dịch vụ"
//                     isDisabled={!services.length}
//                 />
//             </div>
//             <div className="mb-3">
//                 <label>Ngày khám</label>
//                 <DatePicker
//                     selected={selectedDate}
//                     onChange={handleDateChange}
//                     minDate={new Date()}
//                     maxDate={new Date(new Date().setDate(new Date().getDate() + 30))}
//                     includeDates={availableDates}
//                     placeholderText="Chọn ngày khả dụng"
//                     className="form-control"
//                 />
//             </div>
//             <div className="mb-3">
//                 <label>Khung giờ khám</label>
//                 <Select
//                     options={timeSlots}
//                     value={selectedTime}
//                     onChange={setSelectedTime}
//                     placeholder="Chọn giờ khám"
//                     isDisabled={!selectedDate}
//                 />
//             </div>

//             <div className="mb-3">
//                 <label>Lý do khám</label>
//                 <textarea
//                     className="form-control"
//                     rows={3}
//                     placeholder="Nhập lý do khám (nếu có)"
//                     value={form.reason}
//                     onChange={e => setForm({ ...form, reason: e.target.value })}
//                 />
//             </div>

//             <button className="btn btn-primary" onClick={handleSubmit}>Đặt lịch</button>
//         </div>
//     );
// };

// export default AppointmentForm;



// ✅ FRONTEND - AppointmentForm.js
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from '../../../setup/axios';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import moment from 'moment';

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

    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);

    // Load specialties (lọc chỉ những chuyên khoa cho phép đặt lịch)
    useEffect(() => {
        axios.get('/api/v1/specialty/read')
            .then(res => {
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
            })
            .catch(err => console.error('❌ Lỗi load specialty:', err));
    }, []);

    // Load doctors & services khi chọn specialty
    useEffect(() => {
        if (selectedSpecialty) {
            // reset các lựa chọn phụ thuộc
            setSelectedDoctor(null);
            setDoctors([]);
            setSelectedService(null);
            setServices([]);
            setSelectedDate(null);
            setAvailableDates([]);
            setScheduleMap({});
            setSelectedTime(null);
            setTimeSlots([]);

            axios.get(`/api/v1/doctor/by-specialty/${selectedSpecialty.value}`)
                .then(res => {
                    if (res.EC === 0) {
                        setDoctors(res.DT.map(d => ({ value: d.id, label: d.doctorName })));
                    } else setDoctors([]);
                });

            // dịch vụ chọn được (đã lọc ở backend theo specialty + isSelectable của service)
            axios.get(`/api/v1/service-price/selectable/${selectedSpecialty.value}`)
                .then(res => {
                    if (res.EC === 0) {
                        const mapped = [];
                        res.DT.forEach(s => {
                            // Giá thường
                            mapped.push({
                                value: s.id,
                                label: `${s.name} - ${s.price.toLocaleString()}đ`,
                                type: 'regular'
                            });
                            // Giá BHYT (nếu có)
                            if (s.priceInsurance && s.priceInsurance > 0) {
                                mapped.push({
                                    value: s.id,
                                    label: `${s.name} (có BHYT) - ${s.priceInsurance.toLocaleString()}đ`,
                                    type: 'insurance'
                                });
                            }
                        });
                        setServices(mapped);
                    } else setServices([]);
                });
        }
    }, [selectedSpecialty]);

    // Load schedule khi chọn bác sĩ
    useEffect(() => {
        if (selectedDoctor) {
            axios.get(`/api/v1/doctor/${selectedDoctor.value}/schedule`)
                .then(res => {
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
                })
                .catch(err => console.error('❌ Lỗi load schedule:', err));
        }
    }, [selectedDoctor]);

    // Handle đổi ngày -> load slot
    const handleDateChange = (date) => {
        setSelectedDate(date);
        const dateStr = format(date, 'yyyy-MM-dd');
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
        // Validate cơ bản
        if (!form.name.trim()) return toast.error('Vui lòng nhập họ tên');
        if (form.name.trim().length < 3) return toast.error('Họ tên phải có ít nhất 3 ký tự');

        const phoneRegex = /^(0|\+84)[0-9]{9}$/;
        if (!form.phone.trim() || !phoneRegex.test(form.phone.trim())) {
            return toast.error('Vui lòng nhập số điện thoại hợp lệ (bắt đầu bằng 0 hoặc +84, có 10 số)');
        }

        if (!form.dob) return toast.error('Vui lòng nhập ngày sinh');
        const dobDate = new Date(form.dob);
        if (dobDate > new Date()) return toast.error('Ngày sinh không được lớn hơn hiện tại');

        if (!form.address.trim()) return toast.error('Vui lòng nhập địa chỉ');

        if (form.email.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(form.email.trim())) return toast.error('Email không hợp lệ');
        }

        if (!selectedSpecialty) return toast.error('Vui lòng chọn chuyên khoa');
        // ✅ Guard: đảm bảo chỉ chuyên khoa cho phép
        if (!selectedSpecialty.meta?.isSelectable) {
            return toast.error('Chuyên khoa này hiện không cho phép đặt lịch. Vui lòng chọn chuyên khoa khác.');
        }

        if (!selectedDoctor) return toast.error('Vui lòng chọn bác sĩ');
        if (!selectedDate) return toast.error('Vui lòng chọn ngày khám');
        if (!selectedTime) return toast.error('Vui lòng chọn giờ khám');
        if (!form.reason.trim()) return toast.error('Vui lòng nhập lý do khám');

        const data = {
            ...form,
            specialtyId: selectedSpecialty.value,
            doctorId: selectedDoctor.value,
            slotId: selectedTime.value,
            servicePriceId: selectedService?.value,
            serviceType: selectedService?.type || 'regular',
            scheduleTime: moment(
                `${format(selectedDate, 'yyyy-MM-dd')} ${selectedTime.time}`,
                'YYYY-MM-DD HH:mm'
            ).toISOString()
        };

        try {
            const res = await axios.post('/api/v1/booking/create', data);
            if (res.EC === 0) {
                toast.success('Đặt lịch thành công');
                setForm({ name: '', phone: '', dob: '', address: '', email: '', reason: '' });
                setSelectedSpecialty(null);
                setSelectedDoctor(null);
                setSelectedService(null);
                setSelectedDate(null);
                setSelectedTime(null);
                setTimeSlots([]);
            } else {
                toast.error(res.EM || 'Đặt lịch thất bại');
            }
        } catch (err) {
            console.error('❌ Lỗi gửi lịch hẹn:', err);
            toast.error('Lỗi khi gửi yêu cầu đặt lịch');
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
                <Select
                    options={specialties}
                    value={selectedSpecialty}
                    onChange={(selected) => {
                        setSelectedSpecialty(selected);
                        // các state phụ thuộc đã reset ở useEffect(selectedSpecialty)
                    }}
                    placeholder={specialties.length ? 'Chọn chuyên khoa' : 'Không có chuyên khoa cho phép đặt lịch'}
                    isDisabled={!specialties.length}
                />
            </div>

            <div className="mb-3">
                <label>Bác sĩ</label>
                <Select options={doctors} value={selectedDoctor} onChange={setSelectedDoctor} />
            </div>

            <div className="mb-3">
                <label>Dịch vụ khám</label>
                <Select
                    options={services}
                    value={selectedService}
                    onChange={setSelectedService}
                    placeholder="Chọn dịch vụ"
                    isDisabled={!services.length}
                />
            </div>

            <div className="mb-3">
                <label>Ngày khám</label>
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
                <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Nhập lý do khám (nếu có)"
                    value={form.reason}
                    onChange={e => setForm({ ...form, reason: e.target.value })}
                />
            </div>

            <button className="btn btn-primary" onClick={handleSubmit}>Đặt lịch</button>
        </div>
    );
};

export default AppointmentForm;
