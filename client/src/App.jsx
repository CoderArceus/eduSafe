import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_URL } from './config';
import MapComponent from './MapComponent.jsx';
import QuizList from './QuizList.jsx';
import QuizPage from './QuizPage.jsx';
import DisasterGuides from './DisasterGuides.jsx';
import GuidePage from './GuidePage.jsx';
import TutorialPage from './TutorialPage.jsx';
import GameComponent from './GameComponent.jsx';
import Login from './Login.jsx';
import Register from './Register.jsx';
import ProfilePage from './ProfilePage.jsx';
import { AuthContext } from './AuthContext.jsx';
import SOSButton from './SOSButton.jsx'; // <-- Import the new component
import AlertsPage from './AlertsPage.jsx';

function App() {
    const { user, logout } = useContext(AuthContext);
    const [view, setView] = useState('dashboard');
    const [selectedQuizId, setSelectedQuizId] = useState(null);
    const [selectedGuide, setSelectedGuide] = useState(null);
    const [weatherData, setWeatherData] = useState(null);
    const [showLogin, setShowLogin] = useState(true);

    useEffect(() => {
        if (user) {
            axios.get(`${API_URL}/api/weather`)
                .then(response => {
                    setWeatherData(response.data);
                })
                .catch(error => {
                    console.error("Error fetching weather data:", error);
                });
        }
    }, [user]);

    const handleSelectQuiz = (quizId) => { setView('quiz'); setSelectedQuizId(quizId); };
    const handleSelectGuide = (guide) => {
        setSelectedGuide(guide);
        setView(guide.type === 'video' ? 'tutorial' : 'guide');
    };
    const handleBackToDashboard = () => { setView('dashboard'); setSelectedQuizId(null); setSelectedGuide(null); };

    if (!user) {
        return showLogin ? <Login onSwitchToRegister={() => setShowLogin(false)} /> : <Register onSwitchToLogin={() => setShowLogin(true)} />;
    }

    const renderContent = () => {
        switch (view) {
            case 'quiz': return <QuizPage quizId={selectedQuizId} onBackToList={handleBackToDashboard} currentUser={user} />;
            case 'guide': return <GuidePage guideId={selectedGuide.id} onBack={handleBackToDashboard} />;
            case 'tutorial': return <TutorialPage guideId={selectedGuide.id} onBack={handleBackToDashboard} />;
            case 'profile': return <ProfilePage onBack={handleBackToDashboard} currentUser={user} />;
			case 'alerts': // <-- NEW case for the alerts view
                return <AlertsPage onBack={handleBackToDashboard} />;
            default:
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                        <div className="card lg:col-span-1">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.003 4.003 0 003 15z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-gray-800">Current Conditions</h2>
                            </div>
                            {weatherData ? (
                                <div className="space-y-4">
                                    <div className="text-center">
                                        <p className="text-lg font-semibold text-gray-600 mb-2">{weatherData.city}</p>
                                        <p className="text-5xl font-bold text-gray-800 mb-2">{Math.round(weatherData.temp)}°C</p>
                                        <p className="text-gray-600 capitalize text-lg">{weatherData.description}</p>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                                        <div className="text-center">
                                            <p className="text-sm text-gray-500">Humidity</p>
                                            <p className="font-semibold text-gray-800">{Math.round(weatherData.humidity)}%</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm text-gray-500">Wind</p>
                                            <p className="font-semibold text-gray-800">{Math.round(weatherData.windSpeed)} km/h</p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200">
                                        <div className="text-center">
                                            <p className="text-xs text-gray-500">Feels Like</p>
                                            <p className="font-semibold text-gray-800 text-sm">{Math.round(weatherData.feelsLike)}°C</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-gray-500">UV Index</p>
                                            <p className="font-semibold text-gray-800 text-sm">{weatherData.uvIndex}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-gray-500">Rain</p>
                                            <p className="font-semibold text-gray-800 text-sm">{Math.round(weatherData.precipProbability)}%</p>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
                                        <p className="text-center font-semibold text-purple-800">
                                            AQI: {weatherData.aqi} <span className="text-purple-600">({weatherData.aqiDescription})</span>
                                        </p>
                                    </div>
                                    
                                    {weatherData.temp > 35 && (
                                        <div className="weather-alert weather-alert-hot">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            High temperatures expected! Stay hydrated.
                                        </div>
                                    )}
                                    {weatherData.aqi > 150 && (
                                        <div className="weather-alert weather-alert-aqi">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            Air quality is poor. Consider limiting outdoor activity.
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                                    <span className="ml-3 text-gray-600">Loading weather data...</span>
                                </div>
                            )}
                        </div>
                        
                        <div className="card">
                            <QuizList onSelectQuiz={handleSelectQuiz} />
                        </div>
                        
                        <div className="card">
                            <DisasterGuides onSelectGuide={handleSelectGuide} />
                        </div>
                        
                        <div className="card lg:col-span-3">
                            <GameComponent />
                        </div>
                        
                        <div className="card lg:col-span-3">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Interactive Emergency Map</h2>
                                    <p className="text-gray-600">Pan or zoom the map to discover essential services and safe zones near you.</p>
                                </div>
                            </div>
                            <MapComponent />
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <header className="bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 text-white shadow-large">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold">EduSafe</h1>
                                <p className="text-primary-100 text-sm">Your Daily Safety Hub</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3 flex-wrap">
                        <SOSButton />
                            <button 
                                onClick={() => setView('alerts')} 
                                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-7a1 1 0 011-1h4a1 1 0 011 1v7h6M4 10l8-6 8 6v9H4v-9z" />
                                </svg>
                                Alerts
                            </button>
                            <button 
                                onClick={() => setView('profile')} 
                                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Progress
                            </button>
                            <button 
                                onClick={logout} 
                                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {renderContent()}
            </main>

            <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-200 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <p className="text-gray-600 font-medium">Stay prepared with EduSafe!</p>
                        <p className="text-gray-500 text-sm mt-2">Empowering communities through safety education</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;