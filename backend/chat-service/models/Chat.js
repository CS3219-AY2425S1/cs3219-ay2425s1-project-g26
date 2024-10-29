const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  userId: String,
  message: String,
  timeSent: { type: Date, default: Date.now },
});

const chatSchema = new mongoose.Schema({
  sessionId: String,
  user1Id: { type: String, required: true },
  user2Id: { type: String, required: true },
  messages: [messageSchema],
});

module.exports = mongoose.model('Chat', chatSchema);
