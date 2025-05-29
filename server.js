const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

let rooms = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-game', (roomId) => {
    if (!rooms[roomId]) rooms[roomId] = [];
    rooms[roomId].push(socket.id);
    socket.join(roomId);

    io.to(roomId).emit('player-joined', rooms[roomId]);
  });

  socket.on('make-move', ({ roomId, move }) => {
    socket.to(roomId).emit('opponent-move', move);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Remove from rooms logic
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

