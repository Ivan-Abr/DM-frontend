import { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Table, Select, InputNumber, Space } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import api from "../../api";
import { Layer, ViewRecommendationDTO, CreateRecommendationDTO, UpdateRecommendationDTO } from "../../types";
import { API_ENDPOINTS } from "../../config";

const { Option } = Select;

const RecommendationPanel: React.FC = () => {
    const [recommendations, setRecommendations] = useState<ViewRecommendationDTO[]>([]);
    const [layers, setLayers] = useState<Layer[]>([]);
    const [editRecommendation, setEditRecommendation] = useState<ViewRecommendationDTO | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const [selectedLayer, setSelectedLayer] = useState<string | undefined>(undefined);

    useEffect(() => {
        fetchRecommendations();
        fetchLayers();
    }, []);

    const fetchRecommendations = async () => {
        try {
            const response = await api.get(API_ENDPOINTS.RECOMMENDATION.BASE);
            console.log('Полученные данные с сервера:', response.data);
            // Проверяем наличие id в каждой записи
            const recommendationsWithId = response.data.map((rec: any) => {
                if (!rec.id) {
                    console.error('Запись без id:', rec);
                }
                return rec;
            });
            setRecommendations(recommendationsWithId);
        } catch (error) {
            console.error("Ошибка загрузки рекомендаций: ", error);
        }
    };

    const fetchLayers = async () => {
        try {
            const response = await api.get(API_ENDPOINTS.LAYER.BASE);
            setLayers(response.data);
        } catch (error) {
            console.error("Ошибка загрузки слоев: ", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!id) {
            console.error("ID не может быть пустым");
            return;
        }
        try {
            const url = API_ENDPOINTS.RECOMMENDATION.BY_ID(id);
            console.log('URL для удаления:', url);
            console.log('ID для удаления:', id);
            await api.delete(url);
            await fetchRecommendations();
        } catch (error) {
            console.error("Ошибка удаления:", error);
        }
    };

    const handleSubmit = async (values: any) => {
        try {
            const updateData = {
                layerId: values.layerId,
                value: values.value,
                annotation: values.annotation
            };

            if (editRecommendation) {
                const url = API_ENDPOINTS.RECOMMENDATION.BY_ID(editRecommendation.id);
                console.log('URL для обновления:', url);
                console.log('ID для обновления:', editRecommendation.id);
                console.log('Данные для обновления:', updateData);
                await api.patch(url, updateData);
            } else {
                console.log('URL для создания:', API_ENDPOINTS.RECOMMENDATION.BASE);
                console.log('Данные для создания:', updateData);
                await api.post(API_ENDPOINTS.RECOMMENDATION.BASE, updateData);
            }
            setIsModalVisible(false);
            setEditRecommendation(null);
            form.resetFields();
            await fetchRecommendations();
        } catch (error) {
            console.error("Ошибка сохранения:", error);
        }
    };

    const filteredRecommendations = recommendations.filter(r => {
        return !selectedLayer || r.layerName === layers.find(l => l.id === selectedLayer)?.name;
    });

    const columns = [
        { title: "Слой", dataIndex: "layerName", key: "layerName" },
        {
            title: "Значение",
            dataIndex: "value",
            key: "value",
            render: (value: number) => Number(value.toFixed(2)).toString()
        },
        { title: "Аннотация", dataIndex: "annotation", key: "annotation" },
        {
            title: "Действия",
            key: "actions",
            render: (_: any, record: ViewRecommendationDTO) => (
                <Space>
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => {
                            setEditRecommendation(record);
                            const layer = layers.find(l => l.name === record.layerName);
                            form.setFieldsValue({
                                layerId: layer?.id,
                                value: record.value,
                                annotation: record.annotation,
                            });
                            setIsModalVisible(true);
                        }}
                    />
                    <Button 
                        type="text" 
                        danger 
                        icon={<DeleteOutlined />} 
                        onClick={() => handleDelete(record.id)}
                    />
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '32px 0 0 0', background: '#f5f7fa', minHeight: '100vh' }}>
            <Button type="primary" onClick={() => {
                setEditRecommendation(null);
                form.resetFields();
                setIsModalVisible(true);
            }} style={{ marginBottom: 24, background: '#1a237e', borderColor: '#1a237e' }}>
                Добавить рекомендацию
            </Button>
            <Table
                dataSource={filteredRecommendations}
                columns={columns}
                rowKey="id"
            />
            <Modal
                title={editRecommendation ? "Редактирование рекомендации" : "Новая рекомендация"}
                open={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    setEditRecommendation(null);
                    form.resetFields();
                }}
                onOk={() => form.submit()}
                bodyStyle={{ background: '#fff' }}
                width={800}
            >
                <Form form={form} onFinish={handleSubmit} layout="vertical">
                    <Form.Item
                        name="layerId"
                        label="Слой"
                        rules={[{ required: true, message: "Выберите слой" }]}
                    >
                        <Select placeholder="Выберите слой">
                            {layers.map(layer => (
                                <Option key={layer.id} value={layer.id}>{layer.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="value"
                        label="Значение"
                        rules={[{ required: true, message: "Введите значение" }]}
                    >
                        <InputNumber step={0.1} />
                    </Form.Item>
                    <Form.Item
                        name="annotation"
                        label="Аннотация"
                        rules={[{ required: true, message: "Введите аннотацию" }]}
                    >
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default RecommendationPanel;
