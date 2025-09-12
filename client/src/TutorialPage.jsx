import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from './config';

function TutorialPage({ guideId, onBack }) {
    const [tutorial, setTutorial] = useState(null);
    const [isCached, setIsCached] = useState(false);
    const [cacheStatus, setCacheStatus] = useState('');

    useEffect(() => {
        axios.get(`${API_URL}/api/guides/${guideId}`)
            .then(response => setTutorial(response.data))
            .catch(error => console.error("Error fetching tutorial:", error));
    }, [guideId]);

    const handleDownload = () => {
        if (!tutorial || !('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
            setCacheStatus('Service worker not available. Cannot save offline.');
            return;
        }
        setCacheStatus('Downloading...');
        const messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = (event) => {
            if (event.data.type === 'CACHE_COMPLETE' && event.data.payload.id === guideId) {
                setCacheStatus('Saved for Offline Use!');
                setIsCached(true);
            }
            if (event.data.type === 'CACHE_FAILED') {
                setCacheStatus('Download failed. Please try again.');
            }
        };
        const imageUrls = tutorial.steps.map(step => step.imageUrl);
        navigator.serviceWorker.controller.postMessage({
            type: 'CACHE_TUTORIAL',
            payload: {
                id: guideId,
                assets: [tutorial.videoUrl, ...imageUrls]
            }
        }, [messageChannel.port2]);
    };
    
    // --- THIS IS THE FIX ---
    // If the 'tutorial' data hasn't been fetched yet, show a loading message and stop.
    if (!tutorial) {
        return <div className="card">Loading Tutorial...</div>;
    }

    return (
        <div className="card">
            <button onClick={onBack} style={{marginBottom: '1rem', width: 'fit-content'}}>← Back to Guides</button>
            <h2>{tutorial.title}</h2>
            
            <video controls width="100%" src={tutorial.videoUrl} style={{borderRadius: '12px', marginBottom: '1.5rem', backgroundColor: '#000'}}>
                Sorry, your browser doesn't support embedded videos.
            </video>

            {isCached ? (
                <p style={{textAlign: 'center', color: 'green', fontWeight: 'bold'}}>✅ Available Offline</p>
            ) : (
                <div style={{textAlign: 'center', marginBottom: '1.5rem'}}>
                    <button onClick={handleDownload}>Download for Offline Use</button>
                    {cacheStatus && <p>{cacheStatus}</p>}
                </div>
            )}

            {tutorial.steps.map((step, index) => (
                <div key={index} style={{display: 'flex', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '1rem'}}>
                    <img src={step.imageUrl} alt={`Step ${index + 1}`} style={{width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px', marginRight: '1rem'}} />
                    <p><strong>Step {index + 1}:</strong> {step.text}</p>
                </div>
            ))}
        </div>
    );
}

export default TutorialPage;