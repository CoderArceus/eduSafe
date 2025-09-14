import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from './config';

function QuizList({ onSelectQuiz }) {
    const [quizzes, setQuizzes] = useState([]);
    useEffect(() => {
        axios.get(`${API_URL}/api/quizzes`)
            .then(response => setQuizzes(response.data))
            .catch(error => console.error("Error fetching quizzes:", error));
    }, []);
    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Safety Quizzes</h2>
                    <p className="text-gray-600">Test your knowledge on various safety topics</p>
                </div>
            </div>
            <div className="space-y-3">
                    {quizzes.map(quiz => (
                        <div key={quiz.id} className="bg-gradient-to-r from-white to-gray-50 p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-medium transition-all duration-200 flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span className="font-semibold text-gray-800">{quiz.title}</span>
                            </div>
                            <button 
                                onClick={() => onSelectQuiz(quiz.id)}
                                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
                            >
                                Start Quiz
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>
                        </div>
                    ))}
            </div>
        </div>
    );
}
export default QuizList;
