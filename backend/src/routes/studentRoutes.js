import { Router } from "express";

import { studentController } from "../controllers/studentController.js";
import { authorizeRoles, requireAuth } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(requireAuth, authorizeRoles("Student"));

router.get("/assignment", studentController.getMyAssignment);
router.get("/maintenance-requests", studentController.getMyMaintenanceRequests);
router.get("/profile", studentController.getStudentProfile);

export { router as studentRoutes };
