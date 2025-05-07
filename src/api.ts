import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api', // Базовый URL вашего API
});

// Добавляем интерцептор для вставки токена
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;