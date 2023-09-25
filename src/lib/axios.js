import axios from 'axios';
// import throttleAdapterEnhancer from 'axios-throttle';

const backendServer = 'https://api.beet.digital';

const api = axios.create({
    baseURL: backendServer,
});

export default api;