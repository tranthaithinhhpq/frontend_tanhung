import axios from '../setup/axios';

const getSpecialty = () => {
    return axios.get('/api/v1/specialty/read');
};

export { getSpecialty };