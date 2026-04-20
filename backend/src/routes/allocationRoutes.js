import { Router } from "express";

import { allocationController } from "../controllers/allocationController.js";
import { roomController } from "../controllers/roomController.js";
import { authorizeRoles, requireAuth } from "../middlewares/authMiddleware.js";
import { validate } from "../validators/index.js";
import {
  eligibleStudentsSchema,
  autoAllocateSchema,
  manualAllocateSchema,
} from "../validators/allocationValidator.js";

const router = Router();

router.use(
  requireAuth,
  authorizeRoles("dorm_admin", "management", "system_admin")
);

router.post("/allocation/eligible-students", validate(eligibleStudentsSchema), allocationController.getEligibleStudents);
router.post("/allocation/automatic", validate(autoAllocateSchema), allocationController.autoAllocate);
router.post("/allocation/manual", validate(manualAllocateSchema), allocationController.manualAllocate);
router.get("/students/unassigned", roomController.getUnassignedStudents);
router.delete("/assignments/:assignmentId/vacate", allocationController.vacateRoom);

export { router as allocationRoutes };
