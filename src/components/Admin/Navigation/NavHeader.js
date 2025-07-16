// NavHeader.js – rewrite theo "Cách 1" (dùng 1 thẻ a.nav-link.dropdown-toggle cho mục cha)
// ----------------------------------------------------------------------------------

import React, { useEffect, useState, useContext } from 'react';
import '../../Client/Navigation/Nav.scss';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import logo from '../../../logo.png';
import { logoutUser } from '../../../services/userService';
import { toast } from 'react-toastify';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

const NavHeader = () => {
    const { user, logoutContext } = useContext(UserContext);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const location = useLocation();
    const history = useHistory();

    // Handle window resize for brand text visibility
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Logout handler
    const handleLogout = async () => {
        const data = await logoutUser();
        localStorage.removeItem('jwt');
        logoutContext();

        if (data && +data.EC === 0) {
            toast.success('Log out succeeds...');
            history.push('/admin/login');
        } else {
            toast.error(data.EM);
        }
    };

    // Hide entire nav on /admin/login
    if (!user?.isAuthenticated || location.pathname === '/admin/login') return null;

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark custom-navbar">
            <div className="container-fluid">
                {/* Logo */}
                <Link className="navbar-brand fw-bold logo" to="/">
                    <Navbar.Brand as={Link} to="/">
                        <img src={logo} width="30" height="30" alt="React logo" />
                    </Navbar.Brand>
                </Link>

                {/* Brand text (ẩn 992–1200) */}
                {!(windowWidth >= 992 && windowWidth <= 1200) && (
                    <Link to="/" className="brand-link ms-1 me-1">
                        <div className="brand-text">
                            <span className="brand-name-1">Bệnh viện Đa Khoa Tân Hưng</span>
                            <span className="brand-name-2">Tan Hung General Hospital</span>
                        </div>
                    </Link>
                )}

                {/* Toggler */}
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
                        {/* === Giới thiệu === */}
                        <li className="nav-item dropdown">
                            <a
                                href="#" // không điều hướng
                                className="nav-link dropdown-toggle"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Nội bộ
                            </a>
                            <ul className="dropdown-menu">
                                <li><Link className="dropdown-item" to="/admin/page-image">Web Image</Link></li>
                                <li><Link className="dropdown-item" to="/admin/banner">Banner</Link></li>
                                <li><Link className="dropdown-item" to="/admin/users">User</Link></li>
                                <li><Link className="dropdown-item" to="/admin/doctor">Đội ngũ bác sĩ</Link></li>
                                <li><Link className="dropdown-item" to="/admin/doctor-day-off">Lịch bác sĩ</Link></li>
                                <li><Link className="dropdown-item" to="/admin/device">Trang thiết bị</Link></li>
                                <li><Link className="dropdown-item" to="/admin/roles">Role</Link></li>
                                <li><Link className="dropdown-item" to="/admin/group-role">GroupRole</Link></li>
                                <li><Link className="dropdown-item" to="/admin/specialty">Chuyên khoa</Link></li>

                            </ul>
                        </li>

                        {/* === Khách hàng === */}
                        <li className="nav-item dropdown">
                            <a
                                href="#"
                                className="nav-link dropdown-toggle"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Khách hàng
                            </a>
                            <ul className="dropdown-menu">
                                <li><Link className="dropdown-item" to="/tam-nhin">Hướng dẫn</Link></li>
                                <li><Link className="dropdown-item" to="/doi-ngu-bac-si">Khảo sát mức độ hài lòng</Link></li>
                                <li><Link className="dropdown-item" to="/chuyen-khoa">Tư vấn hỏi đáp</Link></li>
                            </ul>
                        </li>

                        {/* === Tin tức === */}
                        <li className="nav-item dropdown">
                            <a
                                href="#"
                                className="nav-link dropdown-toggle"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Tin tức
                            </a>
                            <ul className="dropdown-menu">
                                <li><Link className="dropdown-item" to="/admin/news">Tin tức & Sự kiện</Link></li>
                                <li><Link className="dropdown-item" to="/doi-ngu-bac-si">Thông báo</Link></li>
                                <li><Link className="dropdown-item" to="/chuyen-khoa">Hoạt động</Link></li>
                                <li><Link className="dropdown-item" to="/chuyen-khoa">Các bệnh</Link></li>
                                <li><Link className="dropdown-item" to="/chuyen-khoa">Hướng dẫn dùng thuốc</Link></li>
                            </ul>
                        </li>

                        {/* === Đặt lịch khám (link đơn) === */}
                        <li className="nav-item">
                            <Link className="nav-link" to="/admin/booking">Đặt lịch khám</Link>
                        </li>

                        {/* === Tuyển dụng === */}
                        <li className="nav-item dropdown">
                            <a
                                href="#"
                                className="nav-link dropdown-toggle"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Tuyển dụng
                            </a>
                            <ul className="dropdown-menu">
                                <li><Link className="dropdown-item" to="/tam-nhin">Thông tin tuyển dụng</Link></li>
                                <li><Link className="dropdown-item" to="/doi-ngu-bac-si">Đăng ký tuyển dụng</Link></li>
                            </ul>
                        </li>

                        {/* === Bảng giá === */}
                        <li className="nav-item dropdown">
                            <a
                                href="#"
                                className="nav-link dropdown-toggle"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Bảng giá
                            </a>
                            <ul className="dropdown-menu">
                                <li><Link className="dropdown-item" to="/admin/service-price">Bảng giá dịch vụ</Link></li>
                                <li><Link className="dropdown-item" to="/admin/drug-price">Bảng giá thuốc</Link></li>
                                <li><Link className="dropdown-item" to="/chuyen-khoa">Tư vấn hỏi đáp</Link></li>
                            </ul>
                        </li>
                    </ul>

                    {/* Right side – user info */}
                    <Nav>
                        {user?.isAuthenticated ? (
                            <>
                                <Nav.Item className="nav-link">
                                    <span>Welcome {user.account.username}!</span>
                                </Nav.Item>

                                <NavDropdown title="Settings" id="basic-nav-dropdown" className="no-hover">
                                    <NavDropdown.Item>Change Password</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item as="span" onClick={handleLogout} style={{ cursor: 'pointer' }}>
                                        Log out
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </>
                        ) : (
                            <Link className="nav-link" to="/admin/login">
                                Login
                            </Link>
                        )}
                    </Nav>
                </div>
            </div>
        </nav>
    );
};

export default NavHeader;
