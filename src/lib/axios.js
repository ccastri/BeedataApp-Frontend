import axios from 'axios';

const backendServer = 'https://api.blackwater-85bce617.eastus.azurecontainerapps.io';

const api = axios.create({
    baseURL: backendServer,
});

export default api;