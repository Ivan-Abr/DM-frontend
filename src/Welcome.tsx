import React from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome: React.FC = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem('username') || 'Пользователь';

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    return (
        <div className="welcome-container">
            <h1>Добро пожаловать, {username}!</h1>
            <button onClick={handleLogout}>Выйти</button>
        </div>
    );
};

export default Welcome;