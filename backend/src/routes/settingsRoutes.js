import { Router } from "express";

import { settingsController } from "../controllers/settingsController.js";
import { authorizeRoles, requireAuth } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(requireAuth, authorizeRoles("system_admin"));

router.get("/settings", settingsController.getSettings);
router.put("/settings", settingsController.saveSettings);

export { router as settingsRoutes };
