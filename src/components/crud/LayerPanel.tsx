import {useEffect, useState} from "react";
import {Layer} from "../../types";
import {Button, Form, Input, Modal, Table, Space} from "antd";
import api from "../../api";
import { EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from "../../config";


const LayerPanel: React.FC = () => {
    const [layers, setLayers] = useState<Layer[]>([]);
    const [editLayer, setEditLayer] = useState<Layer | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    useEffect(() => {
        fetchLayers();
    }, []);

    const fetchLayers = async () => {
        try {
            const response = await api
                .get(API_ENDPOINTS.LAYER.BASE);
            setLayers(response.data);
        } catch (error) {
            console.error("Ошибка загрузки слоев: ", error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await api.delete(API_ENDPOINTS.LAYER.BY_ID(id))
            await fetchLayers();
        } catch (error) {
            console.error("Ошибка удаления:", error);
        }
    };

    const handleSubmit = async (values: any) => {
        try {
            if (editLayer) {
                await api.patch(API_ENDPOINTS.LAYER.BY_ID(editLayer.id), values);
            } else {
                await api.post(API_ENDPOINTS.LAYER.BASE, values);
            }
            setIsModalVisible(false);
            setEditLayer(null);
            form.resetFields();
            await fetchLayers();
        } catch (error) {
            console.error("Ошибка сохранения:", error);
        }
    };

    const showModal = () => {
        setEditLayer(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const columns = [
        { title: 'Название', dataIndex: 'name', key: 'name' },
        {
            title: 'Действия',
            key: 'actions',
            render: (_: any, record: Layer) => (
                <>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => {
                            setEditLayer(record);
                            form.setFieldsValue(record);
                            setIsModalVisible(true);
                        }}
                        type="text"
                        style={{ color: '#1a237e' }}
                    />
                    <Button
                        icon={<DeleteOutlined />}
                        danger
                        type="text"
                        style={{ color: '#607d8b' }}
                        onClick={() => handleDelete(record.id)}
                    />
                </>
            )
        }
    ];

    return (
        <div style={{ padding: '32px 0 0 0', background: '#f5f7fa', minHeight: '100vh' }}>
            <Button type="primary" onClick={showModal} style={{ marginBottom: 24, background: '#1a237e', borderColor: '#1a237e' }}>
                Добавить слой
            </Button>
            <Table dataSource={layers} columns={columns} rowKey="id" />
            <Modal
                title={editLayer ? 'Редактирование слоя' : 'Новый слой'}
                open={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    setEditLayer(null);
                    form.resetFields();
                }}
                onOk={() => form.submit()}
                bodyStyle={{ background: '#fff' }}
            >
                <Form form={form} onFinish={handleSubmit}>
                    <Form.Item
                        name="name"
                        label="Название"
                        rules={[{ required: true, message: 'Введите название' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
export default LayerPanel;