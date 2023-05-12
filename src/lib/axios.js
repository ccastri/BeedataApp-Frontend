import axios from 'axios';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const backendServer = publicRuntimeConfig.BACKEND_URL;

const api = axios.create({
    baseURL: backendServer,
});

export default api;
