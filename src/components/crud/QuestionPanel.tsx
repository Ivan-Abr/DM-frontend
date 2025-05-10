import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Select, Input, Spin, notification } from 'antd';
import  api  from '../../api';
import type { ViewQuestionDTO, CreateQuestionDTO, UpdateQuestionDTO } from '../../types';

interface Layer {
    id: string;
    name: string;
}

interface Factor {
    id: string;
    shortname: string;
    name: string;
}

const QuestionPanel: React.FC = () => {
    const [questions, setQuestions] = useState<ViewQuestionDTO[]>([]);
    const [layers, setLayers] = useState<Layer[]>([]);
    const [factors, setFactors] = useState<Factor[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form] = Form.useForm();

    const API_URL = 'http://localhost:8080/api';

    // Загрузка начальных данных
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [questionsRes, layersRes, factorsRes] = await Promise.all([
                    api.get<ViewQuestionDTO[]>(`${API_URL}/question`),
                    api.get<Layer[]>(`${API_URL}/layer`),
                    api.get<Factor[]>(`${API_URL}/factor`)
                ]);

                setQuestions(questionsRes.data);
                setLayers(layersRes.data);
                setFactors(factorsRes.data);
            } catch (error) {
                notification.error({
                    message: 'Ошибка загрузки данных',
                    description: 'Не удалось загрузить данные с сервера'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Обработчик удаления
    const handleDelete = async (id: string) => {
        try {
            await api.delete(`${API_URL}/question/${id}`);
            setQuestions(prev => prev.filter(q => q.id !== id));
            notification.success({
                message: 'Успешно',
                description: 'Вопрос успешно удален'
            });
        } catch (error) {
            notification.error({
                message: 'Ошибка',
                description: 'Не удалось удалить вопрос'
            });
        }
    };

    // Обработчик сохранения формы
    const handleSubmit = async (values: CreateQuestionDTO | UpdateQuestionDTO) => {
        try {
            if (editingId) {
                // Редактирование существующего вопроса
                await api.patch(`${API_URL}/question/${editingId}`, values);
                setQuestions(prev => prev.map(q =>
                    q.id === editingId ? { ...q, ...values } : q
                ));
            } else {
                // Создание нового вопроса
                const newQuestion = await api.post<ViewQuestionDTO>('${API_URL}/question', values);
                setQuestions(prev => [...prev, newQuestion.data]);
            }

            form.resetFields();
            setEditingId(null);
            notification.success({
                message: 'Успешно',
                description: `Вопрос ${editingId ? 'обновлен' : 'создан'}`
            });
        } catch (error) {
            notification.error({
                message: 'Ошибка',
                description: `Не удалось ${editingId ? 'обновить' : 'создать'} вопрос`
            });
        }
    };

    // Колонки таблицы
    const columns = [
        { title: 'Вопрос', dataIndex: 'name', key: 'name' },
        { title: 'Слой', dataIndex: 'layerName', key: 'layerName' },
        { title: 'Фактор', dataIndex: 'factorShortname', key: 'factorShortname' },
        { title: 'Аннотация', dataIndex: 'annotation', key: 'annotation' },
        {
            title: 'Действия',
            key: 'actions',
            render: (_: any, record: ViewQuestionDTO) => (
                <div className="flex gap-2">
                    <Button onClick={() => {
                        const layer = layers.find(l => l.name === record.layerName);
                        const factor = factors.find(f => f.shortname === record.factorShortname);

                        form.setFieldsValue({
                            ...record,
                            layerId: layer?.id,
                            factorId: factor?.id
                        });
                        setEditingId(record.id);
                    }}>
                        Редактировать
                    </Button>
                    <Button danger onClick={() => handleDelete(record.id)}>
                        Удалить
                    </Button>
                </div>
            )
        }
    ];

    return (
        <div className="p-4">
            <Spin spinning={loading}>
                <div className="mb-4 flex justify-end">
                    <Button
                        type="primary"
                        onClick={() => {
                            form.resetFields();
                            setEditingId(null);
                        }}
                    >
                        Добавить вопрос
                    </Button>
                </div>

                <Table
                    dataSource={questions}
                    columns={columns}
                    rowKey="id"
                    bordered
                    pagination={{ pageSize: 10 }}
                />

                {/* Модальное окно для создания/редактирования */}
                <Modal
                    title={`${editingId ? 'Редактирование' : 'Создание'} вопроса`}
                    open={!!editingId || form.isFieldsTouched()}
                    onCancel={() => {
                        form.resetFields();
                        setEditingId(null);
                    }}
                    onOk={form.submit}
                    destroyOnClose
                    width={800}
                >
                    <Form
                        form={form}
                        onFinish={handleSubmit}
                        layout="vertical"
                        initialValues={{ annotation: '' }}
                    >
                        <Form.Item
                            name="layerId"
                            label="Слой"
                            rules={[{ required: !editingId, message: 'Выберите слой' }]}
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
                            rules={[{ required: !editingId, message: 'Выберите фактор' }]}
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
                                    label: `${f.shortname} - ${f.name}`
                                }))}
                            />
                        </Form.Item>

                        <Form.Item
                            name="name"
                            label="Текст вопроса"
                            rules={[
                                { required: true, message: 'Введите текст вопроса' },
                                { max: 500, message: 'Максимальная длина 500 символов' }
                            ]}
                        >
                            <Input.TextArea rows={3} showCount />
                        </Form.Item>

                        <Form.Item
                            name="annotation"
                            label="Дополнительная информация"
                            rules={[{ max: 300, message: 'Максимальная длина 300 символов' }]}
                        >
                            <Input.TextArea rows={2} showCount />
                        </Form.Item>
                    </Form>
                </Modal>
            </Spin>
        </div>
    );
};

export default QuestionPanel;