





import React, { useState } from 'react';
import './NavHeader.scss';
import { FaFacebookF, FaTiktok, FaYoutube, FaInstagram, FaBuilding, FaPhone, FaChevronDown } from 'react-icons/fa';


const NavHeaderClient = () => {
    const [activeMenu, setActiveMenu] = useState(null);

    const toggleDropdown = (menu) => {
        setActiveMenu(activeMenu === menu ? null : menu);
    };

    return (
        <div className="navbar-wrapper">
            {/* Top bar */}
            <div className="top-bar">
                <div className="left">
                    <span>Tìm hiểu thêm:</span>
                    <a href="#"><FaFacebookF /></a>
                    <a href="#"><FaTiktok /></a>
                    <a href="#"><FaYoutube /></a>
                    <a href="#"><FaInstagram /></a>
                    <a href="#" className="business-btn"><FaBuilding /> Doanh nghiệp</a>
                </div>
                <div className="right">
                    <a href="#">Điểm lấy mẫu</a>
                    <a href="#">Tra cứu kết quả</a>
                    <a href="#">Ứng dụng đối tác</a>
                    <a href="#"><FaPhone /> 19001717</a>
                    <a href="#">English</a>
                </div>
            </div>

            {/* Main Nav */}
            <nav className="main-nav">
                <div className="logo">+Diag</div>

                <ul className="nav-links">
                    <li onMouseEnter={() => toggleDropdown("xn")} onMouseLeave={() => toggleDropdown(null)}>
                        Xét nghiệm <span className="dropdown-icon"></span>
                        {activeMenu === "xn" && (
                            <ul className="dropdown">
                                <li>Huyết học</li>
                                <li>Sinh hóa</li>
                                <li>Vi sinh</li>
                            </ul>
                        )}
                    </li>

                    <li onMouseEnter={() => toggleDropdown("pk")} onMouseLeave={() => toggleDropdown(null)}>
                        Phòng khám <FaChevronDown />
                        {activeMenu === "pk" && (
                            <ul className="dropdown">
                                <li>Nội tổng quát</li>
                                <li>Nhi khoa</li>
                                <li>Da liễu</li>
                            </ul>
                        )}
                    </li>

                    <li>Lấy mẫu tại nhà</li>
                    <li>Tiêm chủng</li>
                    <li>Bảo hiểm</li>
                    <li>Khuyến mãi</li>
                    <li>Về DIAG</li>
                    <li>Blog <FaChevronDown /></li>
                    <li className="search-icon">🔍</li>
                </ul>
            </nav>
        </div>
    );
};

export default NavHeaderClient;





