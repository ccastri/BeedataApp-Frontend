import axios from 'axios';

const backendServer = process.env.BACKEND_URL || 'http://localhost:3001' ;

const api = axios.create({
    baseURL: backendServer,
});

export default api;