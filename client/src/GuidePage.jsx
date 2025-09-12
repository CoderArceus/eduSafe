import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from './config';


function GuidePage({ guideId, onBack }) {
    const [guide, setGuide] = useState(null);
    useEffect(() => {
        axios.get(`${API_URL}/api/guides/${guideId}`)
            .then(response => setGuide(response.data))
            .catch(error => console.error("Error fetching guide:", error));
    }, [guideId]);
    if (!guide) return <div className="card">Loading guide...</div>;
    return (
        <div className="card">
            <button onClick={onBack} style={{marginBottom: '1rem', width: 'fit-content'}}>← Back to Dashboard</button>
            <h2>{guide.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: guide.content }} />
        </div>
    );
}
export default GuidePage;
