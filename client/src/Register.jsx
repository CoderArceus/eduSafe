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
        <div className="card" style={{ maxWidth: '400px', margin: '2rem auto' }}>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
                </div>
                {message && <p style={{ color: 'green' }}>{message}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Register</button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                Already have an account? <a href="#" onClick={onSwitchToLogin} style={{ color: '#667eea' }}>Login here</a>
            </p>
        </div>
    );
}
export default Register;
