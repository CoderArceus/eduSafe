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
import './App.css';
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
                    <div className="main-content">
                        <div className="card weather-card">
                            <h2>Current Conditions</h2>
                            {weatherData ? (
                                <>
                                    <div className="weather-widget">
                                        <p className="city">{weatherData.city}</p>
                                        <p className="temp">{Math.round(weatherData.temp)}°C</p>
                                        <p className="description">{weatherData.description}</p>
                                        <div className="weather-details">
                                            <span>Humidity: {Math.round(weatherData.humidity)}%</span>
                                            <span>Wind: {Math.round(weatherData.windSpeed)} km/h</span>
                                        </div>
                                        <div className="weather-extras">
                                            <span>Feels Like: {Math.round(weatherData.feelsLike)}°C</span>
                                            <span>UV Index: {weatherData.uvIndex}</span>
                                            <span>Rain: {Math.round(weatherData.precipProbability)}%</span>
                                        </div>
                                        <p className="aqi-info">AQI: {weatherData.aqi} ({weatherData.aqiDescription})</p>
                                    </div>
                                    {weatherData.temp > 35 && (
                                        <div className="weather-alert high-temp">
                                            High temperatures expected! Stay hydrated.
                                        </div>
                                    )}
                                    {weatherData.aqi > 150 && (
                                        <div className="weather-alert high-aqi">
                                            Air quality is poor. Consider limiting outdoor activity.
                                        </div>
                                    )}
                                </>
                            ) : (<p>Loading weather data...</p>)}
                        </div>
                        <div className="card">
                            <QuizList onSelectQuiz={handleSelectQuiz} />
                        </div>
                        <div className="card">
                            <DisasterGuides onSelectGuide={handleSelectGuide} />
                        </div>
                        <div className="card" style={{ gridColumn: '1 / -1' }}>
                            <GameComponent />
                        </div>
                        <div className="card" style={{ gridColumn: '1 / -1' }}>
                            <h2>Interactive Emergency Map</h2>
                            <p>Pan or zoom the map to discover essential services and safe zones near you.</p>
                            <MapComponent />
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="App">
            <header className="header">
                {/* --- THIS JSX IS NOW RESTORED --- */}
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap'}}>
                    <h1 style={{marginRight: '1rem'}}>EduSafe: Your Daily Safety Hub</h1>
                    <div>
                        <SOSButton />
                        <button onClick={() => setView('alerts')} style={{marginRight: '10px', marginBottom: '5px'}}>Alerts</button>
                        <button onClick={() => setView('profile')} style={{marginRight: '10px', marginBottom: '5px'}}>My Progress</button>
                        <button onClick={logout} style={{marginBottom: '5px'}}>Logout</button>
                    </div>
                </div>
            </header>
            
            {renderContent()}

            <footer className="app-footer">
                Stay prepared with EduSafe!
            </footer>
        </div>
    );
}

export default App;