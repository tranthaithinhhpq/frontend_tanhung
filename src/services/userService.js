// import axios from "axios"
import axios from "../setup/axios"
const registerNewUser = (email, phone, username, password) => {
    return axios.post("/api/v1/register", {
        email, phone, username, password
    })
}

const loginUser = (valueLogin, password) => {
    return axios.post("/api/v1/login", {
        valueLogin, password
    })
}

const fetchAllUser = (page, limit) => {
    return axios.get(`/api/v1/admin/user/read?page=${page}&limit=${limit}`); // template string
    // return axios.get
}

// return axios.post("/api/v1/admin/user/delete", {data:{id: user.id}}{

// })

const deleteUser = (id) => {
    // axios 0.27+ phải ghi rõ { data: { ... } }
    return axios.delete('/api/v1/admin/user/delete', { data: { id } });
};



const fetchGroup = () => {
    return axios.get("/api/v1/admin/group/read");
}

const fetchGroupUser = () => {
    return axios.get("/api/v1/admin/user/create");

}

const createNewUser = (formData) => {
    return axios.post("/api/v1/admin/user/create", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

// UPDATE gửi multipart nếu có file, else gửi JSON
const updateCurrentUser = (formDataOrJson, hasFile) => {
    if (hasFile) {
        return axios.put('/api/v1/admin/user/update', formDataOrJson, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }
    return axios.put('/api/v1/admin/user/update', formDataOrJson);
};


const getUserAccount = () => {
    return axios.get('/api/v1/account');
};

const logoutUser = () => {
    return axios.post("/api/v1/logout");
};

const changePassword = (data) => {
    return axios.post("/api/v1/user/change-password", data);
};


const getDoctor = () => {
    return axios.get(`/api/v1/admin/user/read-doctor`); // template string

}

const getDoctorInfoByUserId = (userId) => {
    return axios.get(`/api/v1/admin/doctor-info/${userId}`);
};



export {
    registerNewUser, loginUser, fetchAllUser, deleteUser, fetchGroup, fetchGroupUser, createNewUser, updateCurrentUser, getUserAccount,
    logoutUser, getDoctor, getDoctorInfoByUserId, changePassword
};