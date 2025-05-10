import {useEffect, useState} from "react";
import {Layer} from "../../types";
import {Button, Form, Input, Modal, Table} from "antd";
import api from "../../api";


const LayersAdmin: React.FC = () => {
    const [layers, setLayers] = useState<Layer[]>([]);
    const [editLayer, setEditLayer] = useState<Layer | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchLayers();
    }, []);

    const fetchLayers = async () => {
        try {
            const response = await api
                .get('http://localhost:8080/api/layer');
            setLayers(response.data);
        } catch (error) {
            console.error('Ошибка загрузки слоев: ', error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`http://localhost:8080/api/layer/${id}`)
            await fetchLayers();
        } catch (error) {
            console.error('Ошибка удаления:', error);
        }
    };

    const handleSubmit = async (values: { name: string }) => {
        try {
            if (editLayer) {
                await api.patch(`http://localhost:8080/api/layer/${editLayer.id}`, values);
            } else {
                await api.post('http://localhost:8080/api/layer', values);
            }
            setIsModalVisible(false);
            await fetchLayers();
        } catch (error) {
            console.error('Ошибка сохранения:', error);
        }
    };

    const columns = [
        { title: 'Название', dataIndex: 'name', key: 'name' },
        {
            title: 'Действия',
            key: 'actions',
            render: (_: any, record: Layer) => (
                <>
                    <Button onClick={() => {
                        setEditLayer(record);
                        form.setFieldsValue(record);
                        setIsModalVisible(true);
                    }}>
                        Редактировать
                    </Button>
                    <Button danger onClick={() => handleDelete(record.id)}>
                        Удалить
                    </Button>
                </>
            )
        }
    ];

    return (
        <div>
            <Button type="primary" onClick={() => setIsModalVisible(true)}>
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
export default LayersAdmin;