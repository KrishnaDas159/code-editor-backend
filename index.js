import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import app from "./app.js";
import { setupSessionSocket } from "./sockets/sessionSocket.js";
import cors from "cors";

dotenv.config();

// ✅ Connect to MongoDB
connectDB();

// ✅ Set up Express CORS (important for frontend-backend communication)
app.use(
  cors({
    origin: ["https://code-editor-frontend-rosy.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const PORT = process.env.PORT || 3000;

// ✅ Create HTTP server
const server = http.createServer(app);

// ✅ Setup Socket.IO with correct CORS for production
const io = new Server(server, {
  cors: {
    origin: ["https://code-editor-frontend-rosy.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ✅ Handle socket events
setupSessionSocket(io);

// ✅ Optional: Debug connections (helpful during testing)
io.on("connection", (socket) => {
  console.log(`🟢 Socket connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`🔴 Socket disconnected: ${socket.id}`);
  });
});

// ✅ Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});









