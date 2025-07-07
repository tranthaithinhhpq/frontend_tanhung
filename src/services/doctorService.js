import axios from "../setup/axios";

const createDoctorInfo = (data) => {
    return axios.post("/api/v1/doctor-info/create", data);
};



const updateDoctorInfo = (userId, data) => {
    return axios.put(`/api/v1/doctor-info/${userId}`, data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
};

export {
    createDoctorInfo, updateDoctorInfo
};