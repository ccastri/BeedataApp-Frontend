import axios from 'axios';

const backendServer = 'http://localhost:3001';

const api = axios.create({
    baseURL: backendServer,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
});

export default api;