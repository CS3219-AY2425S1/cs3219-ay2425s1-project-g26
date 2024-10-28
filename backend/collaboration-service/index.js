const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true,
};

const io = new Server(server, {
  cors: corsOptions,
});

const sessions = {}; // Store active sessions

io.on('connection', (socket) => {
  console.log("a user connected");

  socket.on("join", (sessionId) => {
    socket.join(sessionId);
    console.log(`User joined session: ${sessionId}`);
  });

  socket.on("codeChange", (sessionId, code) => {
    socket.to(sessionId).emit("codeUpdate", code);
  });

  socket.on("languageChange", (sessionId, newLanguage, newCode) => {
    socket.to(sessionId).emit("languageUpdate", newLanguage, newCode);
  });

  socket.on("endSession", (sessionId) => {
    console.log(`User ended the session in room: ${sessionId}`);
    socket.to(sessionId).emit("partnerLeft");
  });

  // whiteboard stuff
  socket.on("startDrawing", (sessionId, startX, startY, color, lineWidth) => {
    socket
      .to(sessionId)
      .emit("beginDrawing", { startX, startY, color, lineWidth });
  });

  socket.on("drawing", (sessionId, x, y) => {
    socket.to(sessionId).emit("drawingUpdate", { x, y });
  });

  socket.on("endDrawing", (sessionId) => {
    socket.to(sessionId).emit("finishDrawing");
  });

  socket.on("clearWhiteboard", (sessionId) => {
    socket.to(sessionId).emit("clearCanvas");
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// Start the server
server.listen(8084, () => {
  console.log('collaboration service running on port 8084');
});
