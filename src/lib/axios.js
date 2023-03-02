import { serverUrl } from '../config/config';
import axios from 'axios';

export const axiosBase = axios.create({
    baseURL: serverUrl,
});
