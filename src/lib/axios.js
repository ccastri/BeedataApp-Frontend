import axios from 'axios';

const backendServer = process.env.BACKEND_URL;

const api = axios.create({
    baseURL: backendServer,
});

export default api;