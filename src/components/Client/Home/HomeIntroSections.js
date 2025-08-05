import React, { useEffect, useState } from 'react';
import axios from '../../../setup/axios';
import { Button } from 'react-bootstrap';
import './Home.scss';

const HomeIntroSections = () => {
    const [sections, setSections] = useState({});

    useEffect(() => {
        const fetchTextSections = async () => {
            try {
                const res = await axios.get('/api/v1/client/home-sections');
                if (res.EC === 0) {
                    setSections(prev => ({ ...prev, ...res.DT }));
                }
            } catch (err) {
                console.error('Lỗi lấy dữ liệu văn bản:', err);
            }
        };

        const fetchImageSections = async () => {
            try {
                const res = await axios.get('/api/v1/client/home-sections-img');
                if (res.EC === 0) {
                    setSections(prev => ({ ...prev, ...res.DT }));
                }
            } catch (err) {
                console.error('Lỗi lấy dữ liệu ảnh:', err);
            }
        };

        fetchTextSections();
        fetchImageSections();
    }, []);

    const getImage = (sec) => {
        const raw = sections[sec]?.[0]?.image;
        if (!raw) return '/default.jpg';
        return `${process.env.REACT_APP_BACKEND_URL}${raw.startsWith('/') ? raw : '/' + raw}`;
    };

    return (
        <div className="home-intro container my-5">
            {/* SHOT 1 */}
            <div className="intro-block shot-1 row align-items-center my-4">
                <div className="text col-md-6 p-4">
                    <h2>{sections["home-title-1"]?.[0]?.contentText || "Tiêu đề 1 mặc định"}</h2>
                    <p>{sections["home-content-1"]?.[0]?.contentText || "Nội dung 1 mặc định"}</p>
                    <Button variant="outline-dark">Xem thêm</Button>
                </div>
                <div className="image col-md-6 text-center">
                    <img
                        src={getImage('shot_1')}
                        alt="Hướng dẫn khách hàng"
                        className="img-fluid rounded shadow"
                        style={{ maxHeight: '400px', objectFit: 'cover' }}
                    />
                </div>
            </div>

            {/* SHOT 2 */}
            <div className="intro-block shot-2 row align-items-center flex-md-row-reverse my-4">
                <div className="text col-md-6 p-4">
                    <h2>{sections["home-title-2"]?.[0]?.contentText || "Tiêu đề 2 mặc định"}</h2>
                    <p>{sections["home-content-2"]?.[0]?.contentText || "Nội dung 2 mặc định"}</p>
                    <Button variant="outline-dark">Xem thêm</Button>
                </div>
                <div className="image col-md-6 text-center">
                    <img
                        src={getImage('shot_2')}
                        alt="Giới thiệu bệnh viện"
                        className="img-fluid rounded shadow"
                        style={{ maxHeight: '400px', objectFit: 'cover' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default HomeIntroSections;
