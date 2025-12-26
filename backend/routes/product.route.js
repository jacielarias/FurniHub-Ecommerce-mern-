import express from "express";
import { createProduct, getAllProducts, getFeaturedProducts, deleteProduct, getRecommendedProducts, getProductsByCategory, toggleFeaturedProduct, editProduct } from "../controllers/product.controller.js";
import { protectRoute, requireRole } from "../middleware/auth.middleware.js";

const router = express.Router();

// Routes
router.get("/", protectRoute, requireRole("admin", "manager"), getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/recommendations", getRecommendedProducts);
router.post("/", protectRoute, requireRole("admin", "manager"), createProduct);
router.put("/:id", protectRoute, requireRole("admin", "manager"), editProduct)
router.patch("/:id", protectRoute, requireRole("admin", "manager"), toggleFeaturedProduct);
router.delete("/:id", protectRoute, requireRole("admin", "manager"), deleteProduct);

export default router;