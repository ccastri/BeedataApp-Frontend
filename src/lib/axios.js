import axios from 'axios';

const backendServer = process.env.BACKEND_SERVER;

const api = axios.create({
    baseURL: backendServer,
});

export default api;