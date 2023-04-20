import axios from 'axios';

const backendServer = process.env.NODE_ENV === 'production' ? process.env.BACKEND_SERVER : 'http://localhost:3001'

const api = axios.create({
    baseURL: backendServer,
});

export default api;