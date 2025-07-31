import React, { useEffect, useState } from 'react';
import './Footer.scss';
import axios from '../../../setup/axios';
import { FaMapMarkerAlt, FaPhone, FaAmbulance, FaFacebookMessenger } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
    const [topbarContent, setTopbarContent] = useState({ phone: '', emergency: '', address: '' });
    useEffect(() => {
        const fetchTopbar = async () => {
            try {
                const res = await axios.get('/api/v1/page-text-content/topbar');
                if (res.EC === 0) {
                    const content = { phone: '', emergency: '', address: '' };
                    res.DT.forEach(item => {
                        if (item.section === 'phone') content.phone = item.title;
                        if (item.section === 'emergency_number') content.emergency = item.title;
                        if (item.section === 'address') content.address = item.title;
                    });
                    setTopbarContent(content);
                }
            } catch (err) {
                console.error("Lỗi fetch topbar content:", err);
            }
        };
        fetchTopbar();
    }, []);
    return (
        <footer className="footer text-white position-relative" style={{ backgroundColor: '#343a40' }}>
            <div className="container py-5">
                <div className="row">
                    {/* Cột 1 */}
                    <div className="col-md-3 footer-column">
                        <h5 className="footer-title">Liên kết nhanh</h5>
                        <ul className="list-unstyled">
                            <li>
                                <Link to="/">Trang chủ</Link>
                            </li>
                            <li>
                                <Link to="/specialties">Chuyên khoa</Link>
                            </li>
                            <li>
                                <Link to="/doctors">Đội ngũ bác sĩ</Link>
                            </li>
                            <li>
                                <Link to="/devices">Trang thiết bị</Link>
                            </li>
                            <li>
                                <Link to="/question">Hỏi & đáp</Link>
                            </li>

                        </ul>
                    </div>

                    {/* Cột 2 */}
                    <div className="col-md-3 footer-column">
                        <h5 className="footer-title">Dịch vụ và hỗ trợ</h5>
                        <ul className="list-unstyled">
                            <li>
                                <Link to="/drug-prices">Bảng giá thuốc</Link>
                            </li>
                            <li>
                                <Link to="/service-prices">Bảng giá dịch vụ</Link>
                            </li>
                            <li>
                                <Link to="/booking">Đặt lịch khám</Link>
                            </li>

                        </ul>
                    </div>

                    {/* Cột 3 */}
                    <div className="col-md-3 footer-column">
                        <h5 className="footer-title">Thông tin liên hệ</h5>
                        <p>
                            <FaPhone className="me-2 text-success" />{topbarContent.phone || '(028) 377 606 48'}<br />
                            <FaAmbulance className="me-2 text-success" />{topbarContent.emergency || '0901 34 69 34'}
                        </p>
                        <h6 className="mt-3 footer-title">Giờ làm việc</h6>
                        <p className="mb-0">
                            Từ thứ 2 đến thứ 6<br />
                            Sáng: 07:00 - 12:00<br />
                            Chiều: 13:00 - 16:30<br />
                            Thứ 7: Sáng 07:00 - 12:00<br />
                            Cấp cứu: 24/7
                        </p>
                    </div>

                    {/* Cột 4 - Google Map */}
                    <div className="col-md-3 footer-column">
                        <h5 className="footer-title">Đường đến Bệnh viện</h5>
                        <iframe
                            title="map"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.7497603133666!2d106.70672607590614!3d10.752471259633652!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f1557b29ab7%3A0xd0377fc0e489146c!2zODcxIMSQLiBUcuG6p24gWHXDom4gU8OgbiwgUGjGsOG7nW5nIDcsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCwgVmlldG5hbQ!5e0!3m2!1svi!2s!4v1721253000000!5m2!1svi!2s"
                            width="100%"
                            height="200"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </div>

            {/* Chân trang */}
            <div className="footer-bottom py-3 text-light" style={{ backgroundColor: '#222' }}>
                <div className="container d-flex justify-content-between align-items-center flex-wrap" style={{ fontSize: '14px' }}>
                    {/* Địa chỉ bên trái */}
                    <div className="d-flex align-items-center">
                        <FaMapMarkerAlt className="me-2" />
                        {topbarContent.address?.trim() ? topbarContent.address : "871 Trần Xuân Soạn - P. Tân Hưng - Quận 7 - Tp. Hồ Chí Minh"}
                    </div>

                    {/* Tổng đài + cấp cứu bên phải */}
                    <div className="d-flex align-items-center gap-4">
                        <div className="d-flex align-items-center">
                            <i className="fa fa-ambulance me-2" aria-hidden="true"></i>
                            Cấp cứu: {topbarContent.emergency || '0901 34 69 34'}
                        </div>
                        <div className="d-flex align-items-center">
                            <i className="fa fa-phone me-2" aria-hidden="true"></i>
                            Tổng đài: {topbarContent.phone || '(028) 377 606 48'}

                        </div>
                    </div>
                </div>
            </div>


            {/* Nút Facebook nổi */}
            <a
                href="https://www.facebook.com/benhvientanhung"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    position: 'fixed',
                    bottom: '80px',
                    right: '10px',
                    backgroundColor: '#1877f2',
                    color: '#fff',
                    padding: '10px',
                    borderRadius: '50%',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
                    zIndex: 1000
                }}
            >
                <FaFacebookMessenger size={20} />
            </a>
        </footer>
    );
};

export default Footer;
