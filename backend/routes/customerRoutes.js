import express from "express";
import { createCustomer, getCustomers, getCustomerById, updateCustomer, deleteCustomer } from "../controllers/customerController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { validateCustomer } from "../middleware/validationMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(authorize("shopkeeper")); // only shopkeepers can manage customers

router.route("/")
  .post(validateCustomer, createCustomer)
  .get(getCustomers);

router.route("/:id")
  .get(getCustomerById)
  .put(validateCustomer, updateCustomer)
  .delete(deleteCustomer);

export default router;
