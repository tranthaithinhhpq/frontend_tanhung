// import React from 'react';
// import './Footer.scss';
// import { FaMapMarkerAlt } from 'react-icons/fa';

// const Footer = () => {
//     return (
//         <footer className="footer text-white">
//             <div className="container py-5">
//                 <div className="row">
//                     {/* Cột 1 */}
//                     <div className="col-md-3 footer-column">
//                         <h5 className="footer-title">Liên kết nhanh</h5>
//                         <ul className="list-unstyled">
//                             <li>Trang chủ</li>
//                             <li>Giới thiệu</li>
//                             <li>Chuyên khoa</li>
//                             <li>Đội ngũ bác sĩ</li>
//                             <li>Trang thiết bị</li>
//                             <li>Liên hệ</li>
//                         </ul>
//                     </div>

//                     {/* Cột 2 */}
//                     <div className="col-md-3 footer-column">
//                         <h5 className="footer-title">Dịch vụ và hỗ trợ</h5>
//                         <ul className="list-unstyled">
//                             <li>Tra cứu thuốc</li>
//                             <li>Đặt lịch khám</li>
//                             <li>Hướng dẫn khách hàng</li>
//                             <li>Khảo sát mức độ hài lòng</li>
//                             <li>Tra cứu kết quả xét nghiệm</li>
//                             <li>Bảng giá dịch vụ</li>
//                         </ul>
//                     </div>

//                     {/* Cột 3 */}
//                     <div className="col-md-3 footer-column">
//                         <h5 className="footer-title">Thông tin liên hệ</h5>
//                         <p>Hotline: (028) 377 606 48<br />
//                             Cấp cứu: (028) 377 606 48</p>
//                         <h6 className="mt-3 footer-title">Giờ làm việc</h6>
//                         <p className="mb-0">
//                             Từ thứ 2 đến thứ 6<br />
//                             Buổi sáng: 07:00 - 12:00<br />
//                             Buổi chiều: 13:00 - 16:30<br />
//                             Thứ 7<br />
//                             Buổi sáng: 07:00 - 12:00<br />
//                             Cấp cứu: 24/7
//                         </p>
//                     </div>

//                     {/* Cột 4 - Google Map */}
//                     <div className="col-md-3 footer-column">
//                         <h5 className="footer-title">Đường đến bệnh viện đa khoa Tân Hưng</h5>
//                         <iframe
//                             title="map"
//                             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.7497603133666!2d106.70672607590614!3d10.752471259633652!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f1557b29ab7%3A0xd0377fc0e489146c!2zODcxIMSQLiBUcuG6p24gWHXDom4gU8OgbiwgUGjGsOG7nW5nIDcsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCwgVmlldG5hbQ!5e0!3m2!1svi!2s!4v1721253000000!5m2!1svi!2s"
//                             width="100%"
//                             height="200"
//                             style={{ border: 0 }}
//                             allowFullScreen=""
//                             loading="lazy"
//                             referrerPolicy="no-referrer-when-downgrade"
//                         ></iframe>
//                     </div>
//                 </div>
//             </div>

//             {/* Chân trang */}
//             <div className="footer-bottom text-dark">
//                 <FaMapMarkerAlt className="me-2" />
//                 871 Trần Xuân Soạn - P. Tân Hưng - Quận 7 - Tp. Hồ Chí Minh
//             </div>
//         </footer>
//     );
// };

// export default Footer;


import React from 'react';
import './Footer.scss';
import { FaMapMarkerAlt, FaPhone, FaAmbulance, FaFacebookMessenger } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="footer text-white position-relative" style={{ backgroundColor: '#343a40' }}>
            <div className="container py-5">
                <div className="row">
                    {/* Cột 1 */}
                    <div className="col-md-3 footer-column">
                        <h5 className="footer-title">Liên kết nhanh</h5>
                        <ul className="list-unstyled">
                            <li>Trang chủ</li>
                            <li>Giới thiệu</li>
                            <li>Chuyên khoa</li>
                            <li>Đội ngũ bác sĩ</li>
                            <li>Trang thiết bị</li>
                            <li>Liên hệ</li>
                        </ul>
                    </div>

                    {/* Cột 2 */}
                    <div className="col-md-3 footer-column">
                        <h5 className="footer-title">Dịch vụ và hỗ trợ</h5>
                        <ul className="list-unstyled">
                            <li>Tra cứu thuốc</li>
                            <li>Đặt lịch khám</li>
                            <li>Hướng dẫn khách hàng</li>
                            <li>Khảo sát mức độ hài lòng</li>
                            <li>Tra cứu kết quả xét nghiệm</li>
                            <li>Bảng giá dịch vụ</li>
                        </ul>
                    </div>

                    {/* Cột 3 */}
                    <div className="col-md-3 footer-column">
                        <h5 className="footer-title">Thông tin liên hệ</h5>
                        <p>
                            <FaPhone className="me-2 text-success" /> Tổng đài: (028) 377 606 48<br />
                            <FaAmbulance className="me-2 text-success" /> Cấp cứu: 0901 34 69 34
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
                        871 Trần Xuân Soạn - P. Tân Hưng - Quận 7 - Tp. Hồ Chí Minh
                    </div>

                    {/* Tổng đài + cấp cứu bên phải */}
                    <div className="d-flex align-items-center gap-4">
                        <div className="d-flex align-items-center">
                            <i className="fa fa-ambulance me-2" aria-hidden="true"></i>
                            Cấp cứu: 321654987
                        </div>
                        <div className="d-flex align-items-center">
                            <i className="fa fa-phone me-2" aria-hidden="true"></i>
                            Tổng đài: 0123654987
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
