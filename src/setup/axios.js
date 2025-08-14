import axios from 'axios';
import { toast } from 'react-toastify';

// Tạo instance của axios
const instance = axios.create({
    baseURL: "",
    withCredentials: true,
    timeout: 20000,
});


instance.interceptors.request.use(config => {
    const token = localStorage.getItem('jwt');   // luôn lấy giá trị mới
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});


// ✅ Xử lý lỗi response (Interceptor Response)
instance.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const status = error?.response?.status || 500;
        const path = window.location.pathname;

        const publicPaths = [
            '/',
            '/doctors',
            '/admin/login',
            '/admin/register'
        ];

        const isPublicPath = publicPaths.some(p => path === p || path.startsWith(p));

        switch (status) {
            case 401:
                if (!isPublicPath) {
                    toast.error('Unauthorized. Please login...');
                }
                return error.response?.data || {};
            case 403:
                toast.error(`You don't have permission to access this resource.`);
                return Promise.reject(error);
            case 400:
            case 404:
            case 409:
            case 422:
                return Promise.reject(error);
            default:
                return Promise.reject(error);
        }
    }
);

export default instance;
