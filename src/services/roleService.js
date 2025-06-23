// Import axios từ file cấu hình
import axios from '../setup/axios';

// Hàm gọi API để tạo danh sách role
const createRoles = (roles) => {
    return axios.post('/api/v1/role/create', [...roles]);
}

const fetchAllRole = () => {
    return axios.get(`/api/v1/role/read`); //template string
}

const deleteRole = (role) => {
    return axios.delete("/api/v1/role/delete", { data: { id: role.id } });
}

const fetchRolesByGroup = (groupId) => {
    return axios.get(`/api/v1/role/by-group/${groupId}`); // template string
}

const assignRolesToGroup = (data) => {
    return axios.post('/api/v1/role/assign-to-group', { data });
};



// Export để dùng ở nơi khác
export { createRoles, fetchAllRole, deleteRole, fetchRolesByGroup, assignRolesToGroup };
