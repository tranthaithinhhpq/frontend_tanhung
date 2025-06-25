import React, { useEffect, useState, useContext } from 'react';
import './Nav.scss';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { Navbar } from 'react-bootstrap';
import logo from '../../../logo.png';
import { logoutUser } from '../../../services/userService';
import { toast } from 'react-toastify';
import { UserContext } from '../../../context/UserContext';


const NavHeaderClient = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const { user, logoutContext } = useContext(UserContext);
    const location = useLocation();
    const history = useHistory();

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);





    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark custom-navbar">
            <div className="container-fluid">
                <Link className="navbar-brand fw-bold logo" to="/">
                    <Navbar.Brand as={Link} to="/">
                        <img src={logo} width="30" height="30" alt="React logo" />
                    </Navbar.Brand>
                </Link>

                {/* Ẩn brand chữ nếu kích thước 992–1200 */}
                {!(windowWidth >= 992 && windowWidth <= 1200) && (
                    <Link to="/" className="brand-link ms-1 me-1">
                        <div className="brand-text">
                            <span className="brand-name-1">Bệnh viện Đa Khoa Tân Hưng</span>
                            <span className="brand-name-2">Tan Hung General Hospital</span>
                        </div>
                    </Link>
                )}

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mx-auto mb-2 mb-lg-0">

                        {/* Dropdown: Giới thiệu */}
                        <li className="nav-item dropdown">
                            <div className="d-flex align-items-center gap-0">
                                <Link className="nav-link" to="/gioi-thieu">Giới thiệu</Link>
                                <a className="nav-link dropdown-toggle dropdown-toggle-split ps-0" data-bs-toggle="dropdown">
                                    <span className="visually-hidden">Toggle Dropdown</span>
                                </a>
                            </div>
                            <ul className="dropdown-menu">
                                <li><Link className="dropdown-item" to="/tam-nhin">Tầm nhìn & Sứ mệnh</Link></li>
                                <li><Link className="dropdown-item" to="/doctor">Đội ngũ bác sĩ</Link></li>
                                <li><Link className="dropdown-item" to="/chuyen-khoa">Chuyên khoa</Link></li>
                                <li><Link className="dropdown-item" to="/trang-thiet-bi">Trang thiết bị</Link></li>
                                <li><Link className="dropdown-item" to="/so-do-to-chuc">Sơ đồ tổ chức</Link></li>
                            </ul>
                        </li>

                        {/* Dropdown: Khách hàng */}
                        <li className="nav-item dropdown">
                            <div className="d-flex align-items-center gap-0">
                                <Link className="nav-link" to="/gioi-thieu">Khách hàng</Link>
                                <a className="nav-link dropdown-toggle dropdown-toggle-split ps-0" data-bs-toggle="dropdown">
                                    <span className="visually-hidden">Toggle Dropdown</span>
                                </a>
                            </div>
                            <ul className="dropdown-menu">
                                <li><Link className="dropdown-item" to="/tam-nhin">Hướng dẫn</Link></li>
                                <li><Link className="dropdown-item" to="/doi-ngu-bac-si">Khảo sát mức độ hài lòng</Link></li>
                                <li><Link className="dropdown-item" to="/chuyen-khoa">Tư vấn hỏi đáp</Link></li>
                            </ul>
                        </li>

                        {/* Dropdown: Tin tức */}
                        <li className="nav-item dropdown">
                            <div className="d-flex align-items-center gap-0">
                                <Link className="nav-link" to="/gioi-thieu">Tin tức</Link>
                                <a className="nav-link dropdown-toggle dropdown-toggle-split ps-0" data-bs-toggle="dropdown">
                                    <span className="visually-hidden">Toggle Dropdown</span>
                                </a>
                            </div>
                            <ul className="dropdown-menu">
                                <li><Link className="dropdown-item" to="/tam-nhin">Tin tức & Sự kiện</Link></li>
                                <li><Link className="dropdown-item" to="/doi-ngu-bac-si">Thông báo</Link></li>
                                <li><Link className="dropdown-item" to="/chuyen-khoa">Hoạt động</Link></li>
                                <li><Link className="dropdown-item" to="/chuyen-khoa">Các bệnh</Link></li>
                                <li><Link className="dropdown-item" to="/chuyen-khoa">Hướng dẫn dùng thuốc</Link></li>
                            </ul>
                        </li>

                        {/* Đặt lịch khám */}
                        <li className="nav-item">
                            <Link className="nav-link" to="/link">Đặt lịch khám</Link>
                        </li>

                        {/* Dropdown: Tuyển dụng */}
                        <li className="nav-item dropdown">
                            <div className="d-flex align-items-center gap-0">
                                <Link className="nav-link" to="/gioi-thieu">Tuyển dụng</Link>
                                <a className="nav-link dropdown-toggle dropdown-toggle-split ps-0" data-bs-toggle="dropdown">
                                    <span className="visually-hidden">Toggle Dropdown</span>
                                </a>
                            </div>
                            <ul className="dropdown-menu">
                                <li><Link className="dropdown-item" to="/tam-nhin">Thông tin tuyển dụng</Link></li>
                                <li><Link className="dropdown-item" to="/doi-ngu-bac-si">Đăng ký tuyển dụng</Link></li>
                            </ul>
                        </li>

                        {/* Dropdown: Bảng giá */}
                        <li className="nav-item dropdown">
                            <div className="d-flex align-items-center gap-0">
                                <Link className="nav-link" to="/gioi-thieu">Bảng giá</Link>
                                <a className="nav-link dropdown-toggle dropdown-toggle-split ps-0" data-bs-toggle="dropdown">
                                    <span className="visually-hidden">Toggle Dropdown</span>
                                </a>
                            </div>
                            <ul className="dropdown-menu">
                                <li><Link className="dropdown-item" to="/tam-nhin">Hướng dẫn</Link></li>
                                <li><Link className="dropdown-item" to="/doi-ngu-bac-si">Khảo sát mức độ hài lòng</Link></li>
                                <li><Link className="dropdown-item" to="/chuyen-khoa">Tư vấn hỏi đáp</Link></li>
                            </ul>
                        </li>
                    </ul>

                    <form className="d-flex">
                        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                        <button className="btn btn-outline-light" type="submit">Search</button>
                    </form>
                </div>
            </div>
        </nav>
    );
};

export default NavHeaderClient;
