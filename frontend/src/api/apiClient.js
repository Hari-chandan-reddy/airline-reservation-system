import axios from 'axios';

// Create a central Axios instance pointing directly to our Spring Boot server
const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Automatically attach JWT Token to every outgoing request
apiClient.interceptors.request.use(
    (config) => {
        // Retrieve the token saved during login
        const token = localStorage.getItem('token');
        
        if (token) {
            // Attach as "Authorization: Bearer <JWT_TOKEN>"
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;