const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'AlumniConnect AI API is running!' });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

app.get('/api/mentors', (req, res) => {
    res.json({
        success: true,
        mentors: [
            { id: 1, name: 'Rajesh Joshi', title: 'Senior PM', company: 'Google', matchScore: 96 },
            { id: 2, name: 'Anjali Nair', title: 'Data Scientist', company: 'Amazon', matchScore: 91 }
        ]
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running on port ${PORT}`);
});
