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
        <div className="card">
            <button onClick={onBack} style={{marginBottom: '1rem', width: 'fit-content'}}>← Back to Dashboard</button>
            <h2>My Progress</h2>
            <p>Welcome, {user ? user.email : 'Guest'}!</p>
            <h3>Quiz Completion</h3>
            {error ? (
                <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>
            ) : (
                <p>You have completed <strong>{progress.completed}</strong> out of <strong>{progress.total}</strong> quizzes.</p>
            )}
            <button onClick={handleDownloadCertificate} disabled={!canGetCertificate || !!error}>
                {canGetCertificate ? 'Download Certificate' : 'Complete All Quizzes to Unlock'}
            </button>
        </div>
    );
}

export default ProfilePage;