import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from './config';


function Register({ onSwitchToLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            await axios.post(`${API_URL}/api/auth/register`, { email, password });
            setMessage('Registration successful! Please switch to login.');
        } catch (err) {
            setError('Failed to register. The user may already exist.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4">
            <div className="card max-w-md w-full animate-fade-in">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
                    <p className="text-gray-600">Join EduSafe to start your safety journey</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                            required 
                            className="input-field"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                            required 
                            className="input-field"
                            placeholder="Create a password"
                        />
                    </div>
                    
                    {message && (
                        <div className="bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-xl">
                            {message}
                        </div>
                    )}
                    {error && (
                        <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-xl">
                            {error}
                        </div>
                    )}
                    
                    <button type="submit" className="btn-primary w-full">
                        Create Account
                    </button>
                </form>
                
                <div className="mt-8 text-center">
                    <p className="text-gray-600">
                        Already have an account? 
                        <button 
                            onClick={onSwitchToLogin} 
                            className="text-primary-600 hover:text-primary-700 font-semibold ml-1 transition-colors"
                        >
                            Sign in here
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
export default Register;
