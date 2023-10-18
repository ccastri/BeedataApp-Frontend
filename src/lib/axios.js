import axios from 'axios';
// import throttleAdapterEnhancer from 'axios-throttle';

const backendServer = 'http://localhost:3001';

const api = axios.create({
    baseURL: backendServer,
});

export default api;