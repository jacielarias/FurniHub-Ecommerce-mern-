import express from "express";

import { getAllUsers, changeUserRole} from "../controllers/user.controller.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, adminRoute, getAllUsers);
router.patch("/:id", protectRoute, adminRoute, changeUserRole);

export default router;