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
        <div>
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Disaster Information</h2>
                    <p className="text-gray-600">Browse guides on various disasters relevant to your region</p>
                </div>
            </div>
            <div className="space-y-3">
                    {guides.map(guide => (
                        <div 
                            key={guide.id} 
                            onClick={() => onSelectGuide(guide)} 
                            className="bg-gradient-to-r from-white to-gray-50 p-4 rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-medium transition-all duration-200 cursor-pointer group"
                            role="button" 
                            tabIndex="0"
                        >
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors flex-shrink-0 mt-1">
                                    {guide.type === 'video' ? (
                                        <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-orange-700 transition-colors">
                                        {guide.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm">{guide.short_description}</p>
                                </div>
                                <svg className="w-5 h-5 text-gray-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}
export default DisasterGuides;