import Session from "../models/sessionModel.js";


// Save a session
export const saveSession = async (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId) return res.status(400).json({ message: "Session ID required" });

  try {
    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });

    if (!req.user.savedSessions.includes(sessionId)) {
      req.user.savedSessions.push(sessionId);
      await req.user.save();
    }

    res.json({ message: "Session saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get saved sessions
export const getSavedSessions = async (req, res) => {
  try {
    const savedSessions = await Session.find({ _id: { $in: req.user.savedSessions } });
    res.json(savedSessions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Unsave a session
export const unsaveSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    req.user.savedSessions = req.user.savedSessions.filter(id => id.toString() !== sessionId);
    await req.user.save();
    res.json({ message: "Session removed from saved projects" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
