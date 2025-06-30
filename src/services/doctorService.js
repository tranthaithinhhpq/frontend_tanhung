import axios from "../setup/axios";

export const createDoctorInfo = (data) => {
    return axios.post("/api/v1/doctor-info/create", data);
};

export const updateDoctorInfo = (userId, data) => {
    return axios.put(`/api/v1/doctor-info/update/${userId}`, data);
};