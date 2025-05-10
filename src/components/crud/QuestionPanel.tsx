import React, { useState, useEffect } from 'react';
import {Table, Button, Modal, Form, Select, Input, Spin, notification} from 'antd';
import api from "../../api";
import {Factor, Layer, Question} from "../../types";


const QuestionsAdmin: React.FC = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [layers, setLayers] = useState<Layer[]>([]);
    const [factors, setFactors] = useState<Factor[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [layersRes, factorsRes] = await Promise.all([
                api.get('http://localhost:8080/api/layer'),
                api.get('http://localhost:8080/api/factor')
            ]);

            setLayers(layersRes.data);
            setFactors(factorsRes.data);
            await fetchQuestions();
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            notification.error({
                message: 'Ошибка',
                description: 'Не удалось загрузить данные'
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchQuestions = async () => {
        try {
            const response = await api.get('http://localhost:8080/api/question');
            setQuestions(response.data);
        } catch (error) {
            console.error('Ошибка загрузки вопросов:', error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`http://localhost:8080/api/question/${id}`);
            await fetchInitialData();
        } catch (error) {
            console.error('Ошибка удаления:', error);
        }
    };

    const handleSubmit = async (values: any) => {
        try {
            if (editingQuestion) {
                await api.patch(`http://localhost:8080/api/question/${editingQuestion.id}`, values);
            } else {
                await api.post('http://localhost:8080/api/question', values);
            }
            setIsModalVisible(false);
            await fetchInitialData();
        } catch (error) {
            console.error('Ошибка сохранения:', error);
        }
    };

    const columns = [
        { title: 'Вопрос', dataIndex: 'name', key: 'name' },
        { title: 'Аннотация', dataIndex: 'annotation', key: 'annotation' },
        { title: 'Слой', dataIndex: 'layer', key: 'annotation' },
        {
            title: 'Действия',
            key: 'actions',
            render: (_: any, record: Question) => (
                <>
                    <Button onClick={() => {
                        setEditingQuestion(record);
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
                Добавить вопрос
            </Button>

            <Table
                dataSource={questions}
                columns={columns}
                rowKey="id"
                bordered
            />

            <Modal
                title={editingQuestion ? 'Редактирование вопроса' : 'Новый вопрос'}
                open={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    setEditingQuestion(null);
                    form.resetFields();
                }}
                onOk={() => form.submit()}
                width={800}
            >
                <Form
                    form={form}
                    onFinish={handleSubmit}
                    layout="vertical"
                    initialValues={{
                        layerId: undefined,
                        factorId: undefined
                    }}
                >
                    <Form.Item
                        name="layerId"
                        label="Слой"
                        rules={[{ required: !editingQuestion, message: 'Выберите слой' }]}
                    >
                        <Select
                            showSearch
                            placeholder="Выберите слой"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={layers.map(l => ({
                                value: l.id,
                                label: l.name
                            }))}
                        />
                    </Form.Item>

                    <Form.Item
                        name="factorId"
                        label="Фактор"
                        rules={[{ required: !editingQuestion, message: 'Выберите фактор' }]}
                    >
                        <Select
                            showSearch
                            placeholder="Выберите фактор"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={factors.map(f => ({
                                value: f.id,
                                label: f.name
                            }))}
                        />
                    </Form.Item>

                    <Form.Item
                        name="name"
                        label="Вопрос"
                        rules={[{ required: true, message: 'Введите текст вопроса' }]}
                    >
                        <Input.TextArea rows={3} />
                    </Form.Item>

                    <Form.Item
                        name="annotation"
                        label="Аннотация"
                    >
                        <Input.TextArea rows={2} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default QuestionsAdmin;