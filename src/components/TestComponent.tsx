import React, { useEffect, useState } from 'react';
import { Card, Button, Radio, Space, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import { ViewQuestionDTO, ViewMarkDTO } from '../types';

interface AnswerRequest {
    organizationId: string;
    markId: string;
    milestoneId: string | null;
}

const TestComponent: React.FC = () => {
    const [questions, setQuestions] = useState<ViewQuestionDTO[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [currentMarks, setCurrentMarks] = useState<ViewMarkDTO[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { organizationId } = useParams();

    useEffect(() => {
        fetchQuestions();
    }, []);

    useEffect(() => {
        if (questions.length > 0) {
            fetchMarksForQuestion(questions[currentQuestionIndex].id);
            setSelectedAnswer(null);
        }
    }, [currentQuestionIndex, questions]);

    const fetchQuestions = async () => {
        try {
            const response = await api.get("http://localhost:8080/api/question");
            setQuestions(response.data);
        } catch (error) {
            message.error("Ошибка загрузки вопросов");
        }
    };

    const fetchMarksForQuestion = async (questionId: string) => {
        try {
            const response = await api.get(`http://localhost:8080/api/mark/question/${questionId}`);
            setCurrentMarks(response.data);
        } catch (error) {
            message.error("Ошибка загрузки вариантов ответа");
        }
    };

    const saveAnswer = async (markId: string) => {
        if (!organizationId) {
            message.error("ID организации не найден");
            return false;
        }

        try {
            const answerData: AnswerRequest = {
                organizationId: organizationId,
                markId: markId,
                milestoneId: null
            };

            await api.post('http://localhost:8080/api/answer', answerData);
            return true;
        } catch (error) {
            console.error('Error saving answer:', error);
            message.error("Ошибка при сохранении ответа");
            return false;
        }
    };

    const handleAnswer = async () => {
        if (selectedAnswer === null) {
            message.warning("Пожалуйста, выберите ответ");
            return;
        }

        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true);

        try {
            const currentQuestion = questions[currentQuestionIndex];
            const selectedMark = currentMarks.find(mark => mark.value === selectedAnswer);

            if (!selectedMark) {
                message.error("Ошибка: выбранный ответ не найден");
                return;
            }

            const isSaved = await saveAnswer(selectedMark.id);

            if (isSaved) {
                if (currentQuestionIndex < questions.length - 1) {
                    setCurrentQuestionIndex(currentQuestionIndex + 1);
                } else {
                    message.success("Тестирование завершено");
                    navigate(`/organization/${organizationId}`);
                }
            }
        } catch (error) {
            console.error('Error handling answer:', error);
            message.error("Произошла ошибка при обработке ответа");
        } finally {
            setIsSubmitting(false);
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
                                {currentMarks.map((mark) => (
                                    <Radio key={mark.id} value={mark.value}>
                                        {mark.annotation}
                                    </Radio>
                                ))}
                            </Space>
                        </Radio.Group>
                        <div style={{ marginTop: 24, textAlign: 'right' }}>
                            <Button
                                type="primary"
                                onClick={handleAnswer}
                                loading={isSubmitting}
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