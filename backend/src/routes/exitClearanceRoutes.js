import express from "express";
import * as exitClearanceController from "../controllers/exitClearanceController.js";
import { requireAuth, authorizeRoles } from "../middlewares/authMiddleware.js";
import { SYSTEM_ROLES } from "../config/constants.js";

const router = express.Router();

// Student routes
router.post(
  "/",
  requireAuth,
  authorizeRoles("student"),
  exitClearanceController.submitExitRequest
);

router.get(
  "/my-requests",
  requireAuth,
  authorizeRoles("student"),
  exitClearanceController.getMyExitRequests
);

// Proctor Head routes
router.get(
  "/pending",
  requireAuth,
  authorizeRoles("dorm_admin", "system_admin"),
  exitClearanceController.getPendingExitRequests
);

router.post(
  "/:id/approve",
  requireAuth,
  authorizeRoles("dorm_admin", "system_admin"),
  exitClearanceController.approveExitRequest
);

router.post(
  "/:id/reject",
  requireAuth,
  authorizeRoles("dorm_admin", "system_admin"),
  exitClearanceController.rejectExitRequest
);

router.get(
  "/history",
  requireAuth,
  authorizeRoles("dorm_admin", "system_admin"),
  exitClearanceController.getExitRequestHistory
);

// Gate Guard routes
router.post(
  "/verify",
  requireAuth,
  authorizeRoles("gate_guard", "system_admin"),
  exitClearanceController.verifyExitCode
);

export default router;
