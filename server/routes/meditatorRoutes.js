const express = require('express');
const router = express.Router();
const controller = require('../controllers/meditatorController'); // Renamed controller

// === CREATE ===
// POST /api/register
// Your existing frontend will still work with this endpoint!
router.post('/register', controller.createMeditator);

// === READ ===
// GET /api/meditators (Get all)
router.get('/meditators', controller.getAllMeditators);

// GET /api/meditators/:id (Get one)
router.get('/meditators/:id', controller.getMeditatorById);

// === UPDATE ===
// PUT /api/meditators/:id
router.put('/meditators/:id', controller.updateMeditator);

// === DELETE ===
// DELETE /api/meditators/:id
router.delete('/meditators/:id', controller.deleteMeditator);


module.exports = router;