import axios from '../setup/axios';
const getSpecialty = (data) => {
    return axios.post('/api/v1/role/assign-to-group', { data });
};



// Export để dùng ở nơi khác
export { getSpecialty };