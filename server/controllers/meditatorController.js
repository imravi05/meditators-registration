const db = require('../database/database.js');

// === CREATE ===
// (This is your original registration function, just renamed)
exports.createMeditator = (req, res) => {
    const { name, email, number, programs } = req.body;

    if (!name || !email) {
        return res.status(400).json({ "error": "Name and Email are required." });
    }

    const sql = `INSERT INTO registrations (
        name, email, number, 
        shambhavi, bhutta_shuddhi, hatha_yoga, bhava_spandana, shoonya
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    const params = [
        name,
        email,
        number,
        programs.shambhavi ? 1 : 0,
        programs.bhutta_shuddhi ? 1 : 0,
        programs.hatha_yoga ? 1 : 0,
        programs.bhava_spandana ? 1 : 0,
        programs.shoonya ? 1 : 0
    ];

    db.run(sql, params, function(err) {
        if (err) {
            if (err.message.includes("UNIQUE constraint failed")) {
                return res.status(400).json({ "error": "This email is already registered." });
            }
            console.error(err.message);
            return res.status(500).json({ "error": "Database error: " + err.message });
        }
        
        res.status(201).json({
            "message": "Success! Registration complete.",
            "data": req.body,
            "id": this.lastID
        });
    });
};

// === READ (Get All) ===
exports.getAllMeditators = (req, res) => {
    const sql = "SELECT * FROM registrations";
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ "error": err.message });
            return;
        }
        res.status(200).json({
            "message": "success",
            "data": rows
        });
    });
};

// === READ (Get One by ID) ===
exports.getMeditatorById = (req, res) => {
    const sql = "SELECT * FROM registrations WHERE id = ?";
    const params = [req.params.id];

    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(500).json({ "error": err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ "error": "Meditator not found." });
            return;
        }
        res.status(200).json({
            "message": "success",
            "data": row
        });
    });
};

// === UPDATE ===
exports.updateMeditator = (req, res) => {
    const { name, email, number, programs } = req.body;
    const id = req.params.id;

    if (!name || !email || !programs) {
        return res.status(400).json({ "error": "Name, email, and programs object are required." });
    }

    const sql = `
        UPDATE registrations SET 
            name = ?, 
            email = ?, 
            number = ?, 
            shambhavi = ?, 
            bhutta_shuddhi = ?, 
            hatha_yoga = ?, 
            bhava_spandana = ?, 
            shoonya = ? 
        WHERE id = ?
    `;

    const params = [
        name,
        email,
        number,
        programs.shambhavi ? 1 : 0,
        programs.bhutta_shuddhi ? 1 : 0,
        programs.hatha_yoga ? 1 : 0,
        programs.bhava_spandana ? 1 : 0,
        programs.shoonya ? 1 : 0,
        id
    ];

    db.run(sql, params, function(err) {
        if (err) {
            res.status(500).json({ "error": err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ "error": "Meditator not found, no updates made." });
            return;
        }
        res.status(200).json({
            "message": `Success! Meditator (ID: ${id}) updated.`,
            "changes": this.changes
        });
    });
};

// === DELETE ===
exports.deleteMeditator = (req, res) => {
    const sql = 'DELETE FROM registrations WHERE id = ?';
    const params = [req.params.id];

    db.run(sql, params, function(err) {
        if (err) {
            res.status(500).json({ "error": err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ "error": "Meditator not found, nothing deleted." });
            return;
        }
        res.status(200).json({
            "message": `Success! Meditator (ID: ${req.params.id}) deleted.`,
            "changes": this.changes
        });
    });
};