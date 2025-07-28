

import React, { useEffect, useState } from 'react';
import './Nav.scss';
import { Link } from 'react-router-dom';
import { Navbar } from 'react-bootstrap';
import axios from '../../../setup/axios';
import fallbackLogo from '../../../logo.png';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';

const NavHeaderClient = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [aboutPages, setAboutPages] = useState([]);
    const [clientPages, setClientPages] = useState([]);
    const [contactPages, setContactPages] = useState([]);
    const [pricePages, setPricePages] = useState([]);
    const [logoImg, setLogoImg] = useState(null);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const fetchPagesBySection = async (section, setState) => {
            try {
                const res = await axios.get(`/api/v1/client/page?section=${section}`);
                if (res.EC === 0) {
                    setState(res.DT);
                }
            } catch (err) {
                console.error(`Error fetching ${section} pages:`, err);
            }
        };

        const fetchLogo = async () => {
            try {
                const res = await axios.get('/api/v1/client/logo?section=logo');
                if (res.EC === 0 && res.DT?.image) {
                    setLogoImg(`${BACKEND_URL}${res.DT.image}`);
                }
            } catch (err) {
                console.error('Error fetching logo:', err);
            }
        };

        fetchPagesBySection('about', setAboutPages);
        fetchPagesBySection('client', setClientPages);
        fetchPagesBySection('contact', setContactPages);
        fetchPagesBySection('price', setPricePages);
        fetchLogo();
    }, []);

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white custom-navbar">
            <div className="container-fluid">
                <Link className="navbar-brand fw-bold logo" to="/">
                    <Navbar.Brand as={Link} to="/">
                        <img src={logoImg || fallbackLogo} width="35" height="35" alt="Logo bệnh viện" />
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
                        {/* Giới thiệu */}
                        <li className="nav-item dropdown">
                            <a href="#" className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Giới thiệu
                            </a>
                            <ul className="dropdown-menu">
                                <li><Link className="dropdown-item" to="/doctors">Đội ngũ bác sĩ</Link></li>
                                <li><Link className="dropdown-item" to="/specialties">Chuyên khoa</Link></li>
                                <li><Link className="dropdown-item" to="/devices">Trang thiết bị</Link></li>
                                {aboutPages.map((page) => (
                                    <li key={page.slug}><Link className="dropdown-item" to={`/${page.slug}`}>{page.title}</Link></li>
                                ))}
                            </ul>
                        </li>

                        {/* Khách hàng */}
                        <li className="nav-item dropdown">
                            <a href="#" className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Khách hàng
                            </a>
                            <ul className="dropdown-menu">

                                {clientPages.map((page) => (
                                    <li key={page.slug}><Link className="dropdown-item" to={`/${page.slug}`}>{page.title}</Link></li>
                                ))}
                            </ul>
                        </li>

                        {/* Tin tức */}
                        <li className="nav-item">
                            <Link className="nav-link" to="/news">Tin tức</Link>
                        </li>

                        {/* Đặt lịch */}
                        <li className="nav-item">
                            <Link className="nav-link" to="/booking">Đặt lịch khám</Link>
                        </li>

                        {/* Tuyển dụng
                        <li className="nav-item dropdown">
                            <a href="#" className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Tuyển dụng
                            </a>
                            <ul className="dropdown-menu">
                                <li><Link className="dropdown-item" to="/tam-nhin">Thông tin tuyển dụng</Link></li>
                                <li><Link className="dropdown-item" to="/doi-ngu-bac-si">Đăng ký tuyển dụng</Link></li>
                                {recruitmentPages.map((page) => (
                                    <li key={page.slug}><Link className="dropdown-item" to={`/${page.slug}`}>{page.title}</Link></li>
                                ))}
                            </ul>
                        </li> */}

                        {/* Bảng giá */}
                        <li className="nav-item dropdown">
                            <a href="#" className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Bảng giá
                            </a>
                            <ul className="dropdown-menu">
                                <li><Link className="dropdown-item" to="/service-prices">Bảng giá dịch vụ</Link></li>
                                <li><Link className="dropdown-item" to="/drug-prices">Bảng giá thuốc</Link></li>
                                {pricePages.map((page) => (
                                    <li key={page.slug}><Link className="dropdown-item" to={`/${page.slug}`}>{page.title}</Link></li>
                                ))}
                            </ul>
                        </li>

                        {/* Liên hệ */}
                        <li className="nav-item dropdown">
                            <a href="#" className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Liên hệ
                            </a>
                            <ul className="dropdown-menu">
                                <li><Link className="dropdown-item" to="/question">Hỏi & đáp</Link></li>
                                {contactPages.map((page) => (
                                    <li key={page.slug}><Link className="dropdown-item" to={`/${page.slug}`}>{page.title}</Link></li>
                                ))}
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
