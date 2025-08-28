// src/components/Admin/ManageUsers/ModalUser.js
import { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import _ from 'lodash';
import { FaEye, FaEyeSlash } from "react-icons/fa"; // icon mắt

import {
    fetchGroupUser,
    createNewUser,
    updateCurrentUser
} from '../../../services/userService';

/* --------------------------------------------------
   Helpers
-------------------------------------------------- */



const BACKEND_URL =
    process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';

const buildImgSrc = (raw) => {
    if (!raw) return '';
    if (raw.startsWith('blob:') || raw.startsWith('http')) return raw;
    return `${BACKEND_URL}${raw}`;               // /images/…
};

/* --------------------------------------------------
   Component
-------------------------------------------------- */

const ModalUser = ({ action, dataModalUser, onHide, show }) => {
    /* ---------- state ---------- */
    const defaultUser = {
        id: '',
        email: '',
        phone: '',
        username: '',
        password: '',
        address: '',
        sex: '',
        group: '',
        image: ''
    };

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');

    const [userData, setUserData] = useState(defaultUser);
    const [groupList, setGroupList] = useState([]);
    const [previewImg, setPreviewImg] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageChanged, setImageChanged] = useState(false);
    const [showFull, setShowFull] = useState(false);

    const [invalid, setInvalid] = useState({
        email: false, phone: false, password: false, group: false
    });

    /* ---------- load nhóm ---------- */
    useEffect(() => {
        (async () => {
            const res = await fetchGroupUser();
            if (res?.EC === 0) {
                setGroupList(res.DT);
                if (res.DT.length && action === 'CREATE')
                    setUserData((u) => ({ ...u, group: res.DT[0].id }));
            } else toast.error(res?.EM);
        })();
    }, [action]);

    /* ---------- tải dữ liệu khi EDIT ---------- */
    useEffect(() => {
        if (action === 'UPDATE' && dataModalUser) {
            setUserData({
                ...dataModalUser,
                group: dataModalUser.Group?.id || '',
                image: dataModalUser.image || ''
            });
            setPreviewImg(dataModalUser.image || '');
        }
    }, [action, dataModalUser]);

    /* ---------- đổi input ---------- */
    const updateField = (val, key) =>
        setUserData((prev) => ({ ...prev, [key]: val }));

    /* ---------- chọn file ---------- */
    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setSelectedFile(file);
        setImageChanged(true);
        setPreviewImg(URL.createObjectURL(file));
    };

    /* ---------- validate ---------- */
    const valid = () => {
        if (action === 'UPDATE') return true;
        const required = ['email', 'phone', 'password', 'group'];
        const next = { email: false, phone: false, password: false, group: false };

        for (const k of required)
            if (!userData[k]) { next[k] = true; toast.error(`Empty ${k}`); }

        setInvalid(next);
        return !Object.values(next).some(Boolean);
    };

    /* ---------- submit ---------- */
    const handleSubmit = async () => {
        if (!valid()) return;

        try {
            let res;
            /* === gửi multipart khi CREATE hoặc EDIT có file === */
            if (action === 'CREATE' || imageChanged) {
                const fd = new FormData();
                const key = ['id', 'email', 'phone', 'username', 'address', 'sex'];
                key.forEach((k) => userData[k] && fd.append(k, userData[k]));
                fd.append('groupId', userData.group);
                if (action === 'CREATE') fd.append('password', userData.password);
                if (selectedFile) fd.append('image', selectedFile);

                res = action === 'CREATE'
                    ? await createNewUser(fd)
                    : await updateCurrentUser(fd, true);
            } else {
                /* === EDIT không đổi ảnh === */
                res = await updateCurrentUser(
                    { ...userData, groupId: userData.group },
                    false
                );
            }

            if (res?.EC === 0) {
                toast.success(res.EM);
                onHide();
                reset();
            } else {
                toast.error(res.EM);
                if (res.DT) setInvalid((v) => ({ ...v, [res.DT]: true }));
            }

            if (action === 'CREATE' && userData.password !== confirmPassword) {
                toast.error("Passwords do not match");
                return;
            }


        } catch (e) {
            console.error(e);
            toast.error('Unexpected error!');
        }
    };

    /* ---------- reset form ---------- */
    const reset = () => {
        setUserData({ ...defaultUser, group: groupList[0]?.id || '' });
        setPreviewImg('');
        setSelectedFile(null);
        setImageChanged(false);
        setInvalid({ email: false, phone: false, password: false, group: false });
    };

    /* ---------- close ---------- */
    const closeModal = () => {
        onHide();
        reset();
    };

    /* ---------- render ---------- */
    return (
        <>
            <Modal show={show} size="lg" onHide={closeModal} className="modal-user">
                <Modal.Header closeButton>
                    <Modal.Title>{action === 'CREATE' ? 'Create new user' : 'Edit a user'}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {/* ---------- FORM ---------- */}
                    <div className="row content-body">
                        {/* email & phone */}
                        <div className="col-sm-6 form-group">
                            <label>Email address <span className="red">*</span></label>
                            <input
                                disabled={action === 'UPDATE'}
                                className={invalid.email ? 'form-control is-invalid' : 'form-control'}
                                value={userData.email}
                                onChange={(e) => updateField(e.target.value, 'email')}
                            />
                        </div>






                        <div className="col-sm-6 form-group">
                            <label>Phone number <span className="red">*</span></label>
                            <input
                                disabled={action === 'UPDATE'}
                                className={invalid.phone ? 'form-control is-invalid' : 'form-control'}
                                value={userData.phone}
                                onChange={(e) => updateField(e.target.value, 'phone')}
                            />
                        </div>


                        {action === 'CREATE' && (
                            <div className="col-sm-6 form-group">
                                <label>Password <span className="red">*</span></label>
                                <div className="input-group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className={invalid.password ? 'form-control is-invalid' : 'form-control'}
                                        value={userData.password}
                                        onChange={(e) => updateField(e.target.value, 'password')}
                                    />
                                    <span className="input-group-text" style={{ cursor: "pointer" }}
                                        onClick={() => setShowPassword(!showPassword)}>
                                        <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
                                    </span>
                                </div>
                            </div>
                        )}



                        {/* username & password */}
                        <div className="col-sm-6 form-group">
                            <label>Username</label>
                            <input
                                className="form-control"
                                value={userData.username}
                                onChange={(e) => updateField(e.target.value, 'username')}
                            />
                        </div>

                        {/* {action === 'CREATE' && (
                            <div className="col-sm-6 form-group">
                                <label>Password <span className="red">*</span></label>
                                <input
                                    type="password"
                                    className={invalid.password ? 'form-control is-invalid' : 'form-control'}
                                    value={userData.password}
                                    onChange={(e) => updateField(e.target.value, 'password')}
                                />
                            </div>
                        )} */}


                        {action === 'CREATE' && (
                            <div className="col-sm-6 form-group">
                                <label>Confirm Password <span className="red">*</span></label>
                                <div className="input-group">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        className={confirmPassword !== userData.password && confirmPassword !== ''
                                            ? 'form-control is-invalid'
                                            : 'form-control'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                    <span className="input-group-text" style={{ cursor: "pointer" }}
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                        <i className={`fa ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`} />
                                    </span>
                                    {confirmPassword !== userData.password && confirmPassword !== '' && (
                                        <div className="invalid-feedback">Passwords do not match</div>
                                    )}
                                </div>
                            </div>
                        )}






                        {/* address & sex */}
                        <div className="col-sm-6 form-group">
                            <label>Address</label>
                            <input
                                className="form-control"
                                value={userData.address}
                                onChange={(e) => updateField(e.target.value, 'address')}
                            />
                        </div>

                        <div className="col-sm-6 form-group">
                            <label>Gender</label>
                            <select
                                className="form-select"
                                value={userData.sex}
                                onChange={(e) => updateField(e.target.value, 'sex')}
                            >
                                <option value="">Select gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* group */}
                        <div className="col-sm-6 form-group">
                            <label>Group <span className="red">*</span></label>
                            <select
                                className={invalid.group ? 'form-select is-invalid' : 'form-select'}
                                value={userData.group}
                                onChange={(e) => updateField(e.target.value, 'group')}
                            >
                                {groupList.map((g) => (
                                    <option key={g.id} value={g.id}>{g.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* image */}
                        <div className="col-sm-6 form-group">
                            <label>Upload Image</label>
                            <input type="file" className="form-control" accept="image/*" onChange={handleFile} />

                            {(previewImg || userData.image) && (
                                <div className="mt-2">
                                    <img
                                        src={buildImgSrc(previewImg || userData.image)}
                                        alt="preview"
                                        style={{
                                            maxWidth: 120,
                                            maxHeight: 120,
                                            objectFit: 'cover',
                                            border: '1px solid #ccc',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => setShowFull(true)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>Close</Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        {action === 'CREATE' ? 'Save' : 'Update'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* ---------- FULL IMAGE ---------- */}
            {showFull && (
                <div
                    onClick={() => setShowFull(false)}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 9999,
                        background: 'rgba(0,0,0,0.8)', display: 'flex',
                        justifyContent: 'center', alignItems: 'center'
                    }}
                >
                    <img
                        src={buildImgSrc(previewImg || userData.image)}
                        alt="full"
                        style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }}
                    />
                </div>
            )}
        </>
    );
};

export default ModalUser;
