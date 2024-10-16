require('dotenv').config();
const express = require('express');
const app = express()
const { databaseConn } = require('./config/db');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 8082;

// Enable CORS for all routes
const cors = require('cors');
app.use(cors());

//Database connection to mongo
databaseConn();

// mongodb connection log
mongoose.connection.once('open', () => {
    console.log('connected to MongoDB');
    app.listen(PORT, () => console.log(`Matching service running on port ${PORT}`));
});


console.log("Connected to matching-service backend!");

