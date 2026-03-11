const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(express.json());

const MODEL = 'gemini-2.5-flash-lite';
const GEMINI_KEY = process.env.GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

app.post('/api/gemini-proxy', async (req, res) => {
  if (!GEMINI_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
  }

  const body = {
    model: MODEL,
    contents: req.body.contents || req.body.prompt || 'Say hello.',
    config: {
      temperature: req.body.temperature ?? 0.7,
      max_output_tokens: req.body.max_output_tokens ?? 200
    }
  };

  try {
    const response = await fetch(`${API_URL}?key=${GEMINI_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Gemini API error', details: error.message });
  }
});

const PORT = 5001;
app.listen(PORT, () => console.log(`Gemini proxy running on port ${PORT}`));
