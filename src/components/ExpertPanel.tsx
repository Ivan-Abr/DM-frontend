import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {Button, Card, Space, Modal, Form, Input, message, Popconfirm, Spin} from 'antd';
import {EditOutlined, DeleteOutlined, UserOutlined, PlusOutlined} from '@ant-design/icons';
import { API_ENDPOINTS } from '../config';
import api from '../api';
import {ViewOrganizationDTO, CreateOrganizationDTO, UpdateOrganizationDTO, Layer} from '../types';
import {jwtDecode} from 'jwt-decode';

interface DecodedToken {
  id: string;
}

const ExpertPanel: React.FC = () => {
  const [organizations, setOrganizations] = useState<ViewOrganizationDTO[]>([]);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editOrg, setEditOrg] = useState<ViewOrganizationDTO | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState({
    table: false,
    modal: false,
    delete: false
  });
  const [currentDeletingId, setCurrentDeletingId] = useState<string | null>(null);

  const token = localStorage.getItem('authToken');
  const expertId = token ? (jwtDecode(token) as DecodedToken).id : '';

  const navigate = useNavigate();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(prev => ({ ...prev, table: true }));
      await Promise.all([fetchOrganizations(), fetchLayers()]);
    } catch (error) {
      message.error('Ошибка загрузки данных');
    } finally {
      setLoading(prev => ({ ...prev, table: false }));
    }
  };

  const fetchOrganizations = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.ORGANIZATION.BY_EXPERT(expertId));
      setOrganizations(response.data);
    } catch (error) {
      throw new Error('Ошибка загрузки организаций');
    }
  };

  const fetchLayers = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.LAYER.BASE);
      setLayers(response.data);
    } catch (error) {
      throw new Error('Ошибка загрузки слоев');
    }
  };

  const handleCreate = () => {
    setEditOrg(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (org: ViewOrganizationDTO) => {
    setEditOrg(org);
    form.setFieldsValue({
      name: org.name,
      annotation: org.annotation,
      contacts: org.contacts
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      setCurrentDeletingId(id);
      setLoading(prev => ({ ...prev, delete: true }));

      await api.delete(API_ENDPOINTS.ORGANIZATION.BY_ID(id));
      message.success('Организация успешно удалена');
      await fetchOrganizations();
    } catch (error) {
      message.error('Не удалось удалить организацию');
    } finally {
      setCurrentDeletingId(null);
      setLoading(prev => ({ ...prev, delete: false }));
    }
  };

  const handleSubmit = async (values: CreateOrganizationDTO | UpdateOrganizationDTO) => {
    try {
      setLoading(prev => ({ ...prev, modal: true }));

      if (editOrg) {
        await api.patch(
            API_ENDPOINTS.ORGANIZATION.BY_ID(editOrg.id),
            { ...values, expertId }
        );
        message.success('Организация успешно обновлена');
      } else {
        await api.post(
            API_ENDPOINTS.ORGANIZATION.BASE,
            { ...values, expertId }
        );
        message.success('Организация успешно создана');
      }

      setIsModalVisible(false);
      form.resetFields();
      await fetchOrganizations();
    } catch (error) {
      message.error(editOrg
          ? 'Не удалось обновить организацию'
          : 'Не удалось создать организацию'
      );
    } finally {
      setLoading(prev => ({ ...prev, modal: false }));
    }
  };

  if (loading.table) {
    return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}>
          <Spin size="large" />
        </div>
    );
  }

  return (
      <div style={{
        maxWidth: 1200,
        margin: '40px auto',
        padding: 24,
        background: '#f5f7fa',
        borderRadius: 16
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24
        }}>
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

        <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
            style={{
              marginBottom: 24,
              background: '#1a237e',
              borderColor: '#1a237e'
            }}
        >
          Создать организацию
        </Button>

        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          {organizations.map(org => (
              <Card
                  key={org.id}
                  title={<span style={{ color: '#1a237e' }}>{org.name}</span>}
                  style={{
                    background: '#fff',
                    borderRadius: 12,
                    boxShadow: '0 2px 8px #e3eafc'
                  }}
                  extra={
                    <Space>
                      <Button
                          icon={<EditOutlined />}
                          onClick={() => handleEdit(org)}
                          type="text"
                          style={{ color: '#1a237e' }}
                      />
                      <Popconfirm
                          title="Вы уверены, что хотите удалить организацию?"
                          onConfirm={() => handleDelete(org.id)}
                          okText="Да"
                          cancelText="Нет"
                          disabled={loading.delete}
                      >
                        <Button
                            icon={<DeleteOutlined />}
                            type="text"
                            style={{ color: '#ff4d4f' }}
                            loading={loading.delete && currentDeletingId === org.id}
                        />
                      </Popconfirm>
                      <Button
                          type="dashed"
                          style={{ color: '#1a237e', borderColor: '#e3eafc' }}
                          onClick={() => navigate(`/organization/${org.id}/test`)}
                      >
                        Тест
                      </Button>
                    </Space>
                  }
              >
                <div>
                  <div style={{ marginBottom: 8 }}>
                    <b>Аннотация:</b> {org.annotation}
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <b>Контакты:</b> {org.contacts}
                  </div>
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
              form.resetFields();
            }}
            onOk={() => form.submit()}
            confirmLoading={loading.modal}
            destroyOnClose
        >
          <Form
              form={form}
              onFinish={handleSubmit}
              layout="vertical"
              initialValues={{
                name: '',
                annotation: '',
                contacts: ''
              }}
          >
            <Form.Item
                name="name"
                label="Название"
                rules={[{
                  required: true,
                  message: 'Пожалуйста, введите название организации',
                  whitespace: true
                }]}
            >
              <Input placeholder="Введите название организации" />
            </Form.Item>

            <Form.Item
                name="annotation"
                label="Аннотация"
                rules={[{
                  required: true,
                  message: 'Пожалуйста, введите аннотацию',
                }]}
            >
              <Input.TextArea
                  rows={4}
                  placeholder="Краткое описание организации"
              />
            </Form.Item>

            <Form.Item
                name="contacts"
                label="Контакты"
                rules={[
                  {
                    required: true,
                    message: 'Пожалуйста, введите контактную информацию'
                  },
                  {
                    type: 'url',
                    message: 'Пожалуйста, введите корректный URL'
                  }
                ]}
            >
              <Input placeholder="Сайт или контактные данные" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
  );
};

export default ExpertPanel;