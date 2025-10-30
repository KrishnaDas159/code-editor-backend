import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import app from "./app.js";
import { setupSessionSocket } from "./sockets/sessionSocket.js";

dotenv.config();
connectDB();

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Setup Socket.IO events
setupSessionSocket(io);

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));









