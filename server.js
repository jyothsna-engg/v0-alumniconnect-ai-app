const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'AlumniConnect AI Backend is Running!',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', uptime: process.uptime() });
});

// Mock data
const mentors = [
    { id: 1, name: 'Rajesh Joshi', initials: 'RJ', title: 'Senior Product Manager', company: 'Google', matchScore: 96, bio: 'Ex-Microsoft, passionate about product careers.' },
    { id: 2, name: 'Anjali Nair', initials: 'AN', title: 'Data Science Lead', company: 'Amazon', matchScore: 91, bio: 'AI/ML specialist, 8+ years experience.' },
    { id: 3, name: 'Vikram Khanna', initials: 'VK', title: 'VP Investment Banking', company: 'Goldman Sachs', matchScore: 88, bio: 'Finance career insights & referrals.' }
];

const jobs = [
    { id: 1, title: 'Software Engineer Intern', company: 'Microsoft', location: 'Remote', type: 'Internship' },
    { id: 2, title: 'Product Marketing Associate', company: 'Adobe', location: 'San Jose, CA', type: 'Full-time' },
    { id: 3, title: 'Data Analyst', company: 'JP Morgan', location: 'New York, NY', type: 'Entry Level' }
];

// API Routes
app.get('/api/mentors', (req, res) => {
    res.json({ success: true, mentors });
});

app.get('/api/jobs', (req, res) => {
    res.json({ success: true, jobs });
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    res.json({ 
        success: true, 
        token: 'dummy-jwt-token-' + Date.now(),
        user: { 
            id: 1, 
            name: 'Test User', 
            email: email || 'test@example.com', 
            role: 'student' 
        }
    });
});

app.post('/api/auth/register', (req, res) => {
    const { name, email, password, role } = req.body;
    res.json({ 
        success: true, 
        token: 'dummy-jwt-token-' + Date.now(),
        user: { 
            id: Date.now(), 
            name: name || 'New User', 
            email: email || 'user@example.com', 
            role: role || 'student' 
        }
    });
});

app.get('/api/connections', (req, res) => {
    res.json({ success: true, connections: [] });
});

app.post('/api/connections', (req, res) => {
    res.json({ success: true, message: 'Connection request sent' });
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ AlumniConnect AI Backend running on port ${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}`);
});
