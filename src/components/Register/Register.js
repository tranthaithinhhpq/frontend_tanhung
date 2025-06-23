import './Register.scss'
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { registerNewUser } from '../../services/userService'
import { UserContext } from "../../context/UserContext"
import 'react-toastify/dist/ReactToastify.css';
const Register = (props) => {
    const { user } = useContext(UserContext);

    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setErrors] = useState({});
    const [validation, setValidation] = useState({
        defaultValidEmail: null,
        defaultValidPhone: null,
        defaultValidPassword: null,
        defaultValidConfirmPassword: null
    });
    let history = useHistory();
    const handleLogin = () => {
        history.push("/login");
    }


    const isValidInputs = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const error = {};

        // Email validation
        if (!email) {
            validation.defaultValidEmail = false;
            error.email = 'Email không được để trống';
        } else if (!emailRegex.test(email)) {
            validation.defaultValidEmail = false;
            error.email = 'Email không hợp lệ';
        } else {
            validation.defaultValidEmail = true;
            error.email = '';
        }

        // Phone validation
        if (!phone) {
            validation.defaultValidPhone = false;
            error.phone = 'Phone không được để trống';
        } else {
            validation.defaultValidPhone = true;
            error.phone = '';
        }

        // Password validation
        if (!password) {
            validation.defaultValidPassword = false;
            error.password = 'Mật khẩu không được để trống';
        } else {
            validation.defaultValidPassword = true;
            error.password = '';
        }

        // Confirm password validation
        if (!confirmPassword) {
            validation.defaultValidConfirmPassword = false;
            error.confirmPassword = 'Vui lòng nhập lại mật khẩu';
        } else if (confirmPassword !== password) {
            validation.defaultValidConfirmPassword = false;
            error.confirmPassword = 'Mật khẩu xác nhận không khớp';
        } else {
            validation.defaultValidConfirmPassword = true;
            error.confirmPassword = '';
        }

        setErrors(error);
        return Object.values(error).every(msg => msg === '');
    };

    const handleRegister = async () => {
        let check = isValidInputs();

        if (check === true) {
            let response = await registerNewUser(email, phone, username, password);
            let serverData = response;
            if (+serverData.EC === 0) {
                toast.success(serverData.EM)
                history.push("/login");
            } else {
                toast.error(serverData.EM);
            }
        }

    }

    useEffect(() => {
        if (user && user.isAuthenticated) {
            history.push('/');
        }
    }, []);


    return (
        <div className="register-container d-flex align-items-center">
            <div className="container ">
                <div className="row px-3 px-md-0 ">
                    <div className="content-left col-12 d-none col-md-7 d-md-block">
                        <div className='brand'>
                            <Link to="/">
                                <span title="Return to HomePage">ĐĂNG KÝ</span>
                            </Link>
                        </div>
                        <div className='brand'>
                            Vui lòng đăng nhập để tiếp tục
                        </div>
                    </div>
                    <div className="content-right col-md-5 col-12 d-flex flex-column gap-3 py-3">

                        <div className='brand text-center'>
                            ĐĂNG KÝ
                        </div>

                        <div className='form-group'>
                            <label>Email:</label>
                            <input type="text" className={validation.defaultValidEmail === null ? "form-control" : validation.defaultValidEmail ? "form-control is-valid" : "form-control is-invalid"} placeholder="enter email address "
                                value={email} onChange={(event) => setEmail(event.target.value)}
                            />
                            {error.email && <label style={{ color: "red" }}>{error.email}</label>}

                        </div>
                        <div className='form-group'>
                            <label>Phone number:</label>
                            <input type="text" className={validation.defaultValidPhone === null ? "form-control" : validation.defaultValidPhone ? "form-control is-valid" : "form-control is-invalid"} placeholder="enter phone number "
                                value={phone} onChange={(event) => setPhone(event.target.value)}
                            />
                            {error.phone && <label style={{ color: "red" }}>{error.phone}</label>}
                        </div>
                        <div className='form-group'>
                            <label>Username:</label>
                            <input type="text" className="form-control" placeholder="enter username "
                                value={username} onChange={(event) => setUsername(event.target.value)}
                            />
                        </div>
                        <div className='form-group'>
                            <label>Password:</label>
                            <input type="password" className={validation.defaultValidPassword === null ? "form-control" : validation.defaultValidPassword ? "form-control is-valid" : "form-control is-invalid"} placeholder="enter password"
                                value={password} onChange={(event) => setPassword(event.target.value)}
                            />
                            {error.password && <p style={{ color: "red" }}>{error.password}</p>}
                        </div>



                        <div className='form-group'>
                            <label>Re-enter password:</label>
                            <input type="password" className={validation.defaultValidConfirmPassword === null ? "form-control" : validation.defaultValidConfirmPassword ? "form-control is-valid" : "form-control is-invalid"} placeholder="re-enter password"
                                value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)}
                            />
                            {error.confirmPassword && <p style={{ color: "red" }}>{error.confirmPassword}</p>}
                        </div>
                        <button className='btn btn-primary' onClick={() => handleRegister()}>Register</button>
                        <hr />
                        <div className='text-center'>
                            <button className='btn btn-success' onClick={() => handleLogin()}>
                                Already have account. Login ?
                            </button>
                            <div className="mt-3 return">
                                <Link to="/">
                                    <i className="fa fa-arrow-circle-left" aria-hidden="true"></i>
                                    <span title="Return to HomePage">Return to HomePage</span>
                                </Link>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
export default Register