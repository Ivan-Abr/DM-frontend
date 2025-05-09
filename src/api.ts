import axios,{ AxiosInstance, AxiosRequestConfig, AxiosError }from 'axios';

const api: AxiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true,
});

let isRefreshing = false;
let failedRequests: Array<() => void> = [];

api.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest?._retry) {
            if (isRefreshing) {
                return new Promise(resolve => {
                    failedRequests.push(() => {
                        resolve(api(originalRequest!));
                    });
                });
            }

            originalRequest!._retry = true;
            isRefreshing = true;

            try {
                const newAccessToken = await refreshAccessToken();
                setAccessToken(newAccessToken);
                failedRequests.forEach(cb => cb());
                failedRequests = [];
                return api(originalRequest!);
            } catch (refreshError) {
                await logout();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

const refreshAccessToken = async (): Promise<string> => {
    const refreshToken = getRefreshToken(); // Получаем из secure хранилища
    const response = await axios.post('/api/auth/refresh', { refreshToken });
    return response.data.accessToken;
};

export const setAccessToken = (token: string) => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('accessToken', token);
};

export const getRefreshToken = (): string | null => {
    return localStorage.getItem('refreshToken');
};

export const logout = async () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    delete api.defaults.headers.common['Authorization'];
    window.location.href = '/login';
};

export default api;