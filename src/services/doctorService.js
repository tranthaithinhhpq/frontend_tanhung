import axios from "../setup/axios";

const createDoctorInfo = (data) => {
    return axios.post("/api/v1/admin/doctor/create", data);
};

const updateDoctorInfo = (id, data) => {
    return axios.put(`/api/v1/admin/doctor/update/${id}`, data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
};

const getDoctorDetail = (id) => {
    return axios.get(`/api/v1/doctor/detail/${id}`);
};

export {
    createDoctorInfo,
    updateDoctorInfo,
    getDoctorDetail
};
