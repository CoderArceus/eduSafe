import React, { useContext } from 'react';
import axios from 'axios';
import { API_URL } from './config';
import { AuthContext } from './AuthContext';

function SOSButton() {
    const { token } = useContext(AuthContext);

    const handleSOSClick = () => {
        // First, ask for confirmation
        if (!window.confirm("Are you sure you want to send an emergency alert with your location to your circle?")) {
            return;
        }

        // Second, get the user's location
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    // Third, send the location to the backend
                    const response = await axios.post(`${API_URL}/api/user/emergency-alert`, 
                        { latitude, longitude },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    alert(response.data.message); // Show success message
                } catch (error) {
                    console.error("Error sending SOS alert:", error);
                    alert('Failed to send SOS alert.');
                }
            },
            () => {
                alert('Unable to retrieve your location. Please enable location services.');
            }
        );
    };

    return (
        <button 
            onClick={handleSOSClick} 
            className="btn-danger animate-bounce-gentle flex items-center gap-2"
        >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            SOS Alert
        </button>
    );
}

export default SOSButton;