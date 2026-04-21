import { Router } from "express";

import { maintenanceController } from "../controllers/maintenanceController.js";
import { authorizeRoles, requireAuth } from "../middlewares/authMiddleware.js";
import { upload } from "../config/multer.js";
import { validate } from "../validators/index.js";
import {
  submitMaintenanceSchema,
  updateStatusSchema,
  addNoteSchema,
  reassignSchema,
  approveMaintenanceSchema,
  rejectMaintenanceSchema,
} from "../validators/maintenanceValidator.js";

const router = Router();

router.get(
  "/maintenance-requests",
  requireAuth,
  authorizeRoles("dorm_admin", "maintenance", "management", "system_admin"),
  maintenanceController.getMaintenanceRequests
);

router.get(
  "/maintenance-requests/pending",
  requireAuth,
  authorizeRoles("dorm_admin", "management", "system_admin"),
  maintenanceController.getPendingMaintenanceRequests
);

router.post(
  "/maintenance-requests",
  requireAuth,
  authorizeRoles("student", "dorm_admin", "system_admin"),
  upload.single("image"), // Accept single image file
  maintenanceController.submitMaintenanceRequest
);

router.get(
  "/maintenance-requests/assigned",
  requireAuth,
  authorizeRoles("maintenance"),
  maintenanceController.getAssignedRequests
);

router.put(
  "/maintenance-requests/:requestId/approve",
  requireAuth,
  authorizeRoles("dorm_admin", "system_admin"),
  validate(approveMaintenanceSchema),
  maintenanceController.approveMaintenanceRequest
);

router.put(
  "/maintenance-requests/:requestId/reject",
  requireAuth,
  authorizeRoles("dorm_admin", "system_admin"),
  validate(rejectMaintenanceSchema),
  maintenanceController.rejectMaintenanceRequest
);

router.put(
  "/maintenance-requests/:requestId/status",
  requireAuth,
  authorizeRoles("maintenance", "dorm_admin", "system_admin"),
  validate(updateStatusSchema),
  maintenanceController.updateMaintenanceStatus
);

router.post(
  "/maintenance-requests/:requestId/notes",
  requireAuth,
  authorizeRoles("maintenance", "dorm_admin", "system_admin"),
  validate(addNoteSchema),
  maintenanceController.addMaintenanceNote
);

router.put(
  "/maintenance-requests/:requestId/reassign",
  requireAuth,
  authorizeRoles("dorm_admin", "system_admin"),
  validate(reassignSchema),
  maintenanceController.reassignMaintenanceRequest
);

export { router as maintenanceRoutes };
