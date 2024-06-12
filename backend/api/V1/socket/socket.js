import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";
dotenv.config();

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin:
      process.env.NODE_ENV !== "production"
        ? [
            process.env.DEV_CLIENT_URL,
            process.env.DEV_ADMIN_URL,
            process.env.DEV_HOME_URL,
          ]
        : [
            process.env.PROD_CLIENT_URL,
            process.env.PROD_ADMIN_URL,
            process.env.PROD_HOME_URL,
          ],
    methods: ["GET", "POST", "PUT", "HEAD", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});

const userSocketMap = {};

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

io.on("connection", (socket) => {

  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId !== "undefined") {
    return (userSocketMap[userId] = socket.id);
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User disconnects", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, server };
