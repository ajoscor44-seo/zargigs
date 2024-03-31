import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,HEAD,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnects", socket.id);
  });
});

export { app, io, server };
