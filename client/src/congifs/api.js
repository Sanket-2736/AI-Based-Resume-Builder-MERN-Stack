import axios from 'axios'

const api = axios.create({
    baseURL: 'https://ai-based-resume-builder-mern-stack.onrender.com'
});

export default api;