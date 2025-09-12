import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { API_URL } from './config';


function Login({ onSwitchToRegister }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
            login(response.data.accessToken, response.data.user);
        } catch (err) {
            setError('Failed to log in. Please check your credentials.');
        }
    };

    return (
        <div className="card" style={{ maxWidth: '400px', margin: '2rem auto' }}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Log In</button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                Don't have an account? <a href="#" onClick={onSwitchToRegister} style={{ color: '#667eea' }}>Register here</a>
            </p>
        </div>
    );
}
export default Login;
