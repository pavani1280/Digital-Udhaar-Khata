import express from "express";
import { createTransaction, getTransactions, getShopkeeperStats, getMonthlyReport } from "../controllers/transactionController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { validateTransaction } from "../middleware/validationMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(authorize("shopkeeper"));

router.route("/")
  .post(validateTransaction, createTransaction)
  .get(getTransactions);

router.get("/stats", getShopkeeperStats);
router.get("/report", getMonthlyReport);

export default router;
