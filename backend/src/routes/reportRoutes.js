import { Router } from "express";

import { reportController } from "../controllers/reportController.js";
import { authorizeRoles, requireAuth } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(requireAuth, authorizeRoles("dorm_admin", "management", "system_admin"));

router.get("/reports/dashboard-summary", reportController.getDashboardSummary);
router.get("/reports/occupancy", reportController.getOccupancyReport);
router.get("/reports/student-directory", reportController.getStudentDirectory);
router.get("/reports/maintenance-summary", reportController.getMaintenanceSummary);
router.get("/reports/room-utilization", reportController.getRoomUtilization);
router.get("/reports/unassigned-students", reportController.getUnassignedStudentsReport);
router.get("/reports/inventory-condition", reportController.getInventoryConditionReport);
router.post("/reports/export", reportController.exportReport);

export { router as reportRoutes };
