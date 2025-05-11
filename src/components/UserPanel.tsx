import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, Card, Typography, message } from 'antd';
import api from '../api';
import { ViewUserDTO, UpdateUserDTO, DecodedToken } from '../types';
import { jwtDecode } from 'jwt-decode';

const UserPanel: React.FC = () => {
  const [user, setUser] = useState<ViewUserDTO | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('authToken');
  const id = token ? (jwtDecode(token) as DecodedToken).id : '';

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get(`http://localhost:8080/api/user/${id}`);
      setUser(response.data);
    } catch (error) {
      message.error('Ошибка загрузки данных пользователя');
    }
  };

  const handleEdit = () => {
    if (user) {
      form.setFieldsValue({ name: user.name, email: user.email, password: '' });
      setIsModalVisible(true);
    }
  };

  const handleSubmit = async (values: UpdateUserDTO) => {
    setLoading(true);
    try {
      if (!user) return;
      await api.patch(`http://localhost:8080/api/user/${user.id}`, values);
      message.success('Данные успешно обновлены');
      setIsModalVisible(false);
      await fetchUser();
    } catch (error) {
      message.error('Ошибка при обновлении данных');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div>Загрузка...</div>;

  return (
    <div style={{ maxWidth: 400, margin: '40px auto' }}>
      <Card title="Личный кабинет" bordered>
        <Typography.Paragraph><b>Имя:</b> {user.name}</Typography.Paragraph>
        <Typography.Paragraph><b>Email:</b> {user.email}</Typography.Paragraph>
        <Typography.Paragraph><b>Роль:</b> {user.role}</Typography.Paragraph>
        <Button type="primary" onClick={handleEdit}>Редактировать</Button>
      </Card>
      <Modal
        title="Редактировать данные"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        confirmLoading={loading}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item name="name" label="Имя" rules={[{ required: true, message: 'Введите имя' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Введите email' }, { type: 'email', message: 'Некорректный email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Новый пароль" rules={[{ min: 6, message: 'Минимум 6 символов' }]}>
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserPanel; 