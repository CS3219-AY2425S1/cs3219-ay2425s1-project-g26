const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Get chat messages based on session ID
router.get('/:sessionId', chatController.getChatById);

// Create a new chat session
router.post('/', chatController.createChat);

// Add a message to a chat session
router.post('/:sessionId', chatController.addMessage);

// Export the router
module.exports = router;
