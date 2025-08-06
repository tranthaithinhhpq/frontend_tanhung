import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from '../../../setup/axios';
import { useParams, useHistory } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import Slider from 'react-slick';
import './Doctor.scss';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';

const buildImgSrc = (raw) => {
    if (!raw) return '';
    return raw.startsWith('http') ? raw : `${BACKEND_URL}${raw}`;
};

const NextArrow = (props) => (
    <div className="custom-arrow next" onClick={props.onClick}>
        <i className="bi bi-chevron-right"></i>
    </div>
);

const PrevArrow = (props) => (
    <div className="custom-arrow prev" onClick={props.onClick}>
        <i className="bi bi-chevron-left"></i>
    </div>
);

const DoctorDetailPage = () => {
    const { doctorId } = useParams();
    const history = useHistory();
    const [doctor, setDoctor] = useState(null);
    const [otherDoctors, setOtherDoctors] = useState([]);
    const [scheduleMap, setScheduleMap] = useState({});
    const [availableDates, setAvailableDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [slotsOfSelectedDate, setSlotsOfSelectedDate] = useState([]);

    useEffect(() => {
        if (!doctorId) {
            toast.error('Thiếu thông tin bác sĩ');
            return;
        }

        const fetchData = async () => {
            try {
                const [doctorRes, otherRes, scheduleRes] = await Promise.all([
                    axios.get(`/api/v1/doctor/detail/${doctorId}`),
                    axios.get(`/api/v1/doctor/others/${doctorId}`),
                    axios.get(`/api/v1/doctor/${doctorId}/schedule`)
                ]);

                if (doctorRes.EC === 0) setDoctor(doctorRes.DT);
                else toast.error(doctorRes.EM || 'Không tìm thấy bác sĩ');

                if (otherRes.EC === 0) setOtherDoctors(otherRes.DT);


                if (scheduleRes.EC === 0) {
                    const map = {};
                    const dates = [];
                    scheduleRes.DT.forEach(item => {
                        map[item.date] = item.slots;
                        dates.push(new Date(item.date));
                    });
                    setScheduleMap(map);
                    setAvailableDates(dates);

                    // 👉 Mặc định chọn hôm nay nếu hôm nay có lịch
                    const todayStr = moment().format('YYYY-MM-DD');
                    if (map[todayStr]) {
                        const today = new Date();
                        setSelectedDate(today);
                        setSlotsOfSelectedDate(map[todayStr]);
                    }
                }

            } catch (err) {
                console.error("Lỗi khi tải dữ liệu:", err);
                toast.error("Lỗi kết nối server");
            }
        };

        fetchData();
    }, [doctorId]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [doctorId]);

    const handleDateChange = (date) => {
        const dateStr = moment(date).format('YYYY-MM-DD');
        setSelectedDate(date);
        setSlotsOfSelectedDate(scheduleMap[dateStr] || []);
    };

    if (!doctor) return <div className="text-center my-5">Đang tải dữ liệu...</div>;

    return (
        <div className="container doctor-detail-page">
            {/* Thông tin bác sĩ */}
            <div className="card p-4 mb-4 shadow">
                <div className="row align-items-center">
                    <div className="col-md-3 text-center mb-3 mb-md-0">
                        <img
                            src={buildImgSrc(doctor.image)}
                            alt={doctor.doctorName}
                            className="doctor-img rounded"
                        />
                    </div>
                    <div className="col-md-9">
                        <p className="text-muted mb-1">Chức vụ: {doctor.Position?.name || 'N/A'}</p>
                        <h2 className="fw-bold">{doctor.doctorName}</h2>
                        <p className="text-muted mb-1">Khoa: {doctor.Specialty?.name || 'N/A'}</p>
                        <p className="text-muted mb-3">Học vị: {doctor.Degree?.name || 'N/A'}</p>
                        <button className="btn btn-success" onClick={() => history.push(`/booking/${doctor.id}`)}>
                            Đặt lịch khám
                        </button>
                    </div>
                </div>
            </div>

            {/* Xem lịch khám
            <div className="card p-4 shadow-sm mb-4">
                <h5 className="mb-3">Xem lịch khám</h5>
                <div className="mb-3">
                    <label>Chọn ngày:</label>
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        includeDates={availableDates}
                        minDate={new Date()}
                        maxDate={new Date(new Date().setDate(new Date().getDate() + 30))}
                        placeholderText="Chọn ngày khả dụng"
                        className="form-control"


                    />
                </div>
                {slotsOfSelectedDate.length > 0 ? (
                    <div className="d-flex flex-wrap gap-2">
                        {slotsOfSelectedDate.map(slot => (
                            <span key={slot.slotId} className="badge bg-info text-dark p-2">
                                {slot.time}
                            </span>
                        ))}
                    </div>
                ) : selectedDate ? (
                    <p className="text-muted">Không có khung giờ khả dụng trong ngày này.</p>
                ) : null}
            </div> */}

            {/* Xem lịch khám */}
            <div className="p-3 border rounded shadow-sm mb-4 bg-white">
                <h5 className="mb-3">Xem lịch khám</h5>
                <div className="mb-3">
                    <label>Chọn ngày:</label>
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        includeDates={availableDates}
                        minDate={new Date()}
                        maxDate={new Date(new Date().setDate(new Date().getDate() + 30))}
                        placeholderText="Chọn ngày khả dụng"
                        className="form-control"
                    />
                </div>
                {slotsOfSelectedDate.length > 0 ? (
                    <div className="d-flex flex-wrap gap-2">
                        {slotsOfSelectedDate.map(slot => (
                            <span key={slot.slotId} className="badge bg-info text-dark p-2">
                                {slot.time}
                            </span>
                        ))}
                    </div>
                ) : selectedDate ? (
                    <p className="text-muted">Không có khung giờ khả dụng trong ngày này.</p>
                ) : null}
            </div>




            {/* Nội dung markdown */}
            <div className="card p-4 shadow-sm mb-5">
                <div className="ql-editor" dangerouslySetInnerHTML={{ __html: doctor.markdownContent || 'Không có nội dung' }} />
            </div>

            {/* Bác sĩ khác - dạng slider */}
            <div>
                <h4 className="mb-3">Bác sĩ khác</h4>
                <Slider
                    dots={false}
                    infinite={otherDoctors.length > 4}
                    speed={500}
                    arrows={true}
                    nextArrow={<NextArrow />}
                    prevArrow={<PrevArrow />}
                    slidesToShow={4}
                    slidesToScroll={1}
                    responsive={[
                        {
                            breakpoint: 1200,
                            settings: {
                                slidesToShow: 3,
                                slidesToScroll: 1,
                                infinite: otherDoctors.length > 3
                            }
                        },
                        {
                            breakpoint: 992,
                            settings: {
                                slidesToShow: 2,
                                slidesToScroll: 1,
                                infinite: otherDoctors.length > 2
                            }
                        },
                        {
                            breakpoint: 576,
                            settings: {
                                slidesToShow: 1,
                                slidesToScroll: 1,
                                infinite: otherDoctors.length > 1
                            }
                        }
                    ]}
                >
                    {otherDoctors.map(doc => (
                        <div key={doc.id} className="px-2">
                            <div className="card h-100 shadow-sm">
                                <img
                                    src={buildImgSrc(doc.image)}
                                    className="doctor-card-img"
                                    alt={doc.doctorName}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{doc.doctorName}</h5>
                                    <p className="card-text mb-1">
                                        {doc.Position?.name || 'N/A'} | {doc.Degree?.name || 'N/A'}
                                    </p>
                                    <p className="card-text mb-2">
                                        <strong>Chuyên khoa:</strong> {doc.Specialty?.name || 'N/A'}
                                    </p>
                                    <div className="d-flex justify-content-between">
                                        <button
                                            className="btn btn-success btn-sm"
                                            onClick={() => history.push(`/booking/${doc.id}`)}
                                        >
                                            Đặt lịch
                                        </button>
                                        <button
                                            className="btn btn-outline-secondary btn-sm"
                                            onClick={() => history.push(`/doctor/detail/${doc.id}`)}
                                        >
                                            Chi tiết
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>

                <div className="text-center mt-3">
                    <button className="btn btn-outline-dark" onClick={() => history.push('/doctor')}>
                        Xem tất cả
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DoctorDetailPage;
