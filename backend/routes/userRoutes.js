import express from "express";
import { getAllUsers, toggleUserStatus, getPlatformStats } from "../controllers/userController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes here require admin privileges
router.use(protect);
router.use(authorize("admin"));

router.get("/", getAllUsers);
router.put("/:id/status", toggleUserStatus);
router.get("/stats", getPlatformStats);

export default router;
