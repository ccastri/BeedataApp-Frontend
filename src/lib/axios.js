import axios from 'axios';

const backendServer = 'http://localhost:3001'

const api = axios.create({
    baseURL: backendServer,
});

export default api;