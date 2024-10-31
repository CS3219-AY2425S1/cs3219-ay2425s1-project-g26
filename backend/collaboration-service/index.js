require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { databaseConn } = require('./config/db');
const mongoose = require('mongoose');

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
let wb_data = []; //Store active wb data (lines)
let drawing_data = [] //Store active drawing data

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

  // When a user leaves a session, notify everyone in the room
  socket.on("endSession", (sessionId) => {
    console.log(`User ended the session in room: ${sessionId}`);
    socket.to(sessionId).emit("partnerLeft");
  });


  // whiteboard stuff
  socket.on('getDrawing', (callback) => {
    callback({ wb_data });
  });

  socket.on("startDrawing", (sessionId, startX, startY, color, lineWidth) => {
    socket
      .to(sessionId)
      .emit("beginDrawing", { startX, startY, color, lineWidth });  
    wb_data.push([startX, startY, color, lineWidth]);
  });

  socket.on("drawing", (sessionId, x, y) => {
    drawing_data.push([x, y]);
    socket.to(sessionId).emit("drawingUpdate", { x, y });
  });

  socket.on("endDrawing", (sessionId) => {
    wb_data[wb_data.length - 1].push(drawing_data);
    drawing_data = [];
    socket.to(sessionId).emit("finishDrawing");
  });

  socket.on("clearWhiteboard", (sessionId) => {
    wb_data = [];
    socket.to(sessionId).emit("clearCanvas");
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

/*
// Start the server
server.listen(8084, () => {
  console.log('collaboration service running on port 8084');
});*/
// Mongodb connection log
mongoose.connection.once('open', () => {
  // Only listen to the port after connected to mongodb.
  console.log('connected to MongoDB');
  server.listen(PORT, () => console.log(`Collaboration service running on port ${PORT}`));
});

