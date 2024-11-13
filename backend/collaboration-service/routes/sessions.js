const express = require('express');
const router = express.Router();
const sessionsController = require('../controllers/sessionsController');

// Get session based on session id
router.get('/:id', sessionsController.getSession)

// Create new session based on session id
router.post('/:id', sessionsController.createSession);

// Update session
router.patch('/:id', sessionsController.updateSession);

// Delete session
router.delete('/:id', sessionsController.deleteSession)

module.exports = router;