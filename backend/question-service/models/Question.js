const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
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
    },
    testcase: {
        python: {
            params: {
                type: String
            },
            input: {
                type: Array
            },
            output: {
                type: Array
            }
        },
        java: {
            params: {
                type: String
            },
            input: {
                type: Array
            },
            output: {
                type: Array
            }
        }
    }
})

module.exports = mongoose.model("questions", questionSchema);