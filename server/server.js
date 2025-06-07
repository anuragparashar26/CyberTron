import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;


app.use(cors());
app.use(express.json());


app.use(express.static(path.join(__dirname, '../dist')));


app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy' });
});

app.post('/api/v3/urls', async (req, res) => {
    try {
        const response = await fetch('https://www.virustotal.com/api/v3/urls', {
            method: 'POST',
            headers: {
                'x-apikey': process.env.VITE_VIRUSTOTAL_API_KEY,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: req.body
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/v3/analyses/:id', async (req, res) => {
    try {
        const response = await fetch(`https://www.virustotal.com/api/v3/analyses/${req.params.id}`, {
            headers: {
                'x-apikey': process.env.VITE_VIRUSTOTAL_API_KEY
            }
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
