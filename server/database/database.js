const sqlite3 = require('sqlite3').verbose();

// Use ':memory:' for an in-memory database, or a file path for persistence.
const DBSOURCE = __dirname + "/meditators.db";

const db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message);
      throw err;
    } else {
        console.log('Connected to the SQLite database.');
        // Create the table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS registrations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            number TEXT,
            shambhavi INTEGER DEFAULT 0,
            bhutta_shuddhi INTEGER DEFAULT 0,
            hatha_yoga INTEGER DEFAULT 0,
            bhava_spandana INTEGER DEFAULT 0,
            shoonya INTEGER DEFAULT 0,
            registration_date DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                // Table already created or error
                console.error("Error creating table:", err.message);
            } else {
                console.log("Table 'registrations' is ready.");
            }
        });
    }
});

module.exports = db;