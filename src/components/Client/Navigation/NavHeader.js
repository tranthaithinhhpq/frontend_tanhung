import './Nav.scss';
import { Link } from 'react-router-dom';
import { Navbar } from 'react-bootstrap';
import axios from '../../../setup/axios';
import fallbackLogo from '../../../logo.png';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import zlt from '../../../zlt.png';
import { FaFacebookF, FaTiktok, FaYoutube, FaInstagram, FaCalendarAlt, FaPhone, FaChevronDown } from 'react-icons/fa';


const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';

const NavHeaderClient = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [aboutPages, setAboutPages] = useState([]);
    const [clientPages, setClientPages] = useState([]);
    const [contactPages, setContactPages] = useState([]);
    const [pricePages, setPricePages] = useState([]);
    const [logoImg, setLogoImg] = useState(null);
    const [topbarContent, setTopbarContent] = useState({ phone: '', emergency: '', address: '' });
    const [newsCategories, setNewsCategories] = useState([]);

    const [activeMenu, setActiveMenu] = useState(null);

    const toggleDropdown = (menu) => {
        setActiveMenu(activeMenu === menu ? null : menu);
    };



    const [keyword, setKeyword] = useState('');
    const history = useHistory();

    const [medicineCategories, setMedicineCategories] = useState([]);

    useEffect(() => {
        const fetchMedicineCategories = async () => {
            try {
                const res = await axios.get('/api/v1/news-categories-nav', {
                    params: { group: 'medicine' }
                });
                if (res.EC === 0) {
                    setMedicineCategories(res.DT);
                }
            } catch (err) {
                console.error("Lỗi lấy danh mục thuốc", err);
            }
        };

        fetchMedicineCategories();
    }, []);



    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get('/api/v1/news-categories-nav', {
                    params: { group: 'news' }
                });
                if (res.EC === 0) {
                    setNewsCategories(res.DT);
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh mục tin tức:", error);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const fetchTopbar = async () => {
            try {
                const res = await axios.get('/api/v1/page-text-content/topbar');

                if (res.EC === 0) {

                    const content = { phone: '', emergency: '', address: '' };

                    res.DT.forEach(item => {
                        console.log("item.section: ", item.section)
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

    const handleSearch = (e) => {
        e.preventDefault();
        if (!keyword.trim()) return;
        history.push(`/search?keyword=${encodeURIComponent(keyword.trim())}`);
    };

    return (

        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            zIndex: 9999, // đảm bảo nổi trên các phần khác
            backgroundColor: '#fff', // nên có màu nền để không bị trong suốt
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)' // tùy chọn đổ bóng
        }}>
            {/* Top bar chứa địa chỉ, cấp cứu, tổng đài */}
            {windowWidth >= 992 && (
                <div className="top-bar text-light py-2" style={{ backgroundColor: '#007BFF', position: 'sticky', top: 0, zIndex: 1050 }}>
                    <div className="container d-flex justify-content-between align-items-center flex-wrap" style={{ fontSize: '14px' }}>
                        {/* Địa chỉ bên trái */}
                        <div className="d-flex align-items-center">
                            <i className="fa fa-map-marker me-2" aria-hidden="true"></i>
                            {topbarContent.address?.trim() ? topbarContent.address : "871 Trần Xuân Soạn - P. Tân Hưng - Quận 7 - Tp. Hồ Chí Minh"}
                        </div>

                        {/* Tổng đài + cấp cứu bên phải */}
                        <div className="d-flex align-items-center gap-4">
                            {/* Cấp cứu */}
                            <div className="d-flex align-items-center">
                                <i className="fa fa-ambulance me-2" aria-hidden="true"></i>
                                {topbarContent.emergency || 'Cấp cứu: 0901 34 69 34'}
                            </div>

                            {/* Tổng đài */}
                            <div className="d-flex align-items-center">
                                <i className="fa fa-phone me-2" aria-hidden="true"></i>
                                {topbarContent.phone || '(028) 377 606 48'}
                            </div>

                            {/* Icon Facebook + Zalo */}
                            <div className="d-flex align-items-center gap-2 ms-3">
                                <a href="https://www.facebook.com/yourpage" target="_blank" rel="noopener noreferrer">
                                    <i className="fa fa-facebook-f text-white fs-5"></i>
                                </a>
                                <a href="https://zalo.me/1234567890" target="_blank" rel="noopener noreferrer">
                                    {/* <img src="/assets/icons/zalo-icon.svg" alt="Zalo" style={{ width: 20, height: 20 }} /> */}
                                    <img src={zlt} alt="Zalo" style={{ width: 20, height: 20 }} />
                                </a>
                                <Link className="business-btn" to="/booking"><FaCalendarAlt />Đặt lịch khám</Link>
                                {/* <a href="booking" className="business-btn"><FaCalendarAlt /> Đặt lịch khám</a> */}
                            </div>
                        </div>

                    </div>
                </div>
            )}

            <nav className="navbar navbar-expand-lg navbar-light bg-white custom-navbar">
                <div className="container-fluid">
                    <Link className="navbar-brand fw-bold logo" to="/">
                        <Navbar.Brand as={Link} to="/">
                            <img src={logoImg || fallbackLogo} width="35" height="35" alt="Logo bệnh viện" />
                        </Navbar.Brand>
                    </Link>

                    {!(windowWidth >= 992 && windowWidth <= 1250) && (
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
                                <a href="#" className="nav-link nav-link-small">
                                    {/* Giới thiệu */}
                                    Giới thiệu <span className="dropdown-icon"></span>
                                </a>
                                <ul className="dropdown-menu">
                                    <li><Link className="dropdown-child" to="/doctors">Đội ngũ bác sĩ</Link></li>
                                    <li><Link className="dropdown-child" to="/specialties">Chuyên khoa</Link></li>
                                    <li><Link className="dropdown-child" to="/devices">Trang thiết bị</Link></li>
                                    {aboutPages.map((page) => (
                                        <li key={page.slug}><Link className="dropdown-child" to={`/${page.slug}`}>{page.title}</Link></li>
                                    ))}
                                </ul>
                            </li>

                            {/* Khách hàng */}
                            <li className="nav-item dropdown">
                                <a href="#" className="nav-link nav-link-small">
                                    Khách hàng <span className="dropdown-icon"></span>
                                </a>
                                <ul className="dropdown-menu">

                                    {clientPages.map((page) => (
                                        <li key={page.slug}><Link className="dropdown-child" to={`/${page.slug}`}>{page.title}</Link></li>
                                    ))}
                                </ul>
                            </li>

                            {/* Tin tức */}
                            <li className="nav-item dropdown">
                                <a href="#" className="nav-link nav-link-small">
                                    Tin tức <span className="dropdown-icon"></span>
                                </a>
                                <ul className="dropdown-menu">
                                    <li>
                                        <Link className="dropdown-child" to="/news">
                                            Tất cả tin tức
                                        </Link>
                                    </li>
                                    {newsCategories.map((cat) => (
                                        <li key={cat.id}>
                                            <Link className="dropdown-child" to={`/news?categoryId=${cat.id}`}>
                                                {cat.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>

                            <li className="nav-item dropdown">
                                <a href="#" className="nav-link nav-link-small">
                                    Thông tin thuốc <span className="dropdown-icon"></span>
                                </a>
                                <ul className="dropdown-menu">
                                    <li>
                                        <Link className="dropdown-child" to="/medicine-info">
                                            Tất cả thông tin thuốc
                                        </Link>
                                    </li>
                                    {medicineCategories.map((cat) => (
                                        <li key={cat.id}>
                                            <Link className="dropdown-child" to={`/medicine-info?categoryId=${cat.id}`}>
                                                {cat.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>

                            {/* Đặt lịch */}

                            <li className="nav-item dropdown">
                                <a href="#" className="nav-link nav-link-small">
                                    Đặt lịch khám <span className="dropdown-icon"></span>
                                </a>
                                <ul className="dropdown-menu">
                                    <li><Link className="dropdown-child" to="/booking">Đặt lịch khám</Link></li>
                                    <li><Link className="dropdown-child" to="/booking-history">Lịch sử đặt khám</Link></li>

                                </ul>
                            </li>



                            <li className="nav-item dropdown">
                                <a href="#" className="nav-link nav-link-small">
                                    Bảng giá <span className="dropdown-icon"></span>
                                </a>
                                <ul className="dropdown-menu">
                                    <li><Link className="dropdown-child" to="/service-prices">Bảng giá dịch vụ</Link></li>
                                    <li><Link className="dropdown-child" to="/drug-prices">Bảng giá thuốc</Link></li>
                                    {pricePages.map((page) => (
                                        <li key={page.slug}><Link className="dropdown-child" to={`/${page.slug}`}>{page.title}</Link></li>
                                    ))}
                                </ul>
                            </li>

                            {/* Liên hệ */}
                            <li className="nav-item dropdown">
                                <a href="#" className="nav-link nav-link-small">
                                    Liên hệ <span className="dropdown-icon"></span>
                                </a>
                                <ul className="dropdown-menu">
                                    <li><Link className="dropdown-child" to="/question">Hỏi & đáp</Link></li>
                                    {contactPages.map((page) => (
                                        <li key={page.slug}><Link className="dropdown-child" to={`/${page.slug}`}>{page.title}</Link></li>
                                    ))}
                                </ul>
                            </li>
                        </ul>

                        <form className="d-flex" onSubmit={handleSearch}>
                            <input
                                className="form-control me-2"
                                type="search"
                                placeholder="Tìm kiếm"
                                aria-label="Search"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                            <button className="btn btn-dark" type="submit">
                                <i className="bi bi-search"></i>
                            </button>
                        </form>
                    </div>
                </div>
            </nav>
        </div>

    );
};

export default NavHeaderClient;

