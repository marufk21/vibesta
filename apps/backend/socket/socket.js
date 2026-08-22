import { Server } from 'socket.io';
import express from 'express';
import http from 'http';

const app = express();

const server = http.createServer(app);
// CORS origins: local dev origins plus production URLs.
// Frontend is hosted on Vercel; backend/API on Render.
// Override at deploy time via the CORS_ORIGINS env var (comma-separated).
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://vibesta.onrender.com',
  'https://vibesta-frontend.vercel.app',
];
if (process.env.CORS_ORIGINS) {
  allowedOrigins.push(
    ...process.env.CORS_ORIGINS.split(',')
      .map((o) => o.trim())
      .filter(Boolean)
  );
}

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
  },
});

const userSocketMap = {}; // this map stores socket id corresponding the user id; userId -> socketId

export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit('getOnlineUsers', Object.keys(userSocketMap));

  socket.on('disconnect', () => {
    if (userId) {
      delete userSocketMap[userId];
    }
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  });
});

export { app, server, io };
