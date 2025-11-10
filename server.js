const express = require('express');
const cors = require('cors');
const db = require('./server/database/database.js'); 
// --- CHANGED LINE ---
const meditatorRoutes = require('./server/routes/meditatorRoutes'); // Was registrationRoutes

const app = express();
const PORT = process.env.PORT || 3000;

// === Middleware ===
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// === API Routes ===
// --- CHANGED LINE ---
app.use('/api', meditatorRoutes); // Was registrationRoutes

// === Root Route ===
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// === Start Server ===
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});