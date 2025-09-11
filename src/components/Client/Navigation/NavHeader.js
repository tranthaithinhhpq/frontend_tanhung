import './Nav.scss';
import { Link } from 'react-router-dom';
import { Navbar } from 'react-bootstrap';
import axios from '../../../setup/axios';
import fallbackLogo from '../../../logo.png';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import zlt from '../../../zlt.png';
import { FaCalendarAlt, FaFacebookMessenger } from 'react-icons/fa';


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
    const [showSearch, setShowSearch] = useState(false); // 👈 mới




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

    const handleSearchRedirect = () => {
        history.push('/search');
    };

    return (
        <>

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
                {windowWidth >= 1200 && (

                    <div className="top-bar text-light py-2">
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
                                    <a href="https://www.facebook.com/benhvientanhung" target="_blank" rel="noopener noreferrer">
                                        <i className="fa fa-facebook-f text-white fs-5"></i>
                                    </a>
                                    <a href="https://zalo.me/0901346934" target="_blank" rel="noopener noreferrer">
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
                {windowWidth > 991.88 ?
                    (<div
                        style={{
                            position: 'fixed',
                            bottom: '40px',
                            right: '10px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            gap: '10px',
                            zIndex: 1000
                        }}
                    >
                        {/* Nút Zalo */}
                        <a
                            href="https://zalo.me/0901346934"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                backgroundColor: '#1877f2',
                                color: '#fff',
                                padding: '10px',
                                borderRadius: '50%',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
                                display: 'inline-block',
                                transition: 'transform 0.2s ease-in-out'
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <img
                                src={zlt}
                                alt="Zalo"
                                style={{
                                    width: '28px',
                                    height: '28px',
                                    backgroundColor: '#1877f2',
                                    borderRadius: '50%',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
                                }}
                            />
                        </a>

                        {/* Nút Facebook Messenger */}
                        <a
                            href="https://www.facebook.com/benhvientanhung"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                backgroundColor: '#1877f2',
                                color: '#fff',
                                padding: '10px',
                                borderRadius: '50%',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
                                display: 'inline-block',
                                transition: 'transform 0.2s ease-in-out'
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <FaFacebookMessenger size={20} />
                        </a>

                        {/* Nút Đặt lịch khám */}
                        <Link
                            to="/booking"
                            style={{
                                backgroundColor: '#28a745',
                                color: '#fff',
                                padding: '8px 12px',
                                borderRadius: '20px',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
                                textDecoration: 'none',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                display: 'inline-block',
                                transition: 'transform 0.2s ease-in-out'
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            Đặt lịch khám
                        </Link>
                    </div>) : (
                        <div
                            style={{
                                position: 'fixed',
                                bottom: 0,
                                left: 0,
                                width: '100%',
                                backgroundColor: '#007bff',
                                display: 'flex',
                                justifyContent: 'space-around',
                                alignItems: 'center',
                                padding: '8px 0',
                                zIndex: 1000
                            }}
                        >
                            {/* Zalo */}
                            <a
                                href="https://zalo.me/0901346934"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    color: '#fff',
                                    textDecoration: 'none',
                                    fontSize: '12px',
                                    flex: 1,
                                    borderRight: '1px solid rgba(255,255,255,0.5)'
                                }}
                            >
                                Zalo
                            </a>

                            {/* Messenger */}
                            <a
                                href="https://www.facebook.com/benhvientanhung"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    color: '#fff',
                                    textDecoration: 'none',
                                    fontSize: '12px',
                                    flex: 1,
                                    borderRight: '1px solid rgba(255,255,255,0.5)'
                                }}
                            >
                                Liên hệ
                            </a>

                            {/* Đặt lịch khám */}
                            <a
                                href="/booking"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    color: '#fff',
                                    textDecoration: 'none',
                                    fontSize: '12px',
                                    flex: 1
                                }}
                            >
                                Đặt lịch khám
                            </a>
                        </div>
                    )}


                <nav className="navbar navbar-expand-xl navbar-light bg-white custom-navbar">
                    <div className="container-fluid">
                        <Link className="navbar-brand fw-bold logo" to="/">
                            <Navbar.Brand as={Link} to="/">
                                <img src={logoImg || fallbackLogo} width="50" height="50" alt="Logo bệnh viện" />
                            </Navbar.Brand>
                        </Link>

                        {!(windowWidth >= 1200 && windowWidth <= 1560) && (
                            <Link to="/" className="brand-link ms-1 me-1">
                                <div className="brand-text">
                                    <span className="brand-name-2">TAN HUNG GENERAL HOSPITAL</span>
                                    <span className="brand-name-1">BỆNH VIỆN ĐA KHOA TÂN HƯNG</span>
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
                                    <Link
                                        className="nav-link nav-link-small"
                                        href="#"
                                        role="button"
                                        {...(windowWidth < 992
                                            ? { 'data-bs-toggle': 'dropdown', 'aria-expanded': false }
                                            : {})}
                                        to="/tam-nhin-va-su-menh"
                                    >
                                        Giới thiệu <span className="dropdown-icon"></span>
                                    </Link>
                                    <ul className="dropdown-menu">
                                        <li><Link className="dropdown-child" to="/doctors">Đội ngũ bác sĩ</Link></li>
                                        <li><Link className="dropdown-child" to="/specialties">Khoa - Phòng</Link></li>
                                        <li><Link className="dropdown-child" to="/devices">Trang thiết bị</Link></li>
                                        {aboutPages.map((page) => (
                                            <li key={page.slug}><Link className="dropdown-child" to={`/${page.slug}`}>{page.title}</Link></li>
                                        ))}
                                    </ul>
                                </li>

                                {/* Khách hàng */}
                                <li className="nav-item dropdown">
                                    <Link
                                        className="nav-link nav-link-small"
                                        href="#"
                                        role="button"
                                        {...(windowWidth < 992
                                            ? { 'data-bs-toggle': 'dropdown', 'aria-expanded': false }
                                            : {})}
                                        to="/quyen-va-trach-nhiem"
                                    >
                                        Khách hàng <span className="dropdown-icon"></span>
                                    </Link>

                                    <ul className="dropdown-menu">

                                        {clientPages.map((page) => (
                                            <li key={page.slug}><Link className="dropdown-child" to={`/${page.slug}`}>{page.title}</Link></li>
                                        ))}
                                    </ul>
                                </li>

                                {/* Tin tức */}
                                <li className="nav-item dropdown">
                                    <Link
                                        className="nav-link nav-link-small"
                                        href="#"
                                        role="button"
                                        {...(windowWidth < 992
                                            ? { 'data-bs-toggle': 'dropdown', 'aria-expanded': false }
                                            : {})}
                                        to="/news"
                                    >
                                        Tin tức <span className="dropdown-icon"></span>
                                    </Link>
                                    <ul className="dropdown-menu">
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

                                    <Link
                                        className="nav-link nav-link-small"
                                        href="#"
                                        role="button"
                                        {...(windowWidth < 992
                                            ? { 'data-bs-toggle': 'dropdown', 'aria-expanded': false }
                                            : {})}
                                        to="/medicine-info"
                                    >
                                        Thông tin thuốc <span className="dropdown-icon"></span>
                                    </Link>
                                    <ul className="dropdown-menu">
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
                                    <Link
                                        className="nav-link nav-link-small"
                                        href="#"
                                        role="button"
                                        {...(windowWidth < 992
                                            ? { 'data-bs-toggle': 'dropdown', 'aria-expanded': false }
                                            : {})}
                                        to="/booking"
                                    >
                                        Đặt lịch khám <span className="dropdown-icon"></span>
                                    </Link>
                                    <ul className="dropdown-menu">
                                        <li><Link className="dropdown-child" to="/booking">Đặt lịch khám</Link></li>
                                        <li><Link className="dropdown-child" to="/booking-history">Lịch sử đặt khám</Link></li>

                                    </ul>
                                </li>



                                <li className="nav-item dropdown">
                                    <Link
                                        className="nav-link nav-link-small"
                                        href="#"
                                        role="button"
                                        {...(windowWidth < 992
                                            ? { 'data-bs-toggle': 'dropdown', 'aria-expanded': false }
                                            : {})}
                                        to="/service-prices"
                                    >
                                        Bảng giá <span className="dropdown-icon"></span>
                                    </Link>
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

                                    <Link
                                        className="nav-link nav-link-small"
                                        href="#"
                                        role="button"
                                        {...(windowWidth < 992
                                            ? { 'data-bs-toggle': 'dropdown', 'aria-expanded': false }
                                            : {})}
                                        to="/question"
                                    >
                                        Liên hệ <span className="dropdown-icon"></span>
                                    </Link>
                                    <ul className="dropdown-menu">
                                        <li><Link className="dropdown-child" to="/question">Hỏi & đáp</Link></li>
                                        {contactPages.map((page) => (
                                            <li key={page.slug}><Link className="dropdown-child" to={`/${page.slug}`}>{page.title}</Link></li>
                                        ))}
                                    </ul>
                                </li>

                                {/* Tuyển dụng */}
                                <li className="nav-item dropdown">
                                    <Link
                                        className="nav-link nav-link-small"
                                        href="#"
                                        role="button"
                                        {...(windowWidth < 992
                                            ? { 'data-bs-toggle': 'dropdown', 'aria-expanded': false }
                                            : {})}
                                        to="/tam-nhin-va-su-menh"
                                    >
                                        Tuyển dụng <span className="dropdown-icon"></span>
                                    </Link>
                                    <ul className="dropdown-menu">
                                        <li><Link className="dropdown-child" to="/recruitment">Ứng tyển</Link></li>

                                        {aboutPages.map((page) => (
                                            <li key={page.slug}><Link className="dropdown-child" to={`/${page.slug}`}>{page.title}</Link></li>
                                        ))}
                                    </ul>
                                </li>
                            </ul>


                            {/* Search */}
                            <div className="d-flex align-items-center">
                                {windowWidth >= 1300 || showSearch ? (
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
                                ) : (
                                    <button
                                        className="btn btn-outline-dark ms-2"
                                        onClick={handleSearchRedirect}
                                    >
                                        <i className="bi bi-search"></i>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>
            </div >
        </>

    );
};

export default NavHeaderClient;

