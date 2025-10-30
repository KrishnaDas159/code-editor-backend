// backend/controllers/sessionController.js
import Session from "../models/sessionModel.js";
import mongoose from "mongoose";
export const createSessionHandler = async (req, res) => {
  try {
    console.log("Incoming request body:", req.body);

    const { name, language, createdAt } = req.body;

    if (!name || !language) {
      return res.status(400).json({ message: "Missing required fields" });
    }

   
    const createdBy = req.user?.id;
    if (!createdBy) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const session = await Session.create({
      name,
      language,
      createdAt: createdAt || new Date(),
      createdBy,
    });

    return res.status(201).json(session);
  } catch (error) {
    console.error("Error creating session:", error);
    return res.status(500).json({ message: "Failed to create session" });
  }
};


export const getSessionHandler = async (req, res) => {
  try {
    const sessions = await Session.find({ createdBy: req.user.id }); 
    res.json(sessions);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getSessionByIdHandler = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid session ID format" });
    }

    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    res.json(session);
  } catch (error) {
    console.error("Error fetching session by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// backend/controllers/sessionController.js
export const joinSessionHandler = async (req, res) => {
  try {
    const { id } = req.params; // session id
    const userId = req.user.id;

    const session = await Session.findById(id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Avoid duplicate joins
    if (session.participants.includes(userId)) {
      return res.status(400).json({ message: "Already joined" });
    }

    session.participants.push(userId);
    await session.save();

    res.status(200).json({ message: "Joined successfully", session });
  } catch (error) {
    console.error("Error joining session:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// backend/controllers/sessionController.js
export const getJoinedSessionsHandler = async (req, res) => {
  try {
    const userId = req.user.id;

    const sessions = await Session.find({ participants: userId }).populate("createdBy", "name");
    res.json(sessions);
  } catch (error) {
    console.error("Error fetching joined sessions:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const updateSessionLanguageHandler = async (req, res) => {
  const { language } = req.body;
  try {
    const session = await Session.findByIdAndUpdate(
      req.params.id,
      { language },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.json(session);
  } catch (err) {
    console.error("Error updating session language:", err);
    res.status(500).json({ message: "Failed to update session language" });
  }
};


export const deleteSessionHandler = async (req, res) => {
  const sessionId = req.params.id;
  const userId = req.user.id; // From authentication middleware

  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ message: "Invalid session ID" });
    }

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Optional: Only allow creator to delete
    if (session.createdBy.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this session" });
    }

    await Session.findByIdAndDelete(sessionId);

    res.status(200).json({ message: "Session deleted successfully" });
  } catch (err) {
    console.error("Error deleting session:", err);
    res.status(500).json({ message: "Server error" });
  }
};