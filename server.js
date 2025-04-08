// server.js (Node/Express)
import express from 'express';
import ViteExpress from 'vite-express';
import fs from 'fs/promises'; // Use promises version of fs
import path from 'path';

const app = express();

// Function to read barangays from JSON file
const readBarangays = async () => {
  try {
    const filePath = path.join(__dirname, 'public', 'barangays.json');
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading barangays file:', error);
    throw error; // Rethrow the error to handle it later
  }
};

app.get('/api/barangays', async (req, res) => {
  try {
    const barangays = await readBarangays(); // Read barangays from file
    const q = (req.query.search || '').toLowerCase(); // Pull ?search=…
    
    // Filter barangays based on search query
    const filtered = barangays.filter(b =>
      b.name.toLowerCase().includes(q)
    );
    
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read barangays data' });
  }
});

// Start the server
ViteExpress.listen(app, 3000, () => {
  console.log('API listening on :3000');
});

