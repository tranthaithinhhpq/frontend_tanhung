import axios from "../setup/axios";

const getDegree = () => {
    return axios.get("/api/v1/degree/read");
};

export {
    getDegree
};
