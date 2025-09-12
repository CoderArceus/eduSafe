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
        <div className="card">
            <button onClick={onBack} style={{marginBottom: '1rem', width: 'fit-content'}}>← Back to Dashboard</button>
            <h2>Incoming Alerts</h2>
            {loading && <p>Loading alerts...</p>}
            {!loading && alerts.length === 0 && <p>You have no new emergency alerts.</p>}
            
            <div className="list-container">
                <ul>
                    {alerts.map(alert => (
                        <li key={alert.id}>
                            <div>
                                <strong style={{color: '#c0392b'}}>Emergency Alert from {alert.senderEmail}</strong>
                                <p style={{margin: '5px 0 0'}}>Received at: {new Date(alert.timestamp).toLocaleString()}</p>
                                <a 
                                    href={`https://www.google.com/maps/search/?api=1&query=${alert.latitude},${alert.longitude}`}
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    style={{fontWeight: 'bold', color: '#2980b9'}}
                                >
                                    View Location on Map
                                </a>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default AlertsPage;