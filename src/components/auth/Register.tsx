import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from './AuthForm';
import styles from '../../auth.module.css';
import axios from 'axios';
import api from "../../api";
import { API_ENDPOINTS } from '../../config';

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await api.post(API_ENDPOINTS.AUTH.REGISTER, {
                username,
                password
            });
            navigate('/login');
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'Ошибка регистрации');
            } else {
                setError('Произошла неизвестная ошибка');
            }
        }
    };

    return (
        <AuthForm
            title="Регистрация"
            submitText="Зарегистрироваться"
            footerText="Уже есть аккаунт? Войдите"
            footerLinkText="Вход"
            footerLinkPath="/login"
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

export default Register;