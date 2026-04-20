import { Router } from "express";

import { studentController } from "../controllers/studentController.js";
import { authorizeRoles, requireAuth } from "../middlewares/authMiddleware.js";

const router = Router();

// Mount all student endpoints under /student
router.use("/student", requireAuth, authorizeRoles("student"));

router.get("/student/assignment", studentController.getMyAssignment);
router.get("/student/maintenance-requests", studentController.getMyMaintenanceRequests);
router.get("/student/profile", studentController.getStudentProfile);

export { router as studentRoutes };
