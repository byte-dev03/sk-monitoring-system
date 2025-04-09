// server.js (Node/Express)
import express from 'express';
import session from 'express-session';
import fs from 'fs/promises'; // Use promises version of fs
import FileStore from 'session-file-store';
import path from 'path';
import cors from 'cors';

import bodyParser from 'body-parser';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FileSessionStore = FileStore(session);

const app = express();

app.use(bodyParser.json());

// Enable CORS for all origins
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use((req, res, next) => {
    console.log('Request Origin:', req.headers.origin);
    next();
});

app.use(session({
  store: new FileSessionStore({ path: './sessions', logFn: () => {} }), 
  name: 'sid',
  secret: process.env.SESSION_SECRET || 'secrets',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 2,  // 2 hours
    // secure: true  // enable in prod (HTTPS)
  }
}));

// Function to read barangays from JSON file
const readBarangays = async () => {
  try {
    const filePath = path.join(__dirname, 'data', 'barangays.json');
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading barangays file:', error);
    throw error; // Rethrow the error to handle it later
  }
};

// Function to read users from JSON file
const readUsers = async () => {
  try {
    const filePath = path.join(__dirname, 'data', 'users.json');
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users file:', error);
    throw error; // Rethrow the error to handle it later
  }
};

app.get('/api/users', async (req, res) => {
  console.log("Incomin request for /api/users");

  try {
    const users = await readUsers();
    const q = (req.query.search || '').toLowerCase();

    const filtered = users.filter(u =>
      u.name.toLowerCase().includes(q)
    );

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: "Failed to read users data" });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const users = await readUsers(); // Load JSON file
    const id = parseInt(req.params.id); // Get ID from URL
    const user = users.find(u => u.id === id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user); // Send the matched barangay
  } catch (error) {
    console.error("Failed to get user by ID:", error);
    res.status(500).json({ error: 'Failed to read users data' });
  }
});

app.post('/api/login', async (req,res) => {
  const { username, password } = req.body;

  try {
    const users = await readUsers();
    console.log(users);
    const user = users.find(
      (u) => u.username == username && u.password == password
    );
    
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Save session
    req.session.user = {
      username: user.username,
      role: user.role || "user"
    };

    res.json({username: user.username, role: user.role || "user" });
  } catch (error) {
    console.error("Login error: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/api/session', (req, res) => {
  if (req.session.user) {
    res.json({ isAuthenticated: true, user: req.session.user });
  } else {
    res.status(401).json({ isAuthenticated: false });
  }
});
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
app.listen(3000, () => {
  console.log('backend server is listening on :3000');
});

