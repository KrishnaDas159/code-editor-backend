import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { saveSession, getSavedSessions, unsaveSession } from "../controllers/saveController.js";

const router = express.Router();

router.post("/save", protect, saveSession);
router.get("/saved", protect, getSavedSessions);
router.delete("/unsave/:sessionId", protect, unsaveSession);

export default router;
