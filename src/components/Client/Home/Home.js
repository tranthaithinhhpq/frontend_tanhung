import React, { useEffect, useState } from 'react';
import axios from '../../../setup/axios';
import './Home.scss';
import 'bootstrap-icons/font/bootstrap-icons.css';

const HomeClient = () => {
    const [banners, setBanners] = useState([]);
    const [current, setCurrent] = useState(0);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1200);
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';

    useEffect(() => {
        axios.get('/api/v1/client/banner').then(res => {
            if (res.EC === 0) setBanners(res.DT || []);
        });
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent(prev => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [banners]);

    // 🛠 Theo dõi thay đổi kích thước màn hình
    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth > 1200);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handlePrev = () => setCurrent((current - 1 + banners.length) % banners.length);
    const handleNext = () => setCurrent((current + 1) % banners.length);
    const goToSlide = (index) => setCurrent(index);

    if (!banners.length) return null;

    return (
        <>
            <div className="banner-slider">
                <button className="arrow left" onClick={handlePrev}>&#10094;</button>

                <div className="banner-wrapper">
                    {banners.map((item, index) => {
                        const src = BACKEND_URL + (isDesktop ? item.imageDesktop : item.imagePhone);
                        return (
                            <img
                                key={item.id}
                                src={src}
                                alt={item.title}
                                className={`banner-img ${index === current ? 'active' : ''}`}
                            />
                        );
                    })}
                </div>

                <button className="arrow right" onClick={handleNext}>&#10095;</button>

                <div className="dot-indicators">
                    {banners.map((_, index) => (
                        <span
                            key={index}
                            className={`dot ${index === current ? 'active' : ''}`}
                            onClick={() => goToSlide(index)}
                        ></span>
                    ))}
                </div>
            </div>
            <div className="container my-4">
                <div className="row g-4">
                    <div className="col-12 col-sm-12 col-md-6 col-xl-3 service-card">
                        <div className="card h-100 text-center p-3">
                            <div className='icon'>
                                <i className="bi bi-person-badge fs-1 mb-2 icon doctor"></i>
                            </div>
                            <h5>Bác sĩ</h5>
                            <p className="small">Tìm hiểu thông tin bác sĩ chuyên khoa, kinh nghiệm, và lịch làm việc.</p>
                        </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-6 col-xl-3 service-card">
                        <div className="card h-100 text-center p-3">
                            <div className='icon'>
                                <i className="bi bi-calendar-check fs-1 mb-2 icon booking"></i>
                            </div>
                            <h5>Đặt lịch khám</h5>


                            <p className="small">Chủ động chọn ngày khám, bác sĩ và chuyên khoa bạn cần.</p>
                        </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-6 col-xl-3 service-card">
                        <div className="card h-100 text-center p-3">
                            <div className='icon'>
                                <i className="bi bi-hospital fs-1 mb-2 specialty"></i>
                            </div>

                            <h5>Chuyên khoa</h5>
                            <p className="small">Hệ thống chuyên khoa toàn diện, chất lượng cao.</p>
                        </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-6 col-xl-3 service-card">
                        <div className="card h-100 text-center p-3">
                            <div className='icon'><i className="bi bi-receipt fs-1 mb-2 price"></i></div>

                            <h5>Bảng giá</h5>
                            <p className="small">Tra cứu chi phí khám chữa bệnh rõ ràng, minh bạch.</p>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default HomeClient;
