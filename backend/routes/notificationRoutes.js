import express from "express";
import { getNotifications, markAsRead, getReminderMessage } from "../controllers/notificationController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getNotifications);
router.put("/:id/read", markAsRead);
router.post("/send-reminder", authorize("shopkeeper"), getReminderMessage);

export default router;
