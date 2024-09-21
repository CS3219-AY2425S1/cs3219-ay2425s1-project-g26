const mongoose = require("mongoose");
const { v4: uuid } = require('uuid');


const questionSchema = new mongoose.Schema({
    id: {
        type: String,
        default: uuid(),
    },
    title: {
        type: String,
        required: true
    },
    description: {
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
    }
})

module.exports = mongoose.model("questions", questionSchema);