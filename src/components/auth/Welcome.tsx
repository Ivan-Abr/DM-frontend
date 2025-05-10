import React from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import {DecodedToken} from "../../types";

const Welcome: React.FC = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('authToken');

    // Получаем данные из токена
    const getUsername = () => {
        if (!token) return 'Гость';
        const decoded: DecodedToken = jwtDecode(token);
        return decoded.sub;
    };

    const getRole = () => {
        if (!token) return 'guest';
        const decoded: DecodedToken = jwtDecode(token);
        return decoded.roles.includes('ROLE_ADMIN') ? 'admin' : 'user';
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    return (
        <div className="welcome-container">
            <h1>
                {getRole() === 'admin'
                    ? `Приветствуем, администратор ${getUsername()}!`
                    : `Привет, ${getUsername()}!`
                }
            </h1>
            <button onClick={handleLogout}>Выйти</button>
        </div>
    );
};

export default Welcome;