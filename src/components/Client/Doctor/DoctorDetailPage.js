import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from '../../../setup/axios';
import { useParams, useHistory } from 'react-router-dom';
import './Doctor.scss';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';

const buildImgSrc = (raw) => {
    if (!raw) return '';
    if (raw.startsWith('http')) return raw;
    return `${BACKEND_URL}${raw}`;
};

const DoctorDetailPage = () => {
    const { doctorId } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [otherDoctors, setOtherDoctors] = useState([]);
    const history = useHistory();

    useEffect(() => {
        const fetchDoctor = async () => {
            if (!doctorId) {
                toast.error('Thiếu thông tin bác sĩ');
                return;
            }
            try {
                const res = await axios.get(`/api/v1/doctor/detail/${doctorId}`);
                if (res.EC === 0) {
                    setDoctor(res.DT);
                } else {
                    toast.error(res.EM || 'Không tìm thấy bác sĩ');
                }
            } catch (err) {
                console.error("Error fetching doctor detail", err);
                toast.error("Lỗi tải thông tin bác sĩ");
            }
        };

        const fetchOtherDoctors = async () => {
            try {
                const res = await axios.get(`/api/v1/doctor/others/${doctorId}`);
                if (res.EC === 0) {
                    setOtherDoctors(res.DT);
                }
            } catch (err) {
                console.error("Error fetching other doctors", err);
            }
        };

        fetchDoctor();
        fetchOtherDoctors();
    }, [doctorId]);

    useEffect(() => {
        setTimeout(() => {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
        }, 0);
    }, [doctorId]);

    if (!doctor) return <div className="text-center my-5">Loading...</div>;

    return (
        <div className="container doctor-detail-page">
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
                        <button className="btn btn-success">Đặt lịch khám</button>
                    </div>
                </div>
            </div>

            <div className="card p-4 shadow-sm mb-5">
                <div className="ql-editor" dangerouslySetInnerHTML={{ __html: doctor.markdownContent || 'Không có nội dung' }} />
            </div>

            <div>
                <h4>Bác sĩ khác</h4>
                <div className="row">
                    {otherDoctors.map(doc => (
                        <div className="col-md-3 mb-3" key={doc.id}>
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
                                        <button className="btn btn-success btn-sm">Đặt lịch khám</button>
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
                </div>
                <div className="text-center mt-3">
                    <button className="btn btn-outline-dark">Xem tất cả</button>
                </div>
            </div>
        </div>
    );
};

export default DoctorDetailPage;
