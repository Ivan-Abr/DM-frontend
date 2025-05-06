import React, { useState } from 'react';
import AuthForm from './AuthForm';
import styles from './auth.module.css';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Логика входа
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