import axios from 'axios';

// Create a central Axios instance pointing directly to our Spring Boot server
const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;