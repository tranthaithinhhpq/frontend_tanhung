import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../../../setup/axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';

const buildImgSrc = (raw) => {
    if (!raw) return '';
    if (raw.startsWith('http')) return raw;
    return `${BACKEND_URL}${raw}`;
};

const DoctorDetailPage = () => {
    const { userId } = useParams();
    const [doctor, setDoctor] = useState(null);

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const res = await axios.get(`/api/v1/doctor/detail/${userId}`);
                if (res.EC === 0) {
                    setDoctor(res.DT);
                } else {
                    toast.error(res.EM);
                }
            } catch (err) {
                console.error("Error fetching doctor detail", err);
                toast.error("Lỗi tải thông tin bác sĩ");
            }
        };

        fetchDoctor();
    }, [userId]);

    if (!doctor) return <div>Loading...</div>;

    const info = doctor.DoctorInfo || {};
    return (
        <div className="container py-4">
            <h1>{doctor.username}</h1>
            <img
                src={buildImgSrc(doctor.image)}
                alt="Doctor"
                style={{ maxWidth: '300px', height: 'auto', objectFit: 'contain' }}
            />
            <p><strong>Chuyên khoa:</strong> {info.Specialty?.name || 'N/A'}</p>
            <p><strong>Chức vụ:</strong> {info.Position?.name || 'N/A'}</p>
            <p><strong>Học vị:</strong> {info.Degree?.name || 'N/A'}</p>
            <div>
                <strong>Giới thiệu:</strong>
                <div dangerouslySetInnerHTML={{ __html: info.markdownContent || 'Không có nội dung' }} />
            </div>
        </div>
    );
};

export default DoctorDetailPage;
