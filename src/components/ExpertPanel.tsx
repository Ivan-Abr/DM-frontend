import React, { useEffect, useState } from 'react';
import { Card, Button, Modal, Form, Input, Space, Popconfirm, message } from 'antd';
import api from '../api';
import { ViewOrganizationDTO, CreateOrganizationDTO, UpdateOrganizationDTO, DecodedToken, Layer } from '../types';
import { jwtDecode}  from 'jwt-decode';
import { EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {API_ENDPOINTS} from "../config";

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
  }, []);

  const fetchOrganizations = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.ORGANIZATION.BY_EXPERT(expertId));
      setOrganizations(response.data);
    } catch (error) {
      message.error('Ошибка загрузки организаций');
    }
  };

  const fetchLayers = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.LAYER.BASE);
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
      await api.delete(API_ENDPOINTS.ORGANIZATION.BY_ID(id));
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
        await api.patch(API_ENDPOINTS.ORGANIZATION.BY_ID(editOrg.id), { ...values, expertId });
        message.success('Организация обновлена');
      } else {
        await api.post(API_ENDPOINTS.ORGANIZATION.BASE, { ...values, expertId });
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
                <div>
                  <div style={{ marginBottom: 8 }}><b>Аннотация:</b> {org.annotation}</div>
                  <div style={{ marginBottom: 8 }}><b>Контакты:</b> {org.contacts}</div>
                  <Button
                    type="link"
                    style={{ padding: 0 }}
                    onClick={() => navigate(`/organization/${org.id}`)}
                  >
                    Подробнее
                  </Button>
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
