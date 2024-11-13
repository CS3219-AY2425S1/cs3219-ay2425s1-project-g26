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
        isAvailable: {
            type: Boolean,
            default: false
        },
        python: {
            params: {
                type: String,
                default: ""
            },
            input: {
                type: Array,
                default: []
            },
            output: {
                type: Array,
                default: []
            }
        },
        java: {
            params: {
                type: String,
                default: ""
            },
            input: {
                type: Array,
                default: []
            },
            output: {
                type: Array,
                default: []
            },
            return_type: {
                type: String,
                default: ""
            },
        }
    }
})

module.exports = mongoose.model("questions", questionSchema);