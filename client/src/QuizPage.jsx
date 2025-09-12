import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { API_URL } from './config';


function QuizPage({ quizId, onBackToList }) {
    const { token } = useContext(AuthContext);
    const [quizData, setQuizData] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [quizFinished, setQuizFinished] = useState(false);
    const [score, setScore] = useState(0);

    useEffect(() => {
        axios.get(`${API_URL}/api/quizzes/${quizId}`)
            .then(response => setQuizData(response.data))
            .catch(error => console.error("Error fetching quiz details:", error));
    }, [quizId]);

    if (!quizData) return <div className="card">Loading Quiz...</div>;
    const currentQuestion = quizData.questions[currentQuestionIndex];
    const handleAnswerSelect = (questionId, selectedOption) => setUserAnswers({ ...userAnswers, [questionId]: selectedOption });
    const handleNextQuestion = () => {
        if (currentQuestionIndex < quizData.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            let finalScore = 0;
            quizData.questions.forEach(question => {
                if (userAnswers[question.id] === question.answer) finalScore++;
            });
            setScore(finalScore);
            setQuizFinished(true);
            if (token) {
                axios.post(`${API_URL}/api/quizzes/${quizId}/submit`, {}, { headers: { Authorization: `Bearer ${token}` } })
                    .then(res => console.log(res.data.message))
                    .catch(err => console.error("Failed to save progress:", err));
            }
        }
    };

    return (
        <div className="card quiz-page">
            <h2>{quizData.title}</h2>
            {!quizFinished ? (
                <>
                    <p className="quiz-question">Q{currentQuestionIndex + 1}: {currentQuestion.text}</p>
                    <div className="quiz-options">
                        {currentQuestion.options.map((option, index) => (
                            <button key={index} onClick={() => handleAnswerSelect(currentQuestion.id, option)} className={userAnswers[currentQuestion.id] === option ? 'selected' : ''}>
                                {option}
                            </button>
                        ))}
                    </div>
                    <div className="quiz-navigation">
                        <button onClick={handleNextQuestion} disabled={!userAnswers[currentQuestion.id]}>
                            {currentQuestionIndex === quizData.questions.length - 1 ? 'Finish & See Score' : 'Next Question'}
                        </button>
                    </div>
                </>
            ) : (
                <div className="quiz-results">
                    <h3>Quiz Completed!</h3>
                    <p>Your Score: {score} / {quizData.questions.length}</p>
                    <p>You can now discuss the answers as a class.</p>
                    <button onClick={onBackToList} style={{ marginTop: '20px' }}>Back to Dashboard</button>
                </div>
            )}
        </div>
    );
}
export default QuizPage;
