import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './utils/db.js';
import userRoute from './routes/user_route.js';
import postRoute from './routes/post_route.js';
import messageRoute from './routes/message_route.js';
import { app, server } from './socket/socket.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(__dirname, '.env') });

const PORT = process.env.PORT || 3000;
const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};
app.use(cors(corsOptions));

// yha pr apni api ayengi
app.use('/api/v1/user', userRoute);
app.use('/api/v1/post', postRoute);
app.use('/api/v1/message', messageRoute);

app.use((req, res) => {
  res.status(404).json({
    message: 'API route not found',
    success: false,
  });
});

server.listen(PORT, () => {
  connectDB();
  console.log(`Server listen at port ${PORT}`);
});
