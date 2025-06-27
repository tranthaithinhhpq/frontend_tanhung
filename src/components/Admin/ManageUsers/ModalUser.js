import { Modal } from "react-bootstrap";
import { Button } from 'react-bootstrap';
import { useState, useEffect } from "react";
import { fetchGroup, createNewUser, updateCurrentUser } from '../../../services/userService';
import { toast } from "react-toastify";
import _ from "lodash";

const ModalUser = (props) => {
    const { action, dataModalUser } = props;
    const [selectedImageFile, setSelectedImageFile] = useState(null);

    const defaultUserData = {
        email: '',
        phone: '',
        username: '',
        password: '',
        address: '',
        sex: '',
        group: '',
        image: ''
    };

    const validInputDefault = {
        email: true,
        phone: true,
        username: true,
        password: true,
        address: true,
        sex: true,
        group: true,
    };

    const [userData, setUserData] = useState(defaultUserData);
    const [validInput, setValidInput] = useState(validInputDefault);
    const [userGroup, setUserGroup] = useState([]);
    const [previewImage, setPreviewImage] = useState('');
    const [showFullImage, setShowFullImage] = useState(false);

    useEffect(() => {
        getGroups();
    }, []);

    useEffect(() => {
        if (action === 'UPDATE') {
            setUserData({
                ...dataModalUser,
                group: dataModalUser.Group ? dataModalUser.Group.id : '',
                image: dataModalUser.image || ''
            });
            setPreviewImage(dataModalUser.image || '');
        }
    }, [dataModalUser]);

    useEffect(() => {
        if (action === 'CREATE') {
            if (userGroup.length > 0) {
                setUserData(prev => ({ ...prev, group: userGroup[0].id }));
            }
        }
    }, [action]);



    const getGroups = async () => {
        let res = await fetchGroup();
        if (res && res.EC === 0) {
            setUserGroup(res.DT);
            if (res.DT.length > 0) {
                setUserData(prev => ({ ...prev, group: res.DT[0].id }));
            }
        } else {
            toast.error(res.EM);
        }
    };

    const handleOnchangeInput = (value, name) => {
        let _userData = _.cloneDeep(userData);
        _userData[name] = value;
        setUserData(_userData);
    };

    const checkValidateInputs = () => {
        if (action === 'UPDATE') return true;
        setValidInput(validInputDefault);

        let arr = ['email', 'phone', 'password', 'group'];
        for (let key of arr) {
            if (!userData[key]) {
                let _validInputs = _.cloneDeep(validInputDefault);
                _validInputs[key] = false;
                setValidInput(_validInputs);
                toast.error(`Empty input ${key}`);
                return false;
            }
        }
        return true;
    };

    const handleConfirmUser = async () => {
        let isValid = checkValidateInputs();
        if (!isValid) return;

        try {
            const formData = new FormData();

            // Thêm dữ liệu người dùng vào formData
            formData.append('email', userData.email);
            formData.append('phone', userData.phone);
            formData.append('username', userData.username);
            formData.append('address', userData.address);
            formData.append('sex', userData.sex);
            formData.append('groupId', userData.group);
            if (action === 'CREATE') {
                formData.append('password', userData.password);
            }

            // Nếu có ảnh được chọn thì thêm vào formData
            if (selectedImageFile) {
                formData.append('image', selectedImageFile);
            }

            // Gửi yêu cầu tới server
            let res = action === 'CREATE'
                ? await createNewUser(formData)
                : await updateCurrentUser(formData);

            // Xử lý phản hồi từ server
            if (res && res.EC === 0) {
                props.onHide();
                setUserData({
                    ...defaultUserData,
                    group: userGroup.length > 0 ? userGroup[0].id : ''
                });
                setPreviewImage('');
                setSelectedImageFile(null);
                toast.success(res.EM);
            } else {
                toast.error(res.EM);
                if (res.DT) {
                    let _validInputs = _.cloneDeep(validInputDefault);
                    _validInputs[res.DT] = false;
                    setValidInput(_validInputs);
                }
            }
        } catch (error) {
            console.error("Error in handleConfirmUser:", error);
            toast.error("An unexpected error occurred.");
        }
    };


    const handleCloseModalUser = () => {
        props.onHide();
        setUserData(defaultUserData);
        setPreviewImage('');
        setValidInput(validInputDefault);
    };

    const handleUploadImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImageFile(file);
            const objectUrl = URL.createObjectURL(file);
            setPreviewImage(objectUrl);
        }
    };

    return (
        <>
            <Modal size="lg" show={props.show} className="modal-user" onHide={handleCloseModalUser}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {action === 'CREATE' ? 'Create new user' : 'Edit a user'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="content-body row">
                        <div className="col-12 col-sm-6 form-group">
                            <label>Email address <span className="red">*</span></label>
                            <input
                                disabled={action === 'UPDATE'}
                                className={validInput.email ? 'form-control' : 'form-control is-invalid'}
                                type="email"
                                value={userData.email}
                                onChange={(e) => handleOnchangeInput(e.target.value, "email")}
                            />
                        </div>
                        <div className="col-12 col-sm-6 form-group">
                            <label>Phone number <span className="red">*</span></label>
                            <input
                                disabled={action === 'UPDATE'}
                                className={validInput.phone ? 'form-control' : 'form-control is-invalid'}
                                type="text"
                                value={userData.phone}
                                onChange={(e) => handleOnchangeInput(e.target.value, "phone")}
                            />
                        </div>
                        <div className="col-12 col-sm-6 form-group">
                            <label>Username</label>
                            <input
                                className="form-control"
                                type="text"
                                value={userData.username}
                                onChange={(e) => handleOnchangeInput(e.target.value, "username")}
                            />
                        </div>
                        {action === 'CREATE' &&
                            <div className="col-12 col-sm-6 form-group">
                                <label>Password <span className="red">*</span></label>
                                <input
                                    className={validInput.password ? 'form-control' : 'form-control is-invalid'}
                                    type="password"
                                    value={userData.password}
                                    onChange={(e) => handleOnchangeInput(e.target.value, "password")}
                                />
                            </div>
                        }
                        <div className="col-12 col-sm-6 form-group">
                            <label>Address</label>
                            <input
                                className="form-control"
                                type="text"
                                value={userData.address}
                                onChange={(e) => handleOnchangeInput(e.target.value, "address")}
                            />
                        </div>
                        <div className="col-12 col-sm-6 form-group">
                            <label>Gender</label>
                            <select
                                className="form-select"
                                value={userData.sex}
                                onChange={(e) => handleOnchangeInput(e.target.value, "sex")}
                            >
                                <option value="">Select gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="col-12 col-sm-6 form-group">
                            <label>Group <span className="red">*</span></label>
                            <select
                                className={validInput.group ? 'form-select' : 'form-select is-invalid'}
                                value={userData.group}
                                onChange={(e) => handleOnchangeInput(e.target.value, "group")}
                            >
                                {userGroup.map((item, idx) => (
                                    <option key={`group-${idx}`} value={item.id}>{item.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-12 col-sm-6 form-group">
                            <label>Upload Image</label>
                            <input
                                type="file"
                                className="form-control"
                                accept="image/*"
                                onChange={handleUploadImage}
                            />
                            {(userData.image || previewImage) && (
                                <div className="mt-2">
                                    <img
                                        src={previewImage || userData.image}
                                        alt="preview"
                                        style={{
                                            width: "100px",
                                            height: "100px",
                                            objectFit: "cover",
                                            border: "1px solid #ccc",
                                            cursor: "pointer"
                                        }}
                                        onClick={() => setShowFullImage(true)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModalUser}>Close</Button>
                    <Button variant="primary" onClick={handleConfirmUser}>
                        {action === 'CREATE' ? 'Save' : 'Update'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {showFullImage && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0, left: 0, width: '100vw', height: '100vh',
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 9999
                    }}
                    onClick={() => setShowFullImage(false)}
                >
                    <img
                        src={previewImage || userData.image}
                        alt="full"
                        style={{
                            maxWidth: '90%',
                            maxHeight: '90%',
                            border: '4px solid white',
                            borderRadius: '8px'
                        }}
                    />
                </div>
            )}
        </>
    );
};

export default ModalUser;
