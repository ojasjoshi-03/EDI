const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateText?key=${GEMINI_API_KEY}`;

// Handle AI chatbot requests
app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const response = await axios.post(GEMINI_API_URL, {
            prompt: message,
        });

        const reply = response.data?.candidates?.[0]?.output || 'Sorry, I am unable to process that.';
        res.json({ reply });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to fetch response from AI' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
