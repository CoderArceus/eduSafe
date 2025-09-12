import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from './config';

function DisasterGuides({ onSelectGuide }) {
    const [guides, setGuides] = useState([]);
    useEffect(() => {
        axios.get(`${API_URL}/api/guides`)
            .then(response => setGuides(response.data))
            .catch(error => console.error("Error fetching guides:", error));
    }, []);

    return (
        <div className="card">
            <h2>Disaster Information</h2>
            <p>Browse guides on various disasters relevant to your region:</p>
            <div className="list-container">
                <ul>
                    {guides.map(guide => (
                        <li key={guide.id} onClick={() => onSelectGuide(guide)} className="guide-tile" role="button" tabIndex="0">
                            <div>
                                <strong style={{fontSize: '1.1em'}}>
                                    {guide.type === 'video' && '🎥 '} 
                                    {guide.title}
                                </strong>
                                <p style={{margin: '5px 0 0', color: '#6c757d'}}>{guide.short_description}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
export default DisasterGuides;