import axios from 'axios';

const backendServer = process.env.NEXT_PUBLIC_BACKEND_URL;

const api = axios.create({
    baseURL: backendServer,
});

export default api;