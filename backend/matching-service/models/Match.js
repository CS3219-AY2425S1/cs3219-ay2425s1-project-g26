const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
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
    complexity: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("matches", matchSchema);
