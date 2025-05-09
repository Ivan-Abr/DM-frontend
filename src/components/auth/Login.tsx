import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from './AuthForm';
import styles from '../../auth.module.css';
import axios from 'axios';
import api from "../../api";

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await api.post('http://localhost:8080/api/auth/login', {
                username,
                password
            });

            // Сохраняем токен в localStorage
            localStorage.setItem('authToken', response.data.token);

            navigate('/welcome');
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
            title="Добро пожаловать"
            submitText="Войти"
            footerText="Нет аккаунта?"
            footerLinkText="Зарегистрироваться"
            footerLinkPath="/register"
            showLogo={true}
            onSubmit={handleSubmit}
        >
            <div className={styles.formGroup}>
                <label className={styles.label}>Имя пользователя</label>
                <input
                    type="text"
                    className={styles.input}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>
            <div className={styles.formGroup}>
                <label className={styles.label}>Пароль</label>
                <input
                    type="password"
                    className={styles.input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
        </AuthForm>
    );
};

export default Login;