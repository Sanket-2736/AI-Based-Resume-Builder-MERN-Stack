import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:3000'
});

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.authorization = token;
    }
    return config;
});

export default api;