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
        <button onClick={handleSOSClick} style={{ backgroundColor: '#e74c3c', marginRight: '10px', marginBottom: '5px' }}>
            SOS Alert
        </button>
    );
}

export default SOSButton;