import './GroupRole.scss';
import { useState, useEffect, useContext } from 'react';
import { fetchGroup } from '../../../services/userService';
import { fetchAllRole, fetchRolesByGroup, assignRolesToGroup } from '../../../services/roleService';
import _ from 'lodash';
import { toast } from 'react-toastify';
import { UserContext } from '../../../context/UserContext';
const GroupRole = () => {
    const [userGroups, setUserGroups] = useState([]);
    const [listRoles, setListRoles] = useState([]);
    const [selectGroup, setSelectGroup] = useState("");
    const [assignRolesByGroup, setAssignRolesByGroup] = useState([]);
    const { user, loginContext } = useContext(UserContext);

    useEffect(() => {
        getGroups();
        getAllRoles();
    }, []);



    const buildDataToSave = () => {
        // Example output: { groupId: 4, groupRoles: [{}, {}] }
        let result = {};

        const _assignRolesByGroup = _.cloneDeep(assignRolesByGroup);
        result.groupId = selectGroup;

        // Lọc những role được chọn (isAssigned === true)
        let groupRolesFilter = _assignRolesByGroup.filter(item => item.isAssigned === true);

        // Chuyển thành định dạng backend yêu cầu
        let finalGroupRoles = groupRolesFilter.map(item => {
            let data = {
                groupId: +selectGroup,
                roleId: +item.id,
            };
            return data;
        });

        result.groupRoles = finalGroupRoles;
        return result;
    };

    const handleSave = async () => {
        const res = await assignRolesToGroup(buildDataToSave());

        if (res && res.EC === 0) {
            toast.success(res.EM);

            if (res.access_token) {
                // 1. Lưu vào localStorage
                localStorage.setItem('jwt', res.access_token);

                // 2. Cập nhật context để app re-render
                loginContext({
                    isAuthenticated: true,
                    token: res.access_token,
                    account: {
                        ...user.account,
                        groupWithRoles: res.DT        // roles mới
                    }
                });
            }
        } else toast.error(res?.EM || 'Save failed');
    };







    const getGroups = async () => {
        let res = await fetchGroup();
        if (res && res.EC === 0) {
            setUserGroups(res.DT);
        } else {
            toast.error(res.EM);
        }
    };

    const getAllRoles = async () => {
        let data = await fetchAllRole();
        if (data && +data.EC === 0) {
            setListRoles(data.DT);
        }
    };

    const handleOnchangeGroup = async (value) => {
        setSelectGroup(value);
        if (value) {
            let data = await fetchRolesByGroup(value);
            if (data && +data.EC === 0) {
                let result = buildDataRolesByGroup(data.DT.Roles, listRoles);
                setAssignRolesByGroup(result);
            }
        }
    };

    const buildDataRolesByGroup = (groupRoles, allRoles) => {
        let result = [];
        if (allRoles && allRoles.length > 0) {
            allRoles.map(role => {
                let object = {};
                object.url = role.url;
                object.id = role.id;
                object.description = role.description;
                object.isAssigned = false;

                if (groupRoles && groupRoles.length > 0) {
                    object.isAssigned = groupRoles.some(item => item.url === object.url);
                }

                result.push(object);
            });
        }

        return result;
    };

    const handleSelectRole = (value) => {
        // Tạo bản sao sâu của danh sách roles được gán
        const _assignRolesByGroup = _.cloneDeep(assignRolesByGroup);

        // Tìm vị trí role theo id được click
        let foundIndex = _assignRolesByGroup.findIndex(item => +item.id === +value);

        // Nếu tìm thấy thì đảo ngược trạng thái isAssigned
        if (foundIndex > -1) {
            _assignRolesByGroup[foundIndex].isAssigned = !_assignRolesByGroup[foundIndex].isAssigned;
        }

        // Cập nhật lại state
        setAssignRolesByGroup(_assignRolesByGroup);
    };

    return (
        <div className='group-role-container'>
            <div className='container'>
                <div className='container mt-3'>
                    <h4>Group Role:</h4>
                    <div className='assign-group-role'>
                        <div className='col-12 col-sm-6 form-group'>
                            <label>
                                Select Group: (<span className='red'>*</span>)
                            </label>
                            <select
                                className='form-select'
                                onChange={(event) => handleOnchangeGroup(event.target.value)}
                            >
                                <option value="">Please select your group</option>
                                {userGroups.length > 0 &&
                                    userGroups.map((item, index) => {
                                        return (
                                            <option key={`group-${index}`} value={item.id}>{item.description}</option>
                                        );
                                    })}
                            </select>
                        </div>
                        <hr />
                        {selectGroup &&
                            <div className="roles">
                                <h5>Assign Roles:</h5>
                                {assignRolesByGroup && assignRolesByGroup.length > 0 &&
                                    assignRolesByGroup.map((item, index) => {
                                        return (
                                            <div className="form-check" key={`list-role-${index}`}>
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    value={item.id}
                                                    id={`list-role-${index}`}
                                                    checked={item.isAssigned}
                                                    onChange={(event) => handleSelectRole(event.target.value)}
                                                />
                                                <label
                                                    className="form-check-label"
                                                    htmlFor={`list-role-${index}`}
                                                >
                                                    {item.description}
                                                </label>
                                            </div>
                                        );
                                    })
                                }
                                <div className="mt-3">
                                    <button className="btn btn-warning" onClick={() => handleSave()}>Save</button>
                                </div>
                            </div>
                        }
                    </div>
                </div>

            </div>
        </div>
    );
};

export default GroupRole;




