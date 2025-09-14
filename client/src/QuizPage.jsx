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
        <div className="max-w-4xl mx-auto">
            <div className="card animate-fade-in">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{quizData.title}</h2>
                        <p className="text-gray-600">Test your knowledge and learn something new</p>
                    </div>
                </div>
                
            {!quizFinished ? (
                <div className="space-y-8">
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-semibold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                                Question {currentQuestionIndex + 1} of {quizData.questions.length}
                            </span>
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${((currentQuestionIndex + 1) / quizData.questions.length) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 leading-relaxed">{currentQuestion.text}</h3>
                    </div>
                    
                    <div className="grid gap-3">
                        {currentQuestion.options.map((option, index) => (
                            <button 
                                key={index} 
                                onClick={() => handleAnswerSelect(currentQuestion.id, option)} 
                                className={`p-4 rounded-xl border-2 text-left font-medium transition-all duration-200 ${
                                    userAnswers[currentQuestion.id] === option 
                                        ? 'border-purple-500 bg-purple-50 text-purple-800 shadow-medium' 
                                        : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50 hover:shadow-soft'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                        userAnswers[currentQuestion.id] === option 
                                            ? 'border-purple-500 bg-purple-500' 
                                            : 'border-gray-300'
                                    }`}>
                                        {userAnswers[currentQuestion.id] === option && (
                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                {option}
                                </div>
                            </button>
                        ))}
                    </div>
                    
                    <div className="flex justify-end">
                        <button 
                            onClick={handleNextQuestion} 
                            disabled={!userAnswers[currentQuestion.id]}
                            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                        >
                            {currentQuestionIndex === quizData.questions.length - 1 ? 'Finish & See Score' : 'Next Question'}
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center space-y-6 animate-fade-in">
                    <div className="w-24 h-24 bg-gradient-to-r from-success-500 to-green-500 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-gray-800 mb-4">Quiz Completed!</h3>
                        <div className="bg-gradient-to-r from-success-50 to-green-50 p-6 rounded-2xl border border-success-200 mb-6">
                            <p className="text-2xl font-bold text-success-700">
                                Your Score: {score} / {quizData.questions.length}
                            </p>
                            <p className="text-success-600 mt-2">
                                {score === quizData.questions.length ? 'Perfect score! 🎉' : 
                                 score >= quizData.questions.length * 0.8 ? 'Great job! 👏' : 
                                 score >= quizData.questions.length * 0.6 ? 'Good effort! 👍' : 
                                 'Keep learning! 📚'}
                            </p>
                        </div>
                        <p className="text-gray-600 mb-8">You can now discuss the answers as a class and continue your safety education journey.</p>
                        <button onClick={onBackToList} className="btn-primary">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
}
export default QuizPage;
