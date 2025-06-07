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

app.use(cors({
    origin: ['http://localhost:5173', 'https://cybertron-xr19.onrender.com']
}));
app.use(express.json());

app.use(express.static(path.join(__dirname, '../dist')));

app.get('/api/v3/*', async (req, res) => {
    try {
        const vtResponse = await fetch(`https://www.virustotal.com/api/v3${req.path.replace('/api/v3', '')}`, {
            headers: {
                'x-apikey': process.env.VITE_VIRUSTOTAL_API_KEY
            }
        });
        const data = await vtResponse.json();
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
