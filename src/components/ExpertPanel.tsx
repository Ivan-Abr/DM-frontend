import React, { useEffect, useState } from 'react';
import { Card, Button, Modal, Form, Input, Space, Popconfirm, message } from 'antd';
import api from '../api';
import { ViewOrganizationDTO, CreateOrganizationDTO, UpdateOrganizationDTO, DecodedToken, Layer } from '../types';
import { jwtDecode}  from 'jwt-decode';
import { EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from 'recharts';

const ExpertPanel: React.FC = () => {
  const [organizations, setOrganizations] = useState<ViewOrganizationDTO[]>([]);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editOrg, setEditOrg] = useState<ViewOrganizationDTO | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('authToken');
  const expertId = token ? (jwtDecode(token) as DecodedToken).id : '';

  const navigate = useNavigate();

  useEffect(() => {
    fetchOrganizations();
    fetchLayers();
    // eslint-disable-next-line
  }, []);

  const fetchOrganizations = async () => {
    try {
      const response = await api.get(`http://localhost:8080/api/organization/user/${expertId}`);
      setOrganizations(response.data);
    } catch (error) {
      message.error('Ошибка загрузки организаций');
    }
  };

  const fetchLayers = async () => {
    try {
      const response = await api.get('http://localhost:8080/api/layer');
      setLayers(response.data);
      console.log('Загруженные слои:', response.data);
    } catch (error) {
      message.error('Ошибка загрузки слоев');
    }
  };

  const handleCreate = () => {
    setEditOrg(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (org: ViewOrganizationDTO) => {
    setEditOrg(org);
    form.resetFields();
    form.setFieldsValue(org);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`http://localhost:8080/api/organization/${id}`);
      message.success('Организация удалена');
      await fetchOrganizations();
    } catch (error) {
      message.error('Ошибка при удалении организации');
    }
  };

  const handleSubmit = async (values: CreateOrganizationDTO | UpdateOrganizationDTO) => {
    setLoading(true);
    try {
      if (editOrg) {
        await api.patch(`http://localhost:8080/api/organization/${editOrg.id}`, { ...values, expertId });
        message.success('Организация обновлена');
      } else {
        await api.post(`http://localhost:8080/api/organization`, { ...values, expertId });
        message.success('Организация создана');
      }
      setIsModalVisible(false);
      setEditOrg(null);
      form.resetFields();
      await fetchOrganizations();
    } catch (error) {
      message.error('Ошибка при сохранении организации');
    } finally {
      setLoading(false);
    }
  };

  const generateRadarData = () => {
    return layers.map(layer => ({
      subject: layer.name,
      desired: Math.floor(Math.random() * 2) + 2, // 2-3
      actual: Math.floor(Math.random() * 3) + 1, // 0-2
    }));
  };

  const RadarChartComponent = () => {
    const data = generateRadarData();
    return (
        <div style={{ width: 600, height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius={90} data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 3]} />
              <Radar name="Желаемое" dataKey="desired" stroke="#4caf50" fill="#4caf50" fillOpacity={0.3} />
              <Radar name="Действительное" dataKey="actual" stroke="#2196f3" fill="#2196f3" fillOpacity={0.3} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
    );
  };

  return (
      <div style={{ maxWidth: 1200, margin: '40px auto', padding: 24, background: '#f5f7fa', borderRadius: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ color: '#1a237e', margin: 0 }}>Мои организации</h1>
          <Button
              icon={<UserOutlined />}
              onClick={() => navigate('/user')}
              type="default"
              style={{ background: '#fff', color: '#1a237e', borderColor: '#1a237e' }}
          >
            Профиль
          </Button>
        </div>
        <Button type="primary" onClick={handleCreate} style={{ marginBottom: 24, background: '#1a237e', borderColor: '#1a237e' }}>
          Создать организацию
        </Button>
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          {organizations.map(org => (
              <Card
                  key={org.id}
                  title={<span style={{ color: '#1a237e' }}>{org.name}</span>}
                  style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #e3eafc' }}
                  extra={
                    <Space>
                      <Button
                          icon={<EditOutlined />}
                          onClick={() => handleEdit(org)}
                          type="text"
                          style={{ color: '#1a237e' }}
                      />
                      <Popconfirm title="Удалить организацию?" onConfirm={() => handleDelete(org.id)} okText="Да" cancelText="Нет">
                        <Button
                            icon={<DeleteOutlined />}
                            type="text"
                            style={{ color: '#607d8b' }}
                        />
                      </Popconfirm>
                      <Button 
                        type="dashed" 
                        style={{ color: '#1a237e', borderColor: '#e3eafc' }}
                        onClick={() => navigate(`/organization/${org.id}/test`)}
                      >
                        Начать опрос
                      </Button>
                    </Space>
                  }
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'stretch' }}>
                  <div style={{ flex: '0 1 50%' }}>
                    <div><b>Аннотация:</b> {org.annotation}</div>
                    <div><b>Контакты:</b> {org.contacts}</div>
                    <Button
                      type="link"
                      style={{ padding: 0, marginTop: 8 }}
                      onClick={() => navigate(`/organization/${org.id}`)}
                    >
                      Подробнее
                    </Button>
                  </div>
                  <div style={{ flex: '0 1 50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <RadarChartComponent />
                  </div>
                </div>
              </Card>
          ))}
        </Space>
        <Modal
            title={editOrg ? 'Редактировать организацию' : 'Создать организацию'}
            open={isModalVisible}
            onCancel={() => {
              setIsModalVisible(false);
              setEditOrg(null);
              form.resetFields();
            }}
            onOk={() => form.submit()}
            confirmLoading={loading}
            bodyStyle={{ background: '#fff' }}
        >
          <Form form={form} onFinish={handleSubmit} layout="vertical">
            <Form.Item name="name" label="Название" rules={[{ required: true, message: 'Введите название' }]}> <Input /> </Form.Item>
            <Form.Item name="annotation" label="Аннотация" rules={[{ required: true, message: 'Введите аннотацию' }]}> <Input /> </Form.Item>
            <Form.Item name="contacts" label="Контакты" rules={[{ required: true, message: 'Введите контакты' }]}> <Input /> </Form.Item>
          </Form>
        </Modal>
      </div>
  );
};

export default ExpertPanel;
