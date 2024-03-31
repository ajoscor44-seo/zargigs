import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET","POST","PUT","HEAD","DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});


io.on("connection", (socket) => {
  const userSocketMap = { userId: socket.id }
  
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId

  if (userId !== "undefined") {
    return userSocketMap(userId) = socket.id
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap))

  socket.on("disconnect", () => {
    console.log("User disconnects", socket.id);
    delete userSocketMap(userId)
  io.emit("getOnlineUsers", Object.keys(userSocketMap))
  });
});

export { app, io, server };
