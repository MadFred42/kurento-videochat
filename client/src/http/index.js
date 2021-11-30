import axios from 'axios';

const baseURL = process.env.API_URL || 'http://localhost:5000/api';

const $api = axios.create({
    withCredentials: true,
    baseURL
});

export default $api;