import axios from 'axios';

const backendServer = 'https://api.beet.digital'

const api = axios.create({
    baseURL: backendServer,
});

export default api;