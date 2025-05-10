import { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Table, Select } from "antd";
import api from "../../api";
import { Layer, Factor, ViewQuestionDTO, CreateQuestionDTO, UpdateQuestionDTO } from "../../types";

const { Option } = Select;

const QuestionPanel: React.FC = () => {
    const [questions, setQuestions] = useState<ViewQuestionDTO[]>([]);
    const [layers, setLayers] = useState<Layer[]>([]);
    const [factors, setFactors] = useState<Factor[]>([]);
    const [editQuestion, setEditQuestion] = useState<any | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchQuestions();
        fetchLayers();
        fetchFactors();
    }, []);

    const fetchQuestions = async () => {
        try {
            const response = await api.get("http://localhost:8080/api/question");
            setQuestions(response.data);
        } catch (error) {
            console.error("Ошибка загрузки вопросов: ", error);
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
            if (editQuestion) {
                await api.patch(`http://localhost:8080/api/question/${editQuestion.id}`, values);
            } else {
                await api.post("http://localhost:8080/api/question", values);
            }
            setIsModalVisible(false);
            setEditQuestion(null);
            form.resetFields();
            await fetchQuestions();
        } catch (error) {
            console.error("Ошибка сохранения:", error);
        }
    };

    const columns = [
        { title: "Название", dataIndex: "name", key: "name" },
        { title: "Слой", dataIndex: "layerName", key: "layerName" },
        { title: "Фактор", dataIndex: "factorShortname", key: "factorShortname" },
        { title: "Аннотация", dataIndex: "annotation", key: "annotation" },
        {
            title: "Действия",
            key: "actions",
            render: (_: any, record: any) => (
                <>
                    <Button
                        onClick={() => {
                            setEditQuestion(record);
                            // Найти id слоя и фактора по имени/shortname
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
                    >
                        Редактировать
                    </Button>
                    <Button danger onClick={() => handleDelete(record.id)}>
                        Удалить
                    </Button>
                </>
            ),
        },
    ];

    return (
        <div>
            <Button type="primary" onClick={() => {
                setEditQuestion(null);
                form.resetFields();
                setIsModalVisible(true);
            }}>
                Добавить вопрос
            </Button>

            <Table dataSource={questions} columns={columns} rowKey="id" />

            <Modal
                title={editQuestion ? "Редактирование вопроса" : "Новый вопрос"}
                open={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    setEditQuestion(null);
                    form.resetFields();
                }}
                onOk={() => form.submit()}
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
                </Form>
            </Modal>
        </div>
    );
};

export default QuestionPanel; 