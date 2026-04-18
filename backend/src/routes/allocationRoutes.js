import { Router } from "express";

import { allocationController } from "../controllers/allocationController.js";
import { roomController } from "../controllers/roomController.js";
import { authorizeRoles, requireAuth } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(
  requireAuth,
  authorizeRoles("Dorm Admin", "Management", "System Admin")
);

router.post("/allocation/eligible-students", allocationController.getEligibleStudents);
router.post("/allocation/automatic", allocationController.autoAllocate);
router.post("/allocation/manual", allocationController.manualAllocate);
router.get("/students/unassigned", roomController.getUnassignedStudents);
router.delete("/assignments/:assignmentId/vacate", allocationController.vacateRoom);

export { router as allocationRoutes };
