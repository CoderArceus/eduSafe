
// This file acts as our mock database.
const disasterGuides = [
    {
        id: 'heatwave-guide',
        title: 'Surviving a Heatwave',
        short_description: 'Learn how to stay safe during periods of extreme heat.',
        content: `<h3>Understanding Heatwaves</h3><p>A heatwave is a prolonged period of excessively hot weather. It's crucial to stay cool and hydrated.</p><h4>Key Safety Measures:</h4><ul><li><strong>Stay Hydrated:</strong> Drink plenty of water.</li><li><strong>Stay Indoors:</strong> Remain in air-conditioned spaces.</li><li><strong>Dress Appropriately:</strong> Wear lightweight, loose-fitting clothing.</li><li><strong>Never Leave Anyone in a Car.</strong></li></ul>`
    },
    {
        id: 'earthquake-guide',
        title: 'Earthquake Preparedness',
        short_description: 'What to do before, during, and after an earthquake.',
        content: `<h3>During an Earthquake:</h3><ul><li><strong>If Indoors:</strong> "Drop, Cover, and Hold On".</li><li><strong>If Outdoors:</strong> Stay outside, away from buildings and utility wires.</li></ul><h4>After an Earthquake:</h4><ul><li>Check yourself for injuries and be prepared for aftershocks.</li></ul>`
    },
    {
        id: 'flood-guide',
        title: 'Flood Safety',
        short_description: 'Protect yourself and your property from floodwaters.',
        content: `<h3>Safety Rules:</h3><ul><li><strong>Turn Around, Don't Drown:</strong> Never walk, swim, or drive through floodwaters.</li><li><strong>Evacuate:</strong> If advised to evacuate, do so immediately.</li><li><strong>Avoid Contaminated Water.</strong></li></ul>`
    },
	{
        id: 'cpr-tutorial',
        title: 'How to Perform CPR',
        type: 'video',
        short_description: 'A step-by-step video guide to Cardiopulmonary Resuscitation.',
        // Use relative paths to your new local files
        videoUrl: '/media/cpr-video.mp4',
        steps: [
            { imageUrl: '/media/cpr-step1.png', text: 'First, check the scene for safety and check the person for responsiveness. If there is no response, call your local emergency number.' },
            { imageUrl: '/media/cpr-step2.png', text: 'Place the heel of one hand on the center of the chest. Place your other hand on top and interlace your fingers.' },
            { imageUrl: '/media/cpr-step3.png', text: 'Deliver 30 chest compressions. Push hard and fast, at a depth of at least 2 inches and a rate of 100 to 120 compressions per minute.' },
            { imageUrl: '/media/cpr-step4.png', text: 'Give 2 rescue breaths. Tilt the head back, lift the chin, and continue the cycle of 30 compressions and 2 breaths.' }
        ]
    },
];

const mockQuizzes = [
    {
        id: 'fire-safety-1',
        title: 'Fire Safety Basics',
        questions: [
            { id: 'q1', text: 'What is the first thing you should do if you hear a fire alarm?', options: ['Run out', 'Call a friend', 'Find the nearest exit', 'Hide'], answer: 'Find the nearest exit' },
            { id: 'q2', text: 'What does "STOP, DROP, and ROLL" prevent?', options: ['Tripping', 'Burns', 'Falling', 'Hunger'], answer: 'Burns' },
            { id: 'q3', text: 'Where is the safest place to meet after evacuating?', options: ['Cafeteria', 'Designated assembly point', 'Anywhere outside', 'Your car'], answer: 'Designated assembly point' },
            { id: 'q4', text: 'How often should you test a smoke alarm?', options: ['Once a year', 'Once a month', 'Every 5 years', 'Only when it beeps'], answer: 'Once a month' },
        ],
    },
    {
        id: 'first-aid-1',
        title: 'Basic First Aid',
        questions: [
            { id: 'q1', text: 'For a minor burn, what is the first step?', options: ['Apply butter', 'Cover it with a thick bandage', 'Cool the burn with cool running water', 'Pop any blisters'], answer: 'Cool the burn with cool running water' },
            { id: 'q2', text: 'What does the acronym "CPR" stand for?', options: ['Cardiopulmonary Resuscitation', 'Central Pulse Recovery', 'Cardiac Pressure Relief', 'Circulation Pulse Response'], answer: 'Cardiopulmonary Resuscitation' },
        ],
    },
	{
        id: 'flood-safety-1',
        title: 'Flood Safety',
        questions: [
            { id: 'q1', text: 'What does "Turn Around, Don\'t Drown" refer to?', options: ['Avoiding arguments', 'Not driving or walking through floodwaters', 'A swimming technique', 'A dance move'], answer: 'Not driving or walking through floodwaters' },
            { id: 'q2', text: 'How high does moving water need to be to sweep a vehicle away?', options: ['5 feet', '3 feet', '1 foot', '6 inches'], answer: '1 foot' },
        ],
    },
    // --- NEW QUIZ ADDED ---
    {
        id: 'cybersecurity-1',
        title: 'Basic Cybersecurity',
        questions: [
            { id: 'q1', text: 'What is the best characteristic of a strong password?', options: ['Your pet\'s name', 'A common word', 'A long mix of letters, numbers, and symbols', 'The word "password"'], answer: 'A long mix of letters, numbers, and symbols' },
            { id: 'q2', text: 'What is "phishing"?', options: ['A type of fishing sport', 'A software bug', 'Fraudulent emails attempting to get personal info', 'A computer virus'], answer: 'Fraudulent emails attempting to get personal info' },
        ],
    },
	{
        id: 'earthquake-1',
        title: 'Earthquake Preparedness',
        questions: [
            { id: 'q1', text: 'During an earthquake, what should you do if indoors?', options: ['Run outside', 'Stand near a window', 'Drop, Cover, and Hold On', 'Call emergency services immediately'], answer: 'Drop, Cover, and Hold On' },
            { id: 'q2', text: 'What is a common safety hazard after an earthquake?', options: ['Loud noises', 'Power outages', 'Sudden rain', 'Falling leaves'], answer: 'Power outages' },
        ],
    },
];

// The password for 'testuser' is 'password123'
const mockUsers = [
    { id: 'user1', email: 'testuser@example.com', password: 'password123' },
    { id: 'user2', email: 'friend@example.com', password: 'friendpassword' },
    { id: 'user3', email: 'family@example.com', password: 'familypassword' }
];

const mockConnections = [
    { userId1: 'user1', userId2: 'user2', status: 'accepted' }
];

// --- NEW: A place to store triggered alerts ---
const mockAlerts = [];

module.exports = {
    disasterGuides,
    mockQuizzes,
    mockUsers,
	mockConnections, // <-- Export new data
    mockAlerts 
};
