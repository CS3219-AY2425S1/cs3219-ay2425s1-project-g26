const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');

// Get all matches
router.get('/', matchController.getAllMatches);

// Create a new match
router.post('/', matchController.createMatch);

// Get match based on ID
router.get('/:id', matchController.getMatchById);

// Optionally delete a match by ID
router.delete('/:id', matchController.deleteMatchById);

module.exports = router;