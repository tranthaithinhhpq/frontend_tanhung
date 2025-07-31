import React, { useEffect, useState } from 'react';
import axios from '../../../setup/axios';
import { Button } from 'react-bootstrap';
import './Home.scss';

const HomeIntroSections = () => {
    const [sections, setSections] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('/api/v1/client/home-sections');
                if (res.EC === 0) {
                    console.log("res dt shot: ", res.DT);
                    setSections(res.DT);
                }
            } catch (err) {
                console.error('Lỗi lấy dữ liệu section:', err);
            }
        };
        fetchData();
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
                    <h2>Hướng dẫn<br />Khách hàng</h2>
                    <p>Bạn cần khám chữa bệnh? Xem ngay hướng dẫn chi tiết từ đặt lịch, làm thủ tục đến thanh toán – đơn giản, nhanh chóng!</p>
                    <Button variant="outline-dark">Xem hướng dẫn</Button>
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
                    <h2>Giá trị cốt lõi<br />của bệnh viện</h2>
                    <p>
                        Bệnh viện Đa khoa Tân Hưng là nơi chăm sóc sức khỏe uy tín với đội ngũ bác sĩ giỏi, thiết bị hiện đại và dịch vụ tận tâm,
                        mang đến trải nghiệm khám chữa bệnh an toàn, chất lượng và chuyên nghiệp cho mọi khách hàng.
                    </p>
                    <Button variant="outline-dark">Xem giới thiệu</Button>
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
