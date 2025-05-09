import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from './AuthForm';
import styles from '../../auth.module.css';
import axios from 'axios';
import api from '../../api';

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        try {
            await api.post('http://localhost:8080/api/auth/register', {
                username,
                email,
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
            footerText="Уже есть аккаунт?"
            footerLinkText="Войти"
            footerLinkPath="/login"
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
                <label className={styles.label}>Email</label>
                <input
                    type="email"
                    className={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
            <div className={styles.formGroup}>
                <label className={styles.label}>Подтвердите пароль</label>
                <input
                    type="password"
                    className={styles.input}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
            </div>
        </AuthForm>
    );
};

export default Register;