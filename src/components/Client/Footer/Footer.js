import React, { useEffect, useState } from 'react';
import './Footer.scss';
import axios from '../../../setup/axios';
import { FaMapMarkerAlt, FaPhone, FaAmbulance, FaFacebookMessenger } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import zlt from '../../../zlt.png';

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
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.5643973528265!2d106.6963562!3d10.7512252!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f0952bc150f%3A0xb0b097cad42d2a08!2zQuG6o25oIHZp4buHbiDEkGEga2hvYSBUw6JuIEjGsG5n!5e0!3m2!1svi!2s!4v1692096000000!5m2!1svi!2s"
                            width="100%"
                            height="250"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Bản đồ Bệnh viện Đa khoa Tân Hưng"
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






        </footer>
    );
};

export default Footer;
