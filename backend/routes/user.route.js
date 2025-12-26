import express from "express";

import { getAllUsers, changeUserRole} from "../controllers/user.controller.js";
import { protectRoute, requireRole } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, requireRole("admin", "sub-admin"), getAllUsers);
router.patch("/:id", protectRoute, requireRole("admin"), changeUserRole);

export default router;