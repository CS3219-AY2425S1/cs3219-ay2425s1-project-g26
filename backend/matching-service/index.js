require('dotenv').config();
const express = require('express');
const app = express();
const { initRabbitMQ } = require('./queues/rabbitmq');
const { databaseConn } = require('./config/db');
const mongoose = require('mongoose');
const { handleMatchRequest } = require("./service/matchingQueue");


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

// Initialize RabbitMQ
initRabbitMQ();

//Test
// setTimeout(() => { handleMatchRequest({ id: '67062cdeefd82dc9e0c45a4b', category: 'array', complexity: 'Easy' });}, 15000)
// setTimeout(() => { handleMatchRequest({ id: 'Testing two', category: 'array', complexity: 'Easy' });}, 25000)