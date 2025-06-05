import {useEffect, useState} from "react";
import {Factor, FactorUpt} from "../../types";
import {Button, Form, Input, Modal, Table} from "antd";
import api from "../../api";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';


const FactorPanel: React.FC = () => {
    const [factors, setFactors] = useState<Factor[]>([]);
    const [editFactor, setEditFactor] = useState<FactorUpt | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchFactors();
    }, []);

    const fetchFactors = async () => {
        try {
            const response = await api
                .get('http://localhost:8080/api/factor');
            setFactors(response.data);
        } catch (error) {
            console.error('Ошибка загрузки слоев: ', error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`http://localhost:8080/api/factor/${id}`)
            await fetchFactors();
        } catch (error) {
            console.error('Ошибка удаления:', error);
        }
    };

    const handleSubmit = async (values: { name: string }) => {
        try {
            if (editFactor) {
                await api.patch(`http://localhost:8080/api/factor/${editFactor.id}`, values);
            } else {
                await api.post('http://localhost:8080/api/factor', values);
            }
            setIsModalVisible(false);
            await fetchFactors();
        } catch (error) {
            console.error('Ошибка сохранения:', error);
        }
    };

    const columns = [
        { title: 'Название', dataIndex: 'name', key: 'name' },
        { title: 'Краткое наименование', dataIndex: 'shortname', key: 'shortname' },
        {
            title: 'Действия',
            key: 'actions',
            render: (_: any, record: Factor) => (
                <>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => {
                            setEditFactor(record);
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
            <Button type="primary" onClick={() => setIsModalVisible(true)} style={{ marginBottom: 24, background: '#1a237e', borderColor: '#1a237e' }}>
                Добавить фактор
            </Button>
            <Table dataSource={factors} columns={columns} rowKey="id" />
            <Modal
                title={editFactor ? 'Редактирование фактора' : 'Новый фактор'}
                open={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    setEditFactor(null);
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
                    <Form.Item
                        name="shortname"
                        label="Краткое наименование"
                        rules={[{ required: true, message: 'Введите краткое наименование' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
export default FactorPanel;