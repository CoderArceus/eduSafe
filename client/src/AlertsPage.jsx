import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_URL } from './config';
import { AuthContext } from './AuthContext';

function AlertsPage({ onBack }) {
    const { token } = useContext(AuthContext);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            axios.get(`${API_URL}/api/user/alerts`, { headers: { Authorization: `Bearer ${token}` } })
                .then(response => {
                    setAlerts(response.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))); // Show newest first
                    setLoading(false);
                })
                .catch(error => {
                    console.error("Error fetching alerts:", error);
                    setLoading(false);
                });
        }
    }, [token]);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="card animate-fade-in">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Emergency Alerts</h2>
                            <p className="text-gray-600">Stay informed about emergency situations in your network</p>
                        </div>
                    </div>
                    <button onClick={onBack} className="btn-secondary">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Dashboard
                    </button>
                </div>
                
                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                        <span className="ml-3 text-gray-600">Loading alerts...</span>
                    </div>
                )}
                
                {!loading && alerts.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">All Clear!</h3>
                        <p className="text-gray-600">You have no new emergency alerts at this time.</p>
                    </div>
                )}
            
                {!loading && alerts.length > 0 && (
                    <div className="space-y-4">
                    {alerts.map(alert => (
                            <div key={alert.id} className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-6 hover:shadow-medium transition-all duration-200">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-red-800 text-lg mb-2">
                                            Emergency Alert from {alert.senderEmail}
                                        </h3>
                                        <p className="text-red-700 mb-4">
                                            Received: {new Date(alert.timestamp).toLocaleString()}
                                        </p>
                                        <a 
                                            href={`https://www.google.com/maps/search/?api=1&query=${alert.latitude},${alert.longitude}`}
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            View Location on Map
                                        </a>
                                    </div>
                                </div>
                            </div>
                    ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AlertsPage;