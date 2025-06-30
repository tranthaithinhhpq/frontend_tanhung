import axios from "../setup/axios";

const getPosition = () => {
    return axios.get("/api/v1/position/read");
};

export {
    getPosition
};
