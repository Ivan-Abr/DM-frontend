import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from "../../types";
import { Button, Card, Space, Typography } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import api from '../../api';
import { API_ENDPOINTS } from '../../config';

const { Title, Text } = Typography;

interface AdminInfo {
    name: string;
    email: string;
    phone?: string;
}

const Welcome: React.FC = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('authToken');
    const [admins, setAdmins] = useState<AdminInfo[]>([]);

    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const response = await api.get(API_ENDPOINTS.USER.BASE);
                const adminUsers = response.data.filter((user: any) =>
                    user.role === 'ADMIN' || user.role === 'ROLE_ADMIN'
                );
                setAdmins(adminUsers);
            } catch (error) {
                console.error('Ошибка при загрузке администраторов:', error);
            }
        };

        if (token) {
            fetchAdmins();
        }
    }, [token]);

    const getUsername = () => {
        if (!token) return 'Гость';
        const decoded: DecodedToken = jwtDecode(token);
        return decoded.sub;
    };

    const getRole = () => {
        if (!token) return 'guest';
        const decoded: DecodedToken = jwtDecode(token);
        if (decoded.roles.includes('BANNED')) return 'banned';
        return decoded.roles.includes('ROLE_ADMIN') ? 'admin' : 'user';
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    const handleReturnToLogin = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };


    return (
        <div style={{
            maxWidth: 800,
            margin: '40px auto',
            padding: '24px',
            background: '#fff',
            borderRadius: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
            <Title level={2} style={{color: '#ff4d4f', textAlign: 'center'}}>
                Аккаунт заблокирован
            </Title>
            <Text style={{display: 'block', textAlign: 'center', marginBottom: '24px'}}>
                Ваш аккаунт был заблокирован администратором системы.
                Если вы считаете, что это произошло по ошибке, пожалуйста, свяжитесь с администраторами:
            </Text>

            <Space direction="vertical" style={{width: '100%', marginBottom: '24px'}}>
                {admins.map((admin, index) => (
                    <Card key={index} style={{marginBottom: '16px'}}>
                        <Space direction="vertical" style={{width: '100%'}}>
                            <Text strong>{admin.name}</Text>
                            <Space>
                                <MailOutlined/>
                                <Text>{admin.email}</Text>
                            </Space>
                            {admin.phone && (
                                <Space>
                                    <PhoneOutlined/>
                                    <Text>{admin.phone}</Text>
                                </Space>
                            )}
                        </Space>
                    </Card>
                ))}
            </Space>

            <div style={{textAlign: 'center'}}>
                <Button
                    type="primary"
                    onClick={handleReturnToLogin}
                    style={{marginRight: '16px'}}
                >
                    Вернуться на страницу входа
                </Button>
            </div>
        </div>
    );


};

export default Welcome;