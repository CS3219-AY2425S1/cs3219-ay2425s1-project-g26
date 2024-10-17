const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const matchRequestController = require('../controllers/matchRequestController');

// Matches

// Get all matches
router.get('/', matchController.getAllMatches);

// Get match based on ID
router.get('/:id', matchController.getMatchById);


// Match Requests

// Create a new match request
router.post('/', matchRequestController.createMatchRequest);


// Cancel a match request by deleting it
router.delete('/:id', matchRequestController.cancelMatchRequest);

module.exports = router;