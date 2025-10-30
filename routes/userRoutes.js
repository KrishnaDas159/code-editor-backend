// routes/userRoutes.js
import express from "express";
import { updateUsername ,getUserProfile} from "../controllers/userController.js";

const router = express.Router();

// PUT /api/users/:id
router.get("/:id", getUserProfile);
router.put("/:id", updateUsername);

export default router;
