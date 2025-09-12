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
        <div className="card">
            <h2>Safety Quizzes</h2>
            <p>Test your knowledge on various safety topics.</p>
            <div className="list-container">
                <ul>
                    {quizzes.map(quiz => (
                        <li key={quiz.id}>
                            <span>{quiz.title}</span>
                            <button onClick={() => onSelectQuiz(quiz.id)}>Start Quiz</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
export default QuizList;
