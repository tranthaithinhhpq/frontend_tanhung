import React, { useEffect, useState, useContext } from 'react';
import './Nav.scss';
import { Link, NavLink, useLocation, useHistory } from 'react-router-dom';
import { UserContext } from "../../context/UserContext";
import { Navbar, Nav, NavDropdown, Container, Form, FormControl, Button } from 'react-bootstrap';
import logo from '../../logo.png';
import { logoutUser } from '../../services/userService';
import { toast } from 'react-toastify';



const NavHeader = (props) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    const { user, logoutContext } = useContext(UserContext);
    const [expanded, setExpanded] = useState(false);
    const location = useLocation();
    const history = useHistory();

    const isPublicPage = location.pathname === '/' || location.pathname === '/about';

    const handleLogout = async () => {
        let data = await logoutUser();
        localStorage.removeItem("jwt");
        logoutContext();

        if (data && +data.EC === 0) {
            toast.success('Log out succeeds...');
            history.push('/login');
        } else {
            toast.error(data.EM);
        }
    }

    if ((user && user.isAuthenticated === true) || isPublicPage) {
        if (location.pathname === '/login') return <></>;
        return (
            <>

                <nav className="navbar navbar-expand-lg navbar-dark bg-dark custom-navbar">
                    <div className="container-fluid">
                        <Link className="navbar-brand fw-bold logo" to="/">
                            <Navbar.Brand as={Link} to="/" >
                                <img
                                    src={logo}
                                    width="30"
                                    height="30"
                                    alt="React logo"
                                />
                            </Navbar.Brand>
                        </Link>
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
                                <li className="nav-item dropdown">
                                    <div className="d-flex align-items-center gap-0">
                                        <Link className="nav-link" to="/gioi-thieu">
                                            Giới thiệu
                                        </Link>
                                        <a
                                            className="nav-link dropdown-toggle dropdown-toggle-split ps-0"
                                            id="navbarDropdown"
                                            role="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            <span className="visually-hidden">Toggle Dropdown</span>
                                        </a>
                                    </div>
                                    <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                        <li>
                                            <Link className="dropdown-item" to="/tam-nhin">
                                                Tầm nhìn & Sứ mệnh
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item" to="/doi-ngu-bac-si">
                                                Đội ngũ bác sĩ
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item" to="/chuyen-khoa">
                                                Chuyên khoa
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item" to="/trang-thiet-bi">
                                                Trang thiết bị
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item" to="/so-do-to-chuc">
                                                Sơ đồ tổ chức
                                            </Link>
                                        </li>
                                    </ul>
                                </li>


                                <li className="nav-item dropdown">
                                    <div className="d-flex align-items-center gap-0">
                                        <Link className="nav-link" to="/gioi-thieu">
                                            Khách hàng
                                        </Link>
                                        <a
                                            className="nav-link dropdown-toggle dropdown-toggle-split ps-0"
                                            id="navbarDropdown"
                                            role="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            <span className="visually-hidden">Toggle Dropdown</span>
                                        </a>
                                    </div>
                                    <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                        <li>
                                            <Link className="dropdown-item" to="/tam-nhin">
                                                Hướng dẫn
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item" to="/doi-ngu-bac-si">
                                                Khảo sát mức độ hài lòng
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item" to="/chuyen-khoa">
                                                Tư vấn hỏi đáp
                                            </Link>
                                        </li>

                                    </ul>
                                </li>


                                <li className="nav-item dropdown">
                                    <div className="d-flex align-items-center gap-0">
                                        <Link className="nav-link" to="/gioi-thieu">
                                            Tin tức
                                        </Link>
                                        <a
                                            className="nav-link dropdown-toggle dropdown-toggle-split ps-0"
                                            id="navbarDropdown"
                                            role="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            <span className="visually-hidden">Toggle Dropdown</span>
                                        </a>
                                    </div>
                                    <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                        <li>
                                            <Link className="dropdown-item" to="/tam-nhin">
                                                Tin tức & Sự kiện
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item" to="/doi-ngu-bac-si">
                                                Thông báo
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item" to="/chuyen-khoa">
                                                Hoạt động
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item" to="/chuyen-khoa">
                                                Các bệnh
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item" to="/chuyen-khoa">
                                                Hướng dẫn dùng thuốc
                                            </Link>
                                        </li>

                                    </ul>
                                </li>


                                <li className="nav-item">
                                    <Link className="nav-link" to="/link">
                                        Đặt lịch khám
                                    </Link>
                                </li>

                                <li className="nav-item dropdown">
                                    <div className="d-flex align-items-center gap-0">
                                        <Link className="nav-link" to="/gioi-thieu">
                                            Tuyển dụng
                                        </Link>
                                        <a
                                            className="nav-link dropdown-toggle dropdown-toggle-split ps-0"
                                            id="navbarDropdown"
                                            role="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            <span className="visually-hidden">Toggle Dropdown</span>
                                        </a>
                                    </div>
                                    <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                        <li>
                                            <Link className="dropdown-item" to="/tam-nhin">
                                                Thông tin tuyển dụng
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item" to="/doi-ngu-bac-si">
                                                Đăng ký tuyển dụng
                                            </Link>
                                        </li>


                                    </ul>
                                </li>

                                <li className="nav-item dropdown">
                                    <div className="d-flex align-items-center gap-0">
                                        <Link className="nav-link" to="/gioi-thieu">
                                            Bảng giá
                                        </Link>
                                        <a
                                            className="nav-link dropdown-toggle dropdown-toggle-split ps-0"
                                            id="navbarDropdown"
                                            role="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            <span className="visually-hidden">Toggle Dropdown</span>
                                        </a>
                                    </div>
                                    <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                        <li>
                                            <Link className="dropdown-item" to="/tam-nhin">
                                                Hướng dẫn
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item" to="/doi-ngu-bac-si">
                                                ĐKhảo sát mức độ hài lòng
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item" to="/chuyen-khoa">
                                                Tư vấn hỏi đáp
                                            </Link>
                                        </li>

                                    </ul>
                                </li>

                                {/* <li className="nav-item">
                                    <span className="nav-link disabled">Disabled</span>
                                </li> */}
                            </ul>

                            <form className="d-flex">
                                <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                                <button className="btn btn-outline-light" type="submit">
                                    Search
                                </button>
                            </form>
                        </div>
                    </div>
                </nav>

            </>
        );
    } else {
        return <></>;
    }
};
export default NavHeader;