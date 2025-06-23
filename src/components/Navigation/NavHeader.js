import React, { useEffect, useState, useContext } from 'react';
import './Nav.scss';
import { Link, NavLink, useLocation, useHistory } from 'react-router-dom';
import { UserContext } from "../../context/UserContext";
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from '../../logo.png';
import { logoutUser } from '../../services/userService';
import { toast } from 'react-toastify';



const NavHeader = (props) => {
    const { user, logoutContext } = useContext(UserContext);
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

                <div className="nav-header">
                    <Navbar bg="header" expand="xl">

                        <Navbar.Brand as={Link} to="/" className="ms-3">
                            <img
                                src={logo}
                                width="30"
                                height="30"
                                className="d-inline-block align-top me-1"
                                alt="React logo"
                            />
                        </Navbar.Brand>
                        <Link to="/" className="brand-link">
                            <div className="brand-text">
                                <span className="brand-name-1">Bệnh viện Đa Khoa Tân Hưng</span>
                                <span className="brand-name-2">Tan Hung General Hospital</span>
                            </div>
                        </Link>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className=" mx-auto ">
                                <NavLink to="/gioi-thieu" exact className="nav-link">Giới thiệu</NavLink>
                                <NavLink to="/khach-hang" className="nav-link">Khách hàng</NavLink>
                                <NavLink to="/tin-tuc" className="nav-link">Tin tức</NavLink>
                                <NavLink to="/lich-kham" className="nav-link">Quản lý ịch khám</NavLink>
                                <NavLink to="/tuyen-dung" className="nav-link">Tuyển dụng</NavLink>
                                <NavLink to="/bang-gia" className="nav-link">Bảng giá</NavLink>
                            </Nav>
                            <Nav className='me-3'>
                                {user && user.isAuthenticated === true ?
                                    <>

                                        <Nav.Item className='nav-link'>
                                            <span>Welcome {user.account.username} !</span>
                                        </Nav.Item>

                                        <NavDropdown title="Settings" id="basic-nav-dropdown" align="end">
                                            <NavDropdown.Item>Change Password</NavDropdown.Item>
                                            <NavDropdown.Divider />
                                            <NavDropdown.Item>
                                                <span onClick={() => handleLogout()}>Log out</span>
                                            </NavDropdown.Item>
                                        </NavDropdown>

                                    </>
                                    :
                                    <Link className='nav-link' to='/login'>
                                        Login
                                    </Link>
                                }


                            </Nav>
                        </Navbar.Collapse>

                    </Navbar>
                </div>
            </>
        );
    } else {
        return <></>;
    }
};
export default NavHeader;