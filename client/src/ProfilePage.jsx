import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { API_URL } from './config';


function ProfilePage({ onBack }) {
    const { user, token } = useContext(AuthContext);
    const [progress, setProgress] = useState({ completed: 0, total: 0 });
    const [canGetCertificate, setCanGetCertificate] = useState(false);
	const [error, setError] = useState('');

    useEffect(() => {
        const fetchProgress = async () => {
            if (!token) return;
            setError('');
            try {
                // This request includes the user's token in the header
                const response = await axios.get(`${API_URL}/api/user/progress-summary`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                const { completed, total } = response.data;
                setProgress({ completed, total });

                if (completed >= total && total > 0) {
                    setCanGetCertificate(true);
                }
            } catch (error) {
                console.error("Error fetching progress:", error);
                setError('Could not load your progress. Please try logging out and back in.');
            }
        };
        fetchProgress();
    }, [token]); // The effect re-runs if the token changes (i.e., on login)

    const handleDownloadCertificate = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/user/certificate`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob', // Important to handle the PDF file
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `EduSafe-Certificate-${user.id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            alert('Could not download certificate. Have you completed all quizzes?');
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="card animate-fade-in">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">My Progress</h2>
                            <p className="text-gray-600">Welcome, {user ? user.email : 'Guest'}!</p>
                        </div>
                    </div>
                    <button onClick={onBack} className="btn-secondary">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Dashboard
                    </button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Quiz Completion</h3>
                        </div>
                        
                        {error ? (
                            <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-xl">
                                {error}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Progress</span>
                                    <span className="font-bold text-blue-600">
                                        {progress.completed} / {progress.total}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div 
                                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-500"
                                        style={{ width: `${progress.total > 0 ? (progress.completed / progress.total) * 100 : 0}%` }}
                                    ></div>
                                </div>
                                <p className="text-gray-600">
                                    You have completed <span className="font-bold text-blue-600">{progress.completed}</span> out of <span className="font-bold text-blue-600">{progress.total}</span> quizzes.
                                </p>
                            </div>
                        )}
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Certificate</h3>
                        </div>
                        
                        <div className="space-y-4">
                            {canGetCertificate ? (
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <p className="text-green-700 font-semibold mb-4">Congratulations! You've earned your certificate.</p>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-600 mb-4">Complete all quizzes to unlock your certificate.</p>
                                </div>
                            )}
                            
                            <button 
                                onClick={handleDownloadCertificate} 
                                disabled={!canGetCertificate || !!error}
                                className={`w-full ${canGetCertificate && !error ? 'btn-primary' : 'bg-gray-300 text-gray-500 cursor-not-allowed py-3 px-6 rounded-xl font-semibold'}`}
                            >
                                {canGetCertificate ? (
                                    <>
                                        <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Download Certificate
                                    </>
                                ) : (
                                    'Complete All Quizzes to Unlock'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;