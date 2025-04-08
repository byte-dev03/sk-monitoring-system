// server.js (Node/Express)
import express from 'express';
import ViteExpress from 'vite-express';
import fs from 'fs/promises'; // Use promises version of fs
import path from 'path';
import cors from 'cors';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

// Enable CORS for all origins
app.use(cors());

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
  console.log("Incoming request for /api/barangays");

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

app.get('/api/barangays/:id', async (req, res) => {
  try {
    const barangays = await readBarangays(); // Load JSON file
    const id = parseInt(req.params.id); // Get ID from URL
    const barangay = barangays.find(b => b.id === id);

    if (!barangay) {
      return res.status(404).json({ error: "Barangay not found" });
    }

    res.json(barangay); // Send the matched barangay
  } catch (error) {
    console.error("Failed to get barangay by ID:", error);
    res.status(500).json({ error: 'Failed to read barangays data' });
  }
});


// Start the server
ViteExpress.listen(app, 3000, () => {
  console.log('API listening on :3000');
});

