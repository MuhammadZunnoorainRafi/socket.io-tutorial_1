import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

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

io.on('connection', (socket) => {
  console.log('User Connected');
  console.log('ID: ', socket.id);
});

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

server.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);
