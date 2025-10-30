// backend/routes/sessionRoutes.js
import express from "express";
import { 
  createSessionHandler, 
  getSessionHandler, 
  getSessionByIdHandler,
  getJoinedSessionsHandler,
  joinSessionHandler,
  updateSessionLanguageHandler,
  deleteSessionHandler   
} from "../controllers/sessionController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();


router.post("/", protect, createSessionHandler);           // Create session
router.get("/joined", protect, getJoinedSessionsHandler);  // Get sessions the user has joined
router.get("/", protect, getSessionHandler);               // Sessions created by logged-in user
router.get("/:id", getSessionByIdHandler);                 // Get single session by ID
router.post("/:id/join", protect, joinSessionHandler);     // Join a session by ID
router.put("/:id", updateSessionLanguageHandler);          // Update session language
router.delete("/:id", protect, deleteSessionHandler);      // <-- Delete session

export default router;
