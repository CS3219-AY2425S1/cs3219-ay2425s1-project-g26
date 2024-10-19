const mongoose = require("mongoose");
const { v4: uuid } = require('uuid');

const matchSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true
    },
    user1Id: {
        type: String,
        required: true
    },
    user1Name: {
        type: String,
        required: true
    },
    user2Id: {
        type: String,
        required: true
    },
    user2Name: {
        type: String,
        required: true
    },
    category: {
        type: Array,
        required: true
    },
    complexity: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now, // Setting default to the current date/time
    },
})

module.exports = mongoose.model("matches", matchSchema);
