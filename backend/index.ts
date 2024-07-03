import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const PORT = 5000;
const app = express();

app.use(
  cors({
    origin: ['http://localhost:5173'],
    credentials: true,
  })
);

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173'],
    credentials: true,
  },
});

app.get('/login', (req, res) => {
  const token = jwt.sign({ id: 'asjdflajdf' }, 'asdfadsf', { expiresIn: '1d' });
  res
    .cookie('token', token, { httpOnly: true, secure: true })
    .json({ message: 'User Login successfully ' });
});

io.on('connection', (socket) => {
  socket.emit('welcome', 'Welcome from the server');
  console.log('USER CONNECTED');
  socket.on('message', ({ room, message }) => {
    socket.to(room).emit('response', `Message Response = ${message}`);
  });
  socket.on('join-room', (room) => {
    socket.join(room);
  });
});

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

server.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);
