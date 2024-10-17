const mongoose = require("mongoose");
const { v4: uuid } = require('uuid');

const matchSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        defualt: uuid(),
    },
    user1Id: {
        type: String,
        required: true
    },
    user2Id: {
            type: String,
            required: true
    },
    category: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        required: true
    }
    
})

module.exports = mongoose.model("matches", matchSchema);
