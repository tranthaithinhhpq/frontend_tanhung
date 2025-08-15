import React, { useEffect, useState, useContext } from 'react';
import '../../Client/Navigation/Nav.scss';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import fallbackLogo from '../../../logo.png';
import { logoutUser } from '../../../services/userService';
import { toast } from 'react-toastify';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import axios from '../../../setup/axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';

const NavHeader = () => {
    const { user, logoutContext } = useContext(UserContext);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const location = useLocation();
    const history = useHistory();
    const [logoImg, setLogoImg] = useState(null);

    useEffect(() => {
        const fetchLogo = async () => {
            try {
                const res = await axios.get('/api/v1/client/logo?section=logo');
                if (res.EC === 0 && res.DT?.image) {
                    setLogoImg(`${BACKEND_URL}${res.DT.image}`);
                } else {
                    setLogoImg(fallbackLogo);
                }
            } catch (err) {
                console.error('Error fetching logo:', err);
                setLogoImg(fallbackLogo);
            }
        };

        fetchLogo();
    }, []);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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

    if (!user?.isAuthenticated || location.pathname === '/admin/login') return null;

    return (
        <nav
            className="navbar navbar-expand-lg navbar-light bg-white custom-navbar"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                zIndex: 9999,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
        >
            <div className="container-fluid">
                <Link className="navbar-brand fw-bold logo" to="/">
                    <Navbar.Brand as={Link} to="/admin">
                        <img src={logoImg || fallbackLogo} width="30" height="30" alt="Logo" />
                    </Navbar.Brand>
                </Link>

                {!(windowWidth >= 992 && windowWidth <= 1200) && (
                    <Link to="/admin" className="brand-link ms-1 me-1">
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
                        <li className="nav-item dropdown">
                            <a href="#" className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Tài khoản & Phân quyền
                            </a>
                            <ul className="dropdown-menu">
                                <li><Link className="dropdown-item" to="/admin/users">Tài khoản</Link></li>
                                <li><Link className="dropdown-item" to="/admin/roles">Danh sách quyền</Link></li>
                                <li><Link className="dropdown-item" to="/admin/group-role">Phân quyền</Link></li>
                            </ul>
                        </li>

                        <li className="nav-item dropdown">
                            <a href="#" className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Bác sĩ
                            </a>
                            <ul className="dropdown-menu">
                                <li><Link className="dropdown-item" to="/admin/doctor">Đội ngũ bác sĩ</Link></li>
                                <li><Link className="dropdown-item" to="/admin/degree">Học vị</Link></li>
                                <li><Link className="dropdown-item" to="/admin/position">Vị trí</Link></li>
                            </ul>
                        </li>

                        <li className="nav-item dropdown">
                            <a href="#" className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Quản lý Lịch
                            </a>
                            <ul className="dropdown-menu">
                                <li><Link className="dropdown-item" to="/admin/working-slot-template">Lịch làm việc bác sĩ</Link></li>
                                <li><Link className="dropdown-item" to="/admin/doctor-day-off">Lịch nghỉ bác sĩ</Link></li>
                                <li><Link className="dropdown-item" to="/admin/booking">Đặt lịch khám</Link></li>
                            </ul>
                        </li>

                        <li className="nav-item dropdown">
                            <a href="#" className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Nội dung
                            </a>
                            <ul className="dropdown-menu">
                                <li><Link className="dropdown-item" to="/admin/news">Tin tức</Link></li>
                                <li><Link className="dropdown-item" to="/admin/news-categories">Loại tin</Link></li>
                                <li><Link className="dropdown-item" to="/admin/page">Quản lý trang</Link></li>
                                <li><Link className="dropdown-item" to="/admin/page-image">Web Image</Link></li>
                                <li><Link className="dropdown-item" to="/admin/pagetext">Web text</Link></li>
                                <li><Link className="dropdown-item" to="/admin/page-video-content">Web video</Link></li>
                                <li><Link className="dropdown-item" to="/admin/banner">Banner</Link></li>
                                <li><Link className="dropdown-item" to="/admin/image-manager">Kho ảnh</Link></li>
                            </ul>
                        </li>

                        <li className="nav-item dropdown">
                            <a href="#" className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Dịch vụ
                            </a>
                            <ul className="dropdown-menu">
                                <li><Link className="dropdown-item" to="/admin/service-price">Bảng giá dịch vụ</Link></li>
                                <li><Link className="dropdown-item" to="/admin/drug-price">Bảng giá thuốc</Link></li>
                                <li><Link className="dropdown-item" to="/admin/question">Tư vấn hỏi đáp</Link></li>
                            </ul>
                        </li>

                        <li className="nav-item dropdown">
                            <a href="#" className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Bệnh viện
                            </a>
                            <ul className="dropdown-menu">
                                <li><Link className="dropdown-item" to="/admin/device">Trang thiết bị</Link></li>
                                <li><Link className="dropdown-item" to="/admin/specialty">Chuyên khoa</Link></li>
                            </ul>
                        </li>
                    </ul>

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

