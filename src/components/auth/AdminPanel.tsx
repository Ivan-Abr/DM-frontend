import React, { useState } from 'react';
import { Card, Button } from 'antd';
import AdminCrudPanel from './AdminCrudPanel';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import UserListPanel from './UserListPanel';

const AdminPanel: React.FC = () => {
    const [showCrud, setShowCrud] = useState(false);
    const [showUsers, setShowUsers] = useState(false);
    const navigate = useNavigate();
    if (showCrud) return <AdminCrudPanel />;
    if (showUsers) return <UserListPanel />;
    return (
        <div style={{ maxWidth: 900, margin: '40px auto', padding: 24, background: '#f5f7fa', borderRadius: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h1 style={{ color: '#1a237e', margin: 0 }}>Панель администратора</h1>
                <Button
                    icon={<UserOutlined />}
                    onClick={() => navigate('/user')}
                    type="default"
                    style={{ background: '#fff', color: '#1a237e', borderColor: '#1a237e' }}
                >
                    Профиль
                </Button>
            </div>
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Card
                    hoverable
                    style={{ borderRadius: 16, boxShadow: '0 2px 8px #e3eafc', background: '#fff', cursor: 'pointer', maxWidth: 400, minWidth: 320 }}
                    onClick={() => setShowCrud(true)}
                    bodyStyle={{ padding: 32 }}
                >
                    <h2 style={{ color: '#1a237e', marginBottom: 16 }}>Управление слоями, факторами и вопросами</h2>
                    <div style={{ color: '#607d8b', marginBottom: 16 }}>Перейти к управлению всеми сущностями системы</div>
                    <Button type="primary" style={{ background: '#1a237e', borderColor: '#1a237e' }}>Перейти</Button>
                </Card>
                <Card
                    hoverable
                    style={{ borderRadius: 16, boxShadow: '0 2px 8px #e3eafc', background: '#fff', cursor: 'pointer', maxWidth: 400, minWidth: 320 }}
                    onClick={() => setShowUsers(true)}
                    bodyStyle={{ padding: 32 }}
                >
                    <h2 style={{ color: '#1a237e', marginBottom: 16 }}>Пользователи</h2>
                    <div style={{ color: '#607d8b', marginBottom: 16 }}>Просмотр и управление пользователями системы</div>
                    <Button type="primary" style={{ background: '#1a237e', borderColor: '#1a237e' }}>Перейти</Button>
                </Card>
            </div>
        </div>
    );
};

export default AdminPanel;