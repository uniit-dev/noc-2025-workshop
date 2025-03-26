import axiosLib from 'axios';

const axios = axiosLib.create({
    baseURL: 'http://localhost:8000',
    timeout: 60000,
    withCredentials: true,
});

export default axios;
