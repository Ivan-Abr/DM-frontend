import 'axios';

declare module 'axios' {
    export interface InternalAxiosRequestConfig {
        _retry?: boolean; // Добавляем кастомное свойство
    }
}