import React, { useEffect, useState } from 'react';
import { Card, Button, Radio, Space, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import { ViewQuestionDTO } from '../types';

const defaultMarks = [
    { value: 0, annotation: 'Вербально, "на ходу"' },
    { value: 1, annotation: 'Задачи ставятся с помощью Email, мессенджеров, телефонных звонков' },
    { value: 2, annotation: 'Применяется набор средств автоматизации постановки задач, например, система электронного документооборота, Битрикс 24 и др.' },
    { value: 3, annotation: 'Комплексная интегрированная система с элементами искусственного интеллекта и цифровыми сервисами (BI-системы)' }
];

const TestComponent: React.FC = () => {
    const [questions, setQuestions] = useState<ViewQuestionDTO[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [answers, setAnswers] = useState<{ [key: string]: number }>({});
    const navigate = useNavigate();
    const { organizationId } = useParams();

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const response = await api.get("http://localhost:8080/api/question");
            setQuestions(response.data);
        } catch (error) {
            message.error("Ошибка загрузки вопросов");
        }
    };

    const handleAnswer = () => {
        if (selectedAnswer === null) {
            message.warning("Пожалуйста, выберите ответ");
            return;
        }

        const currentQuestion = questions[currentQuestionIndex];
        setAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: selectedAnswer
        }));

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer(null);
        } else {
            // Save results and navigate to organization panel
            saveResults();
            navigate(`/organization/${organizationId}`);
        }
    };

    const saveResults = async () => {
        try {
            // Here you would implement the logic to save the test results
            // This could be a new API endpoint to save the organization's test results
            message.success("Результаты тестирования сохранены");
        } catch (error) {
            message.error("Ошибка при сохранении результатов");
        }
    };

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div style={{ maxWidth: 800, margin: '40px auto', padding: 24 }}>
            <Card
                title={`Вопрос ${currentQuestionIndex + 1} из ${questions.length}`}
                style={{ marginBottom: 24 }}
            >
                {currentQuestion && (
                    <>
                        <div style={{ marginBottom: 24 }}>
                            <h3>{currentQuestion.name}</h3>
                            <p>{currentQuestion.annotation}</p>
                        </div>
                        <Radio.Group
                            onChange={(e) => setSelectedAnswer(e.target.value)}
                            value={selectedAnswer}
                        >
                            <Space direction="vertical">
                                {defaultMarks.map((mark, index) => (
                                    <Radio key={index} value={mark.value}>
                                        {mark.annotation}
                                    </Radio>
                                ))}
                            </Space>
                        </Radio.Group>
                        <div style={{ marginTop: 24, textAlign: 'right' }}>
                            <Button
                                type="primary"
                                onClick={handleAnswer}
                                style={{ background: '#1a237e', borderColor: '#1a237e' }}
                            >
                                {currentQuestionIndex < questions.length - 1 ? 'Следующий вопрос' : 'Завершить тест'}
                            </Button>
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
};

export default TestComponent; 