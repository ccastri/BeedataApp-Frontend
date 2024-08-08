import axios from 'axios';

// const backendServer = 'https://localhost:3000/';
const backendServer = 'https://api.beet.digital/';
// const backendServer = 'https://api.blackwater-85bce617.eastus.azurecontainerapps.io';

const api = axios.create({
    baseURL: backendServer,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
});

export default api;