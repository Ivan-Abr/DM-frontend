import { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Table, Select, InputNumber, Space, Tag, Divider } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import api from "../../api";
import { Layer, Factor, ViewQuestionDTO, ViewMarkDTO, CreateMarkDTO, UpdateMarkDTO } from "../../types";
import { defaultMarks } from '../../data/defaultMarks';

const { Option } = Select;

const QuestionPanel: React.FC = () => {
    const [questions, setQuestions] = useState<ViewQuestionDTO[]>([]);
    const [layers, setLayers] = useState<Layer[]>([]);
    const [factors, setFactors] = useState<Factor[]>([]);
    const [editQuestion, setEditQuestion] = useState<ViewQuestionDTO | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const [marks, setMarks] = useState<ViewMarkDTO[]>([]);
    const [editMark, setEditMark] = useState<ViewMarkDTO | null>(null);
    const [isMarkModalVisible, setIsMarkModalVisible] = useState(false);
    const [markForm] = Form.useForm();
    const [markFormInitialValues, setMarkFormInitialValues] = useState({});

    const [selectedLayer, setSelectedLayer] = useState<string | undefined>(undefined);
    const [selectedFactor, setSelectedFactor] = useState<string | undefined>(undefined);

    useEffect(() => {
        fetchQuestions();
        fetchLayers();
        fetchFactors();
    }, []);

    const fetchQuestions = async () => {
        try {
            const response = await api.get("http://localhost:8080/api/question");
            setQuestions(response.data);
            // Fetch marks for each question
            const marksPromises = response.data.map((question: ViewQuestionDTO) =>
                api.get(`http://localhost:8080/api/mark/question/${question.id}`)
            );
            const marksResponses = await Promise.all(marksPromises);
            const allMarks = marksResponses.flatMap(response => response.data);
            setMarks(allMarks);
        } catch (error) {
            console.error("Ошибка загрузки показателей: ", error);
        }
    };

    const fetchLayers = async () => {
        try {
            const response = await api.get("http://localhost:8080/api/layer");
            setLayers(response.data);
        } catch (error) {
            console.error("Ошибка загрузки слоев: ", error);
        }
    };

    const fetchFactors = async () => {
        try {
            const response = await api.get("http://localhost:8080/api/factor");
            setFactors(response.data);
        } catch (error) {
            console.error("Ошибка загрузки факторов: ", error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`http://localhost:8080/api/question/${id}`);
            await fetchQuestions();
        } catch (error) {
            console.error("Ошибка удаления:", error);
        }
    };

    const handleSubmit = async (values: any) => {
        try {
            const updateData = {
                name: values.name,
                annotation: values.annotation,
                layerId: values.layerId,
                factorId: values.factorId
            };

            if (editQuestion) {
                await api.patch(`http://localhost:8080/api/question/${editQuestion.id}`, updateData);
            } else {
                await api.post("http://localhost:8080/api/question", updateData);
            }
            setIsModalVisible(false);
            setEditQuestion(null);
            form.resetFields();
            await fetchQuestions();
        } catch (error) {
            console.error("Ошибка сохранения:", error);
        }
    };

    const handleMarkDelete = async (id: string) => {
        try {
            await api.delete(`http://localhost:8080/api/mark/${id}`);
            await fetchQuestions();
        } catch (error) {
            console.error("Ошибка удаления оценки:", error);
        }
    };

    const handleMarkSubmit = async (values: CreateMarkDTO | UpdateMarkDTO) => {
        try {
            console.log('Form values:', values);
            if (editMark) {
                console.log('Updating mark:', editMark.id, values);
                await api.patch(`http://localhost:8080/api/mark/${editMark.id}`, values);
            } else {
                const formValues = markForm.getFieldsValue();
                console.log('All form values:', formValues);
                
                const createMarkData: CreateMarkDTO = {
                    questionId: formValues.questionId,
                    annotation: values.annotation!,
                    value: values.value!
                };
                console.log('Creating new mark with data:', createMarkData);
                const response = await api.post("http://localhost:8080/api/mark", createMarkData);
                console.log('Server response:', response.data);
            }
            setIsMarkModalVisible(false);
            setEditMark(null);
            markForm.resetFields();
            await fetchQuestions();
        } catch (error: any) {
            console.error("Ошибка сохранения оценки:", error);
            console.error("Request data:", error.config?.data);
            console.error("Response data:", error.response?.data);
            console.error("Response status:", error.response?.status);
        }
    };

    const handleAddMark = (questionId: string) => {
        setEditMark(null);
        markForm.setFieldsValue({ questionId });
        setIsMarkModalVisible(true);
    };

    const handleEditMark = (mark: ViewMarkDTO) => {
        setEditMark(mark);
        markForm.setFieldsValue({
            questionId: mark.questionId,
            annotation: mark.annotation,
            value: mark.value
        });
        setIsMarkModalVisible(true);
    };

    const filteredQuestions = questions.filter(q => {
        const layerOk = !selectedLayer || q.layerName === layers.find(l => l.id === selectedLayer)?.name;
        const factorOk = !selectedFactor || q.factorShortname === factors.find(f => f.id === selectedFactor)?.shortname;
        return layerOk && factorOk;
    });

    const columns = [
        { title: "Название", dataIndex: "name", key: "name" },
        { title: "Слой", dataIndex: "layerName", key: "layerName" },
        { title: "Фактор", dataIndex: "factorShortname", key: "factorShortname" },
        { title: "Аннотация", dataIndex: "annotation", key: "annotation" },
        {
            title: "Оценки",
            key: "marks",
            render: (_: any, record: ViewQuestionDTO) => {
                const questionMarks = marks.filter(mark => mark.questionId === record.id);
                return (
                    <Space direction="vertical" size="small">
                        {questionMarks.map((mark, idx) => (
                            <div key={mark.id || idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontWeight: 500, color: '#1a237e' }}>{mark.value}</span>
                                <span>{mark.annotation}</span>
                            </div>
                        ))}
                    </Space>
                );
            }
        },
        {
            title: "Действия",
            key: "actions",
            render: (_: any, record: ViewQuestionDTO) => (
                <Space>
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => {
                            setEditQuestion(record);
                            const layer = layers.find(l => l.name === record.layerName);
                            const factor = factors.find(f => f.shortname === record.factorShortname);
                            form.setFieldsValue({
                                name: record.name,
                                annotation: record.annotation,
                                layerId: layer?.id,
                                factorId: factor?.id,
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
                setEditQuestion(null);
                form.resetFields();
                setIsModalVisible(true);
            }} style={{ marginBottom: 24, background: '#1a237e', borderColor: '#1a237e' }}>
                Добавить показатель
            </Button>
            <Table
                dataSource={filteredQuestions}
                columns={columns}
                rowKey="id"
            />
            <Modal
                title={editQuestion ? "Редактирование показателя" : "Новый показатель"}
                open={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    setEditQuestion(null);
                    form.resetFields();
                }}
                onOk={() => form.submit()}
                bodyStyle={{ background: '#fff' }}
                width={800}
            >
                <Form form={form} onFinish={handleSubmit} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Название"
                        rules={[{ required: true, message: "Введите название" }]}
                    >
                        <Input />
                    </Form.Item>
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
                        name="factorId"
                        label="Фактор"
                        rules={[{ required: true, message: "Выберите фактор" }]}
                    >
                        <Select placeholder="Выберите фактор">
                            {factors.map(factor => (
                                <Option key={factor.id} value={factor.id}>{factor.shortname}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="annotation"
                        label="Аннотация"
                    >
                        <Input.TextArea />
                    </Form.Item>

                    {editQuestion && (
                        <>
                            <Divider>Оценки</Divider>
                            <div style={{ marginBottom: 16 }}>
                                <Button 
                                    type="primary" 
                                    icon={<PlusOutlined />}
                                    onClick={() => handleAddMark(editQuestion.id)}
                                    style={{ background: '#1a237e', borderColor: '#1a237e' }}
                                >
                                    Добавить оценку
                                </Button>
                            </div>
                            <Table
                                dataSource={marks.filter(mark => mark.questionId === editQuestion.id)}
                                rowKey="id"
                                pagination={false}
                                columns={[
                                    {
                                        title: "Значение",
                                        dataIndex: "value",
                                        key: "value",
                                        width: 100,
                                    },
                                    {
                                        title: "Аннотация",
                                        dataIndex: "annotation",
                                        key: "annotation",
                                    },
                                    {
                                        title: "Действия",
                                        key: "actions",
                                        width: 100,
                                        render: (_: any, record: ViewMarkDTO) => (
                                            <Space>
                                                <Button
                                                    type="text"
                                                    icon={<EditOutlined />}
                                                    onClick={() => handleEditMark(record)}
                                                />
                                                <Button
                                                    type="text"
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                    onClick={() => handleMarkDelete(record.id)}
                                                />
                                            </Space>
                                        ),
                                    },
                                ]}
                            />
                        </>
                    )}
                </Form>
            </Modal>

            <Modal
                title={editMark ? "Редактирование оценки" : "Новая оценка"}
                open={isMarkModalVisible}
                onCancel={() => {
                    setIsMarkModalVisible(false);
                    setEditMark(null);
                    markForm.resetFields();
                }}
                onOk={() => markForm.submit()}
            >
                <Form
                    form={markForm}
                    initialValues={markFormInitialValues}
                    onFinish={handleMarkSubmit}
                    layout="vertical"
                    onValuesChange={(changedValues, allValues) => {
                        console.log('Form values changed:', changedValues);
                        console.log('All form values:', allValues);
                    }}
                >
                    <Form.Item name="questionId" style={{ display: 'none' }}>
                        <Input type="hidden" />
                    </Form.Item>
                    <Form.Item
                        name="annotation"
                        label="Аннотация"
                        rules={[{ required: true, message: "Введите аннотацию" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="value"
                        label="Значение"
                        rules={[{ required: true, message: "Введите значение" }]}
                    >
                        <InputNumber />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default QuestionPanel; 