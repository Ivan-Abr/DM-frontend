import {useEffect, useState} from "react";
import {Button, Form, DatePicker, InputNumber, Modal, Table} from "antd";
import api from "../../api";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

interface Milestone {
    id: string;
    dateFrom: string;
    dateTo: string;
    year: number;
}

interface CreateMilestoneDTO {
    dateFrom: string;
    dateTo: string;
    year: number;
}

interface UpdateMilestoneDTO {
    dateFrom?: string;
    dateTo?: string;
    year?: number;
}

const MilestonePanel: React.FC = () => {
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [editMilestone, setEditMilestone] = useState<Milestone | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchMilestones();
    }, []);

    const fetchMilestones = async () => {
        try {
            const response = await api.get('http://localhost:8080/api/milestone');
            setMilestones(response.data);
        } catch (error) {
            console.error('Ошибка загрузки вех: ', error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`http://localhost:8080/api/milestone/${id}`);
            await fetchMilestones();
        } catch (error) {
            console.error('Ошибка удаления:', error);
        }
    };

    const handleSubmit = async (values: any) => {
        try {
            const formattedValues = {
                dateFrom: values.dateFrom.format('YYYY-MM-DD'),
                dateTo: values.dateTo.format('YYYY-MM-DD'),
                year: values.year
            };

            if (editMilestone) {
                await api.patch(`http://localhost:8080/api/milestone/${editMilestone.id}`, formattedValues);
            } else {
                await api.post('http://localhost:8080/api/milestone', formattedValues);
            }
            setIsModalVisible(false);
            await fetchMilestones();
        } catch (error) {
            console.error('Ошибка сохранения:', error);
        }
    };

    const columns = [
        {
            title: 'Дата начала',
            dataIndex: 'dateFrom',
            key: 'dateFrom',
            render: (date: string) => dayjs(date).format('DD.MM.YYYY')
        },
        {
            title: 'Дата окончания',
            dataIndex: 'dateTo',
            key: 'dateTo',
            render: (date: string) => dayjs(date).format('DD.MM.YYYY')
        },
        {
            title: 'Год',
            dataIndex: 'year',
            key: 'year'
        },
        {
            title: 'Действия',
            key: 'actions',
            render: (_: any, record: Milestone) => (
                <>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => {
                            setEditMilestone(record);
                            form.setFieldsValue({
                                ...record,
                                dateFrom: dayjs(record.dateFrom),
                                dateTo: dayjs(record.dateTo)
                            });
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
            <Button
                type="primary"
                onClick={() => setIsModalVisible(true)}
                style={{ marginBottom: 24, background: '#1a237e', borderColor: '#1a237e' }}
            >
                Добавить веху
            </Button>
            <Table dataSource={milestones} columns={columns} rowKey="id" />
            <Modal
                title={editMilestone ? 'Редактирование вехи' : 'Новая веха'}
                open={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    setEditMilestone(null);
                    form.resetFields();
                }}
                onOk={() => form.submit()}
                bodyStyle={{ background: '#fff' }}
            >
                <Form form={form} onFinish={handleSubmit}>
                    <Form.Item
                        name="dateFrom"
                        label="Дата начала"
                        rules={[{ required: true, message: 'Выберите дату начала' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        name="dateTo"
                        label="Дата окончания"
                        rules={[{ required: true, message: 'Выберите дату окончания' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        name="year"
                        label="Год"
                        rules={[{ required: true, message: 'Введите год' }]}
                    >
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default MilestonePanel;