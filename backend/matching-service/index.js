require('dotenv').config();
const express = require('express');
const app = express();
const { databaseConn } = require('./config/db');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 8082;

// Enable CORS for all routes
const cors = require('cors');
app.use(cors());

//Database connection to mongo
databaseConn();

app.use(express.json());
app.use('/matches', require('./routes/matches'));

// mongodb connection log
mongoose.connection.once('open', () => {
    // Only listen to the port after connected to mongodb.
    console.log('connected to MongoDB');
    app.listen(PORT, () => console.log(`Matching service running on port ${PORT}`));
});

const { initRabbitMQ } = require('./queues/rabbitmq');

// Initialize RabbitMQ
initRabbitMQ();
