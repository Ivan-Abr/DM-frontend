import React, { useEffect, useState } from 'react';
import { Card, Button, Radio, Space, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import { ViewQuestionDTO, ViewMarkDTO } from '../types';

const TestComponent: React.FC = () => {
    const [questions, setQuestions] = useState<ViewQuestionDTO[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [answers, setAnswers] = useState<{ [key: string]: number }>({});
    const [currentMarks, setCurrentMarks] = useState<ViewMarkDTO[]>([]);
    const navigate = useNavigate();
    const { organizationId } = useParams();

    useEffect(() => {
        fetchQuestions();
    }, []);

    useEffect(() => {
        console.log('Current question index changed:', currentQuestionIndex);
        if (questions.length > 0) {
            console.log('Fetching marks for question:', questions[currentQuestionIndex].id);
            fetchMarksForQuestion(questions[currentQuestionIndex].id);
            setSelectedAnswer(null);
        }
    }, [currentQuestionIndex, questions]);

    const fetchQuestions = async () => {
        try {
            const response = await api.get("http://localhost:8080/api/question");
            console.log('Fetched questions:', response.data);
            setQuestions(response.data);
        } catch (error) {
            console.error('Error fetching questions:', error);
            message.error("Ошибка загрузки вопросов");
        }
    };

    const fetchMarksForQuestion = async (questionId: string) => {
        try {
            const response = await api.get(`http://localhost:8080/api/mark/question/${questionId}`);
            console.log('Fetched marks for question:', response.data);
            setCurrentMarks(response.data);
        } catch (error) {
            console.error('Error fetching marks:', error);
            message.error("Ошибка загрузки вариантов ответа");
        }
    };

    const handleAnswer = () => {
        console.log('Handling answer:', { selectedAnswer, currentQuestionIndex });
        
        if (selectedAnswer === null) {
            message.warning("Пожалуйста, выберите ответ");
            return;
        }

        const currentQuestion = questions[currentQuestionIndex];
        console.log('Current question:', currentQuestion);

        // Сохраняем ответ
        setAnswers(prev => {
            const newAnswers = {
                ...prev,
                [currentQuestion.id]: selectedAnswer
            };
            console.log('Updated answers:', newAnswers);
            return newAnswers;
        });

        // Переходим к следующему вопросу или завершаем тест
        if (currentQuestionIndex < questions.length - 1) {
            console.log('Moving to next question');
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            console.log('Test completed, saving results');
            saveResults();
            navigate(`/organization/${organizationId}`);
        }
    };

    const saveResults = async () => {
        try {
            console.log('Saving results:', answers);
            // Here you would implement the logic to save the test results
            // This could be a new API endpoint to save the organization's test results
            message.success("Результаты тестирования сохранены");
        } catch (error) {
            console.error('Error saving results:', error);
            message.error("Ошибка при сохранении результатов");
        }
    };

    const currentQuestion = questions[currentQuestionIndex];
    console.log('Rendering with:', { 
        currentQuestionIndex, 
        questionsLength: questions.length, 
        currentQuestion, 
        selectedAnswer 
    });

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
                            onChange={(e) => {
                                console.log('Answer selected:', e.target.value);
                                setSelectedAnswer(e.target.value);
                            }}
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