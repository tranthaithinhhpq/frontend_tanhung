import { Modal } from "react-bootstrap";
import { Button } from 'react-bootstrap';
import { useState, useEffect } from "react";
import { fetchGroup, createNewUser, updateCurrentUser } from '../../services/userService'
import { toast } from "react-toastify";
import _ from "lodash";

const ModalUser = (props) => {

    const { action, dataModalUser } = props;

    const defaultUserData = {
        email: '',
        phone: '',
        username: '',
        password: '',
        address: '',
        sex: '',
        group: ''

    }

    const validInputDefault = {
        email: true,
        phone: true,
        username: true,
        password: true,
        address: true,
        sex: true,
        group: true,

    }

    const [userData, setUserData] = useState(defaultUserData);
    const [validInput, setValidInput] = useState(validInputDefault);


    const [userGroup, setUserGroup] = useState([]);

    useEffect(() => {
        getGroups();
    }, [])

    useEffect(() => {
        if (action === 'UPDATE') {
            setUserData({ ...dataModalUser, group: dataModalUser.Group ? dataModalUser.Group.id : '' });
        }
    }, [dataModalUser]);

    useEffect(() => {
        if (action === 'CREATE') {
            if (userGroup && userGroup.length > 0) {
                setUserData({ ...userData, group: userGroup[0].id })
            }
        }
    }, [action])

    const getGroups = async () => {
        let res = await fetchGroup();
        if (res && res && res.EC === 0) {
            setUserGroup(res.DT);
            if (res.DT && res.DT.length > 0) {
                let groups = res.DT;
                setUserData({ ...userData, group: groups[0].id })
            }
        } else {
            toast.error(res.EM);
        }
    }

    const handleOnchangeInput = (value, name) => {
        let _userData = _.cloneDeep(userData);
        _userData[name] = value;
        setUserData(_userData);
    }

    const checkValidateInputs = () => {
        //create user
        if (action === 'UPDATE') return true;
        setValidInput(validInputDefault);
        console.log(">>> check user Data: ", userData);
        let arr = ['email', 'phone', 'password', 'group'];
        let check = true;
        for (let i = 0; i < arr.length; i++) {
            if (!userData[arr[i]]) {
                let _validInputs = _.cloneDeep(validInputDefault);
                _validInputs[arr[i]] = false;
                setValidInput(_validInputs);
                toast.error(`Empty input ${arr[i]}`);
                check = false;
                break;

            }

        }
        return check;
    }

    const handleConfirmUser = async () => {
        let check = checkValidateInputs();
        if (check === true) {
            let res = action === 'CREATE' ?
                await createNewUser({ ...userData, groupId: userData['group'] })
                : await updateCurrentUser({ ...userData, groupId: userData['group'] });

            if (res && res.EC === 0) {
                props.onHide();
                setUserData({
                    ...defaultUserData,
                    group: userGroup && userGroup.length > 0 ? userGroup[0].id : ''
                })
                toast.success(res.EM);
            }
            if (res && res.EC !== 0) {
                toast.error(res.EM);
                let _validInputs = _.cloneDeep(validInputDefault);
                _validInputs[res.DT] = false;
                setValidInput(_validInputs);
            }

        }

    }

    const handleCloseModalUser = () => {
        props.onHide();
        setUserData(defaultUserData);
        setValidInput(validInputDefault);
    }

    return (
        <>
            <Modal size="lg" show={props.show} className="modal-user" onHide={() => handleCloseModalUser()}>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        <span>{props.action === 'CREATE' ? 'Create new user' : 'Edit a user'}</span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="content-body row">
                        <div className="col-12 col-sm-6 form-group">
                            <label>Email address (<span className="red">*</span>) </label>
                            <input
                                disabled={action === 'CREATE' ? false : true}
                                className={validInput.email ? 'form-control' : 'form-control is-invalid'}
                                type="email" value={userData.email}
                                onChange={(event) => handleOnchangeInput(event.target.value, "email")}
                            />
                        </div>
                        <div className="col-12 col-sm-6 form-group">
                            <label>Phone number (<span className="red">*</span>) </label>
                            <input
                                disabled={action === 'CREATE' ? false : true}
                                className={validInput.phone ? 'form-control' : 'form-control is-invalid'}
                                type="text" value={userData.phone}
                                onChange={(event) => handleOnchangeInput(event.target.value, "phone")}
                            />
                        </div>
                        <div className="col-12 col-sm-6 form-group">
                            <label>Username</label>
                            <input className="form-control" type="text" value={userData.username}
                                onChange={(event) => handleOnchangeInput(event.target.value, "username")}
                            />
                        </div>
                        <div className="col-12 col-sm-6 form-group">
                            {action === 'CREATE'
                                &&
                                <>
                                    <label>Password (<span className="red">*</span>) </label>
                                    <input className={validInput.password ? 'form-control' : 'form-control is-invalid'}
                                        type="password" value={userData.password}
                                        onChange={(event) => handleOnchangeInput(event.target.value, "password")}
                                    />
                                </>
                            }
                        </div>
                        <div className="col-12 col-sm-6 form-group">
                            <label>Address</label>
                            <input className="form-control" type="text" value={userData.address}
                                onChange={(event) => handleOnchangeInput(event.target.value, "address")}
                            />
                        </div>
                        <div className="col-12 col-sm-6 form-group">
                            <label>Gender</label>
                            <select className="form-select"
                                onChange={(event) => handleOnchangeInput(event.target.value, "sex")}
                                value={userData.sex}
                            >
                                <option defaultValue="Male">Male</option>
                                <option defaultValue="Female">Female</option>
                                <option defaultValue="Other">Other</option>
                            </select>
                        </div>
                        <div className="col-12 col-sm-6 form-group">
                            <label>Group (<span className="red">*</span>)</label>
                            <select
                                className={validInput.group ? 'form-select' : 'form-select is-invalid'}
                                onChange={(event) => handleOnchangeInput(event.target.value, "group")}
                                value={userData.group}
                            >
                                {userGroup.length > 0 &&
                                    userGroup.map((item, index) => {
                                        return (
                                            <option key={`group-${index}`} value={item.id}>{item.name}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.handleClose}>Close</Button>
                    <Button variant="primary" onClick={() => (handleConfirmUser())}>
                        {action === 'CREATE' ? 'Save' : 'Update'}

                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
export default ModalUser;