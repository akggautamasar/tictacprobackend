const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join-game", (roomId) => {
    socket.join(roomId);
    io.to(roomId).emit("player-joined", socket.id);
  });

  socket.on("make-move", (data) => {
    socket.to(data.roomId).emit("opponent-move", data.move);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
