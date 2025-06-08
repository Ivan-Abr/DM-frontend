import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from './AuthForm';
import styles from '../../auth.module.css';
import axios from 'axios';
import api from "../../api";
import { jwtDecode } from 'jwt-decode';
import { API_ENDPOINTS } from '../../config';

interface DecodedToken {
    sub: string;
    roles: string[];
    exp: number;
}

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
                username,
                password
            });
            const token = response.data.token;
            localStorage.setItem('authToken', response.data.token);


            const decoded: DecodedToken = jwtDecode(token);
            const roles = decoded.roles;

            if (roles.includes('ROLE_ADMIN')) {
                navigate('/admin');
            }
            else if (roles.includes('ROLE_EXPERT')) {
                navigate('/expert');
            }
            else navigate('/welcome');
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'Ошибка входа');
            } else {
                setError('Произошла неизвестная ошибка');
            }
        }
    };

    return (
        <AuthForm
            title="Вход в систему"
            submitText="Войти"
            footerText="Нет аккаунта? Зарегистрируйтесь"
            footerLinkText="Регистрация"
            footerLinkPath="/register"
            showLogo={true}
            onSubmit={handleSubmit}
        >
            <div className={styles.formGroup}>
                <input
                    type="text"
                    placeholder="Имя пользователя"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={styles.input}
                />
            </div>
            <div className={styles.formGroup}>
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.input}
                />
            </div>
            {error && <div className={styles.error}>{error}</div>}
        </AuthForm>
    );
};

export default Login;