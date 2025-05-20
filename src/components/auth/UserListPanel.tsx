import React, { useEffect, useState } from 'react';
import { Card, Button, Space, message, Tag, Divider } from 'antd';
import api from '../../api';
import { ViewUserDTO, ViewOrganizationDTO } from '../../types';

const UserListPanel: React.FC = () => {
  const [users, setUsers] = useState<ViewUserDTO[]>([]);
  const [orgs, setOrgs] = useState<ViewOrganizationDTO[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchOrgs();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('http://localhost:8080/api/user');
      setUsers(response.data);
    } catch (error) {
      message.error('Ошибка загрузки пользователей');
    }
  };

  const fetchOrgs = async () => {
    try {
      const response = await api.get('http://localhost:8080/api/organization');
      setOrgs(response.data);
    } catch (error) {
      message.error('Ошибка загрузки организаций');
    }
  };

  const handleRoleChange = async (user: ViewUserDTO) => {
    setLoading(true);
    try {
      const newRole = user.role === 'BANNED' ? 'USER' : 'BANNED';
      const requestData = { role: newRole };
      console.log('Отправка PATCH запроса:', {
        url: `http://localhost:8080/api/user/${user.id}`,
        method: 'PATCH',
        requestBody: JSON.stringify(requestData, null, 2),
        headers: api.defaults.headers,
        user: {
          id: user.id,
          currentRole: user.role,
          newRole: newRole
        }
      });
      const response = await api.patch(`http://localhost:8080/api/user/${user.id}`, requestData);
      console.log('Ответ сервера на смену роли:', response.data);
      message.success('Роль изменена');
      await fetchUsers();
    } catch (error) {
      console.error('Ошибка при смене роли:', error);
      message.error('Ошибка при смене роли');
    } finally {
      setLoading(false);
    }
  };

  const admins = users.filter(u => u.role === 'ADMIN' || u.role === 'ROLE_ADMIN');
  const regularUsers = users.filter(u => u.role === 'USER' || u.role === 'ROLE_USER' || u.role === 'BANNED');

  return (
    <div style={{ background: '#f5f7fa', minHeight: '100vh', paddingTop: 0 }}>
      <div style={{ background: '#1a237e', padding: '24px 0 24px 32px', marginBottom: 32 }}>
        <h1 style={{ color: '#fff', textAlign: 'left', margin: 0, fontWeight: 700, fontSize: 28 }}>
          Пользователи
        </h1>
      </div>
      <div style={{ maxWidth: 1100, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #e3eafc', padding: '32px 24px 24px 24px', minHeight: 600 }}>
        <h2 style={{ color: '#1a237e' }}>Администраторы</h2>
        <Space direction="vertical" style={{ width: '100%' }} size={16}>
          {admins.map(admin => (
            <Card key={admin.id} style={{ background: '#f8fafc', borderRadius: 12 }}>
              <b>{admin.name}</b> <Tag color="blue">{admin.email}</Tag>
            </Card>
          ))}
        </Space>
        <Divider />
        <h2 style={{ color: '#1a237e' }}>Эксперты</h2>
        <Space direction="vertical" style={{ width: '100%' }} size={16}>
          {regularUsers.map(user => (
            <Card key={user.id} style={{ background: '#f8fafc', borderRadius: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <b>{user.name}</b> <Tag color={user.role === 'BANNED' ? 'red' : 'blue'}>{user.email}</Tag>
                  <div style={{ marginTop: 8, color: '#607d8b' }}>
                    <b>Организации:</b>
                    {orgs.filter(o => o.expertId === user.id).length === 0 ? (
                      <span> —</span>
                    ) : (
                      <ul style={{ margin: 0, paddingLeft: 20 }}>
                        {orgs.filter(o => o.expertId === user.id).map(org => (
                          <li key={org.id} style={{ marginBottom: 8 }}>
                            <div><b>Имя:</b> {org.name}</div>
                            <div><b>Аннотация:</b> {org.annotation || '—'}</div>
                            <div><b>Контакты:</b> {org.contacts || '—'}</div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <Button
                  type={user.role === 'BANNED' ? 'default' : 'primary'}
                  danger={user.role !== 'BANNED'}
                  loading={loading}
                  onClick={() => handleRoleChange(user)}
                  style={{ marginLeft: 16 }}
                >
                  {user.role === 'BANNED' ? 'Разблокировать' : 'Заблокировать'}
                </Button>
              </div>
            </Card>
          ))}
        </Space>
      </div>
    </div>
  );
};

export default UserListPanel; 