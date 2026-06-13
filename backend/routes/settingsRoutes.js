import express from "express";
import { getSettings, updateSettings } from "../controllers/settingsController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(authorize("shopkeeper"));

router.route("/")
  .get(getSettings)
  .put(updateSettings);

export default router;
