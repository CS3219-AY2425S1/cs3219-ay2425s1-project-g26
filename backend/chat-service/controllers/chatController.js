const Chat = require('../models/Chat');

// Create a new chat to be stored in the database
const createChat = async (req, res) => {
    const { sessionId, user1Id, user2Id } = req.body;
    console.log(req.body);
    try {
        // Check if the session already exists
        const existingChat = await Chat.findOne({ sessionId });
        if (existingChat) {
          return res.status(400).send('Session already exists');
        }

        // Create a new session
        const newChat = new Chat({ sessionId, user1Id, user2Id, messages: [] });
        await newChat.save();

        res.status(201).json(newChat);
      } catch (error) {
        console.error("error:", error);
        res.status(500).send('Server error');
      }
}

// Retrieve a single chat by session ID
const getChatById = async (req, res) => {
    const sessionId = req.params.sessionId;

    try {
      const chat = await Chat.findOne({ sessionId });

      if (chat) {
        res.status(200).json(chat.messages);
      } else {
        res.status(404).send('Session not found');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }

};

// Add a message into chat db by session ID
const addMessage = async (req, res) => {
    const { id } = req.params;
    const { userId, message } = req.body;

    try {
        const chat = await Chat.findOne({ id });
        if (chat) {
          chat.messages.push({ userId, message });
          await chat.save();
          res.status(201).json(chat.messages);
        } else {
          res.status(404).send('Session not found');
        }
      } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
      }
}

// Export the controller functions
module.exports = {
    createChat,
    getChatById,
    addMessage,
};
