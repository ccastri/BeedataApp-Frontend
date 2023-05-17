import axios from 'axios';

const backendServer = NODE_ENV === development ? 'http://localhost:3001' : 'https://api.beet.digital';

const api = axios.create({
    baseURL: backendServer,
});

export default api;