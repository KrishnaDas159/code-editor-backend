import Session from "../models/sessionModel.js";

const rooms = {}; 

export function setupSessionSocket(io) {
  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // --------------------- JOIN ROOM ---------------------
    socket.on("join", async ({ roomId, userName, userId }) => {
      if (!rooms[roomId]) {
        rooms[roomId] = {
          users: [],
          code: "// start code here",
          language: "typescript",
          messages: [],
        };
      }

      // Ensure no duplicate socket entries
      rooms[roomId].users = rooms[roomId].users.filter(
        (u) => u.socketId !== socket.id
      );

      rooms[roomId].users.push({ name: userName, socketId: socket.id });
      socket.join(roomId);

      // Update DB participants
      try {
        if (userId) {
          await Session.findByIdAndUpdate(roomId, {
            $addToSet: { participants: userId },
          });
        }
      } catch (err) {
        console.error("Failed to add participant:", err);
      }

      // Send updated user list to all clients
      const uniqueUsers = Array.from(
        new Map(rooms[roomId].users.map((u) => [u.name, u])).values()
      );
      io.to(roomId).emit("userJoined", uniqueUsers.map((u) => u.name));

      // Send current code + language + existing messages
      socket.emit("codeUpdate", rooms[roomId].code);
      socket.emit("languageUpdate", rooms[roomId].language);
      socket.emit("chatHistory", rooms[roomId].messages);

      console.log(`👥 ${userName} joined room ${roomId}`);
    });

    // --------------------- CODE SYNC ---------------------
    socket.on("codeChange", ({ roomId, code }) => {
      if (rooms[roomId]) rooms[roomId].code = code;
      socket.to(roomId).emit("codeUpdate", code);
    });

    // --------------------- LANGUAGE SYNC ---------------------
    socket.on("languageChange", ({ roomId, language }) => {
      if (rooms[roomId]) rooms[roomId].language = language;
      socket.to(roomId).emit("languageUpdate", language);
    });

    // --------------------- CHAT SYSTEM ---------------------
    socket.on("sendMessage", ({ roomId, userName, message }) => {
      if (!rooms[roomId]) return;

      const msg = {
        userName,
        message,
        time: new Date().toISOString(),
      };

      // Save message in memory (optional: persist in DB)
      rooms[roomId].messages.push(msg);

      // Broadcast to all users in the room
      io.to(roomId).emit("receiveMessage", msg);
    });

    // --------------------- TYPING INDICATOR ---------------------
    socket.on("typing", ({ roomId, userName }) => {
      socket.to(roomId).emit("userTyping", userName);
    });

    // --------------------- LEAVE ROOM ---------------------
    socket.on("leaveRoom", async ({ roomId, userName, userId }) => {
      if (!roomId || !rooms[roomId]) return;

      rooms[roomId].users = rooms[roomId].users.filter(
        (u) => u.socketId !== socket.id
      );
      io.to(roomId).emit("userJoined", rooms[roomId].users.map((u) => u.name));

      socket.leave(roomId);

      try {
        if (userId) {
          await Session.findByIdAndUpdate(roomId, {
            $pull: { participants: userId },
          });
        }
      } catch (err) {
        console.error("Failed to remove participant:", err);
      }

      console.log(`🚪 ${userName} left room ${roomId}`);
    });

    // --------------------- DISCONNECT ---------------------
    socket.on("disconnect", () => {
      for (const [roomId, room] of Object.entries(rooms)) {
        const index = room.users.findIndex((u) => u.socketId === socket.id);
        if (index !== -1) {
          const userName = room.users[index].name;
          room.users.splice(index, 1);
          io.to(roomId).emit("userJoined", room.users.map((u) => u.name));
          console.log(`${userName} disconnected from ${roomId}`);
        }
      }
    });
  });
}







