import express from "express";
import { protectRoute, requireRole } from "../middleware/auth.middleware.js";
import { getAllOrders, changeOrderStatus } from "../controllers/order.controller.js"

const router = express.Router();

// Routes
router.get("/", protectRoute, getAllOrders);
router.put("/:id", protectRoute, requireRole("admin", "sub-admin"), changeOrderStatus);  

export default router;