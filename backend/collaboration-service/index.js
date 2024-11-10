require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { databaseConn } = require('./config/db');
const mongoose = require('mongoose');
const { getWhiteboard, saveWhiteboard, clearWhiteboard } = require('./controllers/sessionsController');

const PORT = process.env.PORT || 8084;

const app = express();
const server = http.createServer(app);

const cors = require('cors');
// CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true,
};

app.use(cors({
  origin: 'http://localhost:5173'
}));

const io = new Server(server, {
  cors: corsOptions,
});

databaseConn();
app.use(express.json());
app.use('/sessions', require('./routes/sessions'));

const sessions = {}; // Store active sessions
let whiteboardData = []; //Store whiteboard line data
let drawingData = [] //Store whiteboard stroke data

// Socket connects to server
io.on('connection', (socket) => {
  console.log("A user connected");

  // When a user is matched, join a room
  socket.on("join", (sessionId) => {
    socket.join(sessionId);
    console.log(`User joined session: ${sessionId}`);
  });

  // When a user changes the code in the window, update it for all users in the same room
  socket.on("codeChange", (sessionId, code, language) => {
    const data = {
      code: code,
      language: language
    }
    socket.to(sessionId).emit("codeUpdate", data);
  });

  // When the code language is changed, change it for all users in the same room (this function might have to be changed)
  socket.on("languageChange", (sessionId, newLanguage, newCode) => {
    socket.to(sessionId).emit("languageUpdate", newLanguage, newCode);
  });

  // When a user leaves a session, alert the other user.
  socket.on("endSession", (sessionId) => {
    console.log(`User leaves session in room: ${sessionId}`);
    socket.to(sessionId).emit("partnerLeft");
    /*  Disabled
    // Notify other user and ask if they also want to end the session
    socket.to(sessionId).emit("confirmEndSession", elapsedTime);*/
  })

  /*
  // When a user leaves a session, prompt the other user for confirmation
  socket.on("endSession", (sessionId, elapsedTime) => {
    console.log(`User request to end the session in room: ${sessionId}`);
    // Notify other user and ask if they also want to end the session
    socket.to(sessionId).emit("confirmEndSession", elapsedTime);
  });*/

  /*  Disabled
  // Handle the other user's response to the session end prompt
  socket.on("responseEndSession", (sessionId, response, elapsedTime) => {
    if (response === "yes") {
      // If the other user agrees to end the session, notify both users
      io.in(sessionId).emit("endSessionBoth", elapsedTime);
    } else {
      // If the other user wants to continue, notify the first user
      socket.to(sessionId).emit("userContinues");
    }
  });*/


  // Whiteboard scokets
  socket.on('getDrawing', async (sessionId, callback) => {
    const data = await getWhiteboard(sessionId);
    callback({ data });
  });

  socket.on("startDrawing", (sessionId, startX, startY, color, lineWidth) => {
    socket
      .to(sessionId)
      .emit("beginDrawing", { startX, startY, color, lineWidth });
    whiteboardData.push(startX, startY, color, lineWidth);
  });

  socket.on("drawing", (sessionId, x, y) => {
    drawingData.push([x, y]);
    socket.to(sessionId).emit("drawingUpdate", { x, y });
  });

  socket.on("endDrawing", (sessionId) => {
    whiteboardData.push(drawingData);
    saveWhiteboard(sessionId, whiteboardData);
    drawingData = [];
    whiteboardData = [];
    socket.to(sessionId).emit("finishDrawing");
  });

  socket.on("clearWhiteboard", (sessionId) => {
    clearWhiteboard(sessionId);
    socket.to(sessionId).emit("clearCanvas");
  });

  socket.on('sendMessage', (message) => {
    socket.to(message.sessionId).emit('receiveMessage', message);
  });

});

// Mongodb connection log
mongoose.connection.once('open', () => {
  // Only listen to the port after connected to mongodb.
  console.log('connected to MongoDB');
  server.listen(PORT, () => console.log(`Collaboration service running on port ${PORT}`));
});

