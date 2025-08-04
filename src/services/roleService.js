// Import axios từ file cấu hình
import axios from '../setup/axios';

// Hàm gọi API để tạo danh sách role
const createRoles = (roles) => {
    return axios.post('/api/v1/admin/role/create', [...roles]);
}

const fetchAllRole = () => {
    return axios.get(`/api/v1/admin/role/read`); //template string
}

const deleteRole = (role) => {
    return axios.delete("/api/v1/admin/role/delete", { data: { id: role.id } });
}

const fetchRolesByGroup = (groupId) => {
    return axios.get(`/api/v1/admin/role/by-group/${groupId}`); // template string
}

const assignRolesToGroup = (data) => {
    return axios.post('/api/v1/admin/role/assign-to-group', { data });
};

const updateRole = async (role) => {
    try {
        return await axios.put('/api/v1/admin/role/update', role);
    } catch (err) {
        console.error('❌ updateRole error:', err);
        return { EC: -1, EM: 'Update failed' };
    }
};

// Export để dùng ở nơi khác
export { createRoles, fetchAllRole, deleteRole, fetchRolesByGroup, assignRolesToGroup, updateRole };
