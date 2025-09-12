const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const { disasterGuides, mockQuizzes, mockUsers, mockConnections, mockAlerts } = require('./db.js');
const pdfkit = require('pdfkit');
const fs = require('fs');

const app = express();
const port = 3001;
const BASE_URL = `http://localhost:${port}`;
const JWT_SECRET = 'your-super-secret-key-for-sih-demo';
const COMPLETIONS_FILE_PATH = './completions.json';

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serves media files

// --- Load and Save Progress ---
let mockCompletions = [];
try {
    const data = fs.readFileSync(COMPLETIONS_FILE_PATH, 'utf8');
    mockCompletions = JSON.parse(data);
    console.log('✅ User completions loaded successfully.');
} catch (error) {
    console.log('Could not find completions.json, starting with an empty list.');
    fs.writeFileSync(COMPLETIONS_FILE_PATH, '[]', 'utf8');
}
const saveCompletions = () => {
    fs.writeFileSync(COMPLETIONS_FILE_PATH, JSON.stringify(mockCompletions, null, 2), 'utf8');
};

// --- Middleware to verify JWT token ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.error('JWT Verification Failed:', err.message);
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};

// --- Configuration ---
const PIRATEWEATHER_API_KEY = 'Dcle59Bm4kof45IzEdLqbnrrPqLreyLi';
const WAQI_API_TOKEN = '695b7dbf5f85c60497100ba2dcb00d1c169a4494';
const DEFAULT_CITY_NAME = 'Delhi';
const DEFAULT_LAT = 28.6139;
const DEFAULT_LON = 77.2090;

const getAqiDescription = (aqi) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
};

// --- API Endpoints ---
app.get('/api/weather', async (req, res) => {
    try {
        const [weatherResult, aqiResult] = await Promise.allSettled([
            axios.get(`https://api.pirateweather.net/forecast/${PIRATEWEATHER_API_KEY}/${DEFAULT_LAT},${DEFAULT_LON}?units=si`),
            axios.get(`https://api.waqi.info/feed/${DEFAULT_CITY_NAME}/?token=${WAQI_API_TOKEN}`)
        ]);
        let responseData = { city: DEFAULT_CITY_NAME };
        if (weatherResult.status === 'fulfilled') {
            const weatherData = weatherResult.value.data.currently;
            // --- UPDATED: Add more data points ---
            Object.assign(responseData, { 
                temp: weatherData.temperature,
                feelsLike: weatherData.apparentTemperature, // ADDED
                uvIndex: weatherData.uvIndex,             // ADDED
                precipProbability: weatherData.precipProbability * 100, // ADDED & converted to %
                description: weatherData.summary, 
                humidity: weatherData.humidity * 100, 
                windSpeed: weatherData.windSpeed 
            });
        }
        if (aqiResult.status === 'fulfilled' && aqiResult.value.data.status === 'ok') {
            const aqiData = aqiResult.value.data.data;
            Object.assign(responseData, { aqi: aqiData.aqi, aqiDescription: getAqiDescription(aqiData.aqi) });
        }
        res.json(responseData);
    } catch (error) {
        res.status(500).json({ city: DEFAULT_CITY_NAME, temp: 30, description: 'Partly Cloudy (mock)', humidity: 60, windSpeed: 10, aqi: 185, aqiDescription: 'Unhealthy (mock)' });
    }
});

app.get('/api/map-points', async (req, res) => {
    const { bbox } = req.query;
    if (!bbox) return res.status(400).send({ message: 'Bounding box is required' });
    const overpassQuery = `[out:json][timeout:25];(node["amenity"~"hospital|clinic|doctors|pharmacy"](${bbox});node["amenity"~"police|fire_station"](${bbox});node["emergency"~"assembly_point|shelter"](${bbox}););out center;`;
    const overpassUrl = `https://overpass-api.de/api/interpreter`;
    try {
        const response = await axios.post(overpassUrl, `data=${encodeURIComponent(overpassQuery)}`, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, timeout: 15000 });
        const points = response.data.elements.map(el => ({ id: el.id, lat: el.lat, lon: el.lon, name: el.tags.name || 'Unnamed', type: el.tags.amenity || el.tags.emergency })).filter(p => p.name !== 'Unnamed');
        res.json(points);
    } catch (error) {
        res.status(500).send({ message: 'Failed to fetch map data.' });
    }
});

app.get('/api/map-points/near', async (req, res) => {
    const { lat, lon } = req.query;
    if (!lat || !lon) return res.status(400).send({ message: 'Latitude and Longitude are required' });
    const searchRadius = 5000;
    const overpassQuery = `[out:json][timeout:25];(node["amenity"~"hospital|clinic|pharmacy"](around:${searchRadius},${lat},${lon});node["emergency"~"assembly_point|shelter"](around:${searchRadius},${lat},${lon}););out center;`;
    const overpassUrl = `https://overpass-api.de/api/interpreter`;
    try {
        const response = await axios.post(overpassUrl, `data=${encodeURIComponent(overpassQuery)}`, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, timeout: 15000 });
        const points = response.data.elements.map(el => ({ id: el.id, lat: el.lat, lon: el.lon, name: el.tags.name || 'Unnamed', type: el.tags.amenity || el.tags.emergency })).filter(p => p.name !== 'Unnamed');
        res.json(points);
    } catch (error) {
        res.status(500).send({ message: 'Failed to fetch nearby map data.' });
    }
});

app.get('/api/guides', (req, res) => {
    const guideList = disasterGuides.map(guide => ({ id: guide.id, title: guide.title, short_description: guide.short_description, type: guide.type }));
    res.json(guideList);
});

app.get('/api/guides/:id', (req, res) => {
    let guide = disasterGuides.find(g => g.id === req.params.id);
    if (guide) {
        if (guide.type === 'video') {
            guide = { ...guide, videoUrl: `${BASE_URL}${guide.videoUrl}`, steps: guide.steps.map(step => ({ ...step, imageUrl: `${BASE_URL}${step.imageUrl}` })) };
        }
        res.json(guide);
    } else {
        res.status(404).send({ message: 'Guide not found' });
    }
});

app.get('/api/quizzes', (req, res) => {
    res.json(mockQuizzes.map(q => ({ id: q.id, title: q.title })));
});

app.get('/api/quizzes/:id', (req, res) => {
    const quiz = mockQuizzes.find(q => q.id === req.params.id);
    quiz ? res.json(quiz) : res.status(404).send({ message: 'Quiz not found' });
});

app.post('/api/auth/register', async (req, res) => {
    const { email, password } = req.body;
    // Hashing is removed. We save the plaintext password directly.
    const newUser = { id: `user${mockUsers.length + 1}`, email, password };
    mockUsers.push(newUser);
    console.log(`[AUTH] New user registered (plaintext password): ${email}`);
    res.status(201).send({ message: 'User registered successfully' });
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
        return res.status(400).send('Cannot find user');
    }
    
    // Use simple string comparison instead of bcrypt.compare
    if (password === user.password) {
        const accessToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '8h' });
        res.json({ accessToken, user: { id: user.id, email: user.email } });
    } else {
        res.status(401).send('Not Allowed');
    }
});


app.get('/api/user/progress-summary', authenticateToken, (req, res) => {
    const totalQuizzes = mockQuizzes.length;
    // This filter is the key: it only counts completions for the logged-in user.
    const userCompletions = mockCompletions.filter(c => c.userId === req.user.id);
    const completedCount = userCompletions.length;
    res.json({
        completed: completedCount,
        total: totalQuizzes,
    });
});

app.post('/api/quizzes/:id/submit', authenticateToken, (req, res) => {
    const { id: quizId } = req.params;
    const { id: userId } = req.user; // Get user ID from the secure token

    if (!userId) {
        return res.status(400).send({ message: 'User ID not found in token.' });
    }

    const existingCompletion = mockCompletions.find(c => c.userId === userId && c.quizId === quizId);
    if (!existingCompletion) {
        // Only add a completion record if it doesn't already exist for this user.
        mockCompletions.push({ userId, quizId });
        saveCompletions();
        console.log(`Progress saved for user ${userId}, quiz ${quizId}`);
    }
    res.status(200).send({ message: 'Progress saved successfully.' });
});

app.get('/api/user/certificate', authenticateToken, (req, res) => {
    const { id: userId, email: userEmail } = req.user;
    const userCompletions = mockCompletions.filter(c => c.userId === userId);
    if (userCompletions.length < mockQuizzes.length) {
        return res.status(403).send({ message: 'You must complete all quizzes.' });
    }
    const doc = new pdfkit({ size: 'A4', layout: 'landscape' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Certificate_${userId}.pdf`);
    doc.pipe(res);
    doc.fontSize(40).text('Certificate of Completion', { align: 'center' });
    doc.moveDown();
    doc.fontSize(20).text('This is to certify that', { align: 'center' });
    doc.moveDown();
    doc.fontSize(30).fillColor('blue').text(userEmail, { align: 'center' });
    doc.moveDown();
    doc.fontSize(20).fillColor('black').text('has successfully completed the EduSafe Disaster Preparedness Course.', { align: 'center' });
    doc.end();
});

app.post('/api/user/emergency-alert', authenticateToken, (req, res) => {
    const sender = req.user;
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
        return res.status(400).send({ message: 'Location data is required.' });
    }

    console.log(`[ALERT] User ${sender.email} triggered an SOS at Lat: ${latitude}, Lon: ${longitude}`);

    // Find all users connected to the sender
    const recipients = mockConnections
        .filter(c => c.userId1 === sender.id || c.userId2 === sender.id)
        .map(c => (c.userId1 === sender.id ? c.userId2 : c.userId1));
    
    // Create an alert for each recipient
    recipients.forEach(recipientId => {
        const recipientUser = mockUsers.find(u => u.id === recipientId);
        if (recipientUser) {
            const newAlert = {
                id: `alert_${Date.now()}`,
                recipientId: recipientUser.id,
                senderEmail: sender.email,
                latitude,
                longitude,
                timestamp: new Date(),
            };
            mockAlerts.push(newAlert);
            
            // For a real app, you would send an email/SMS/push notification here.
            // For our prototype, we just log it to the server console.
            console.log(`[ALERT] SIMULATING NOTIFICATION to ${recipientUser.email}: Emergency alert from ${sender.email}.`);
        }
    });

    res.status(200).send({ message: 'Emergency alert sent to your circle.' });
});

// Endpoint for a user to FETCH alerts sent to them
app.get('/api/user/alerts', authenticateToken, (req, res) => {
    const userAlerts = mockAlerts.filter(a => a.recipientId === req.user.id);
    res.json(userAlerts);
});

app.listen(port, () => console.log(`🚀 EduSafe Backend is live at http://localhost:${port}`));