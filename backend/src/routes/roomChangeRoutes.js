import { Router } from "express";

import { roomChangeController } from "../controllers/roomChangeController.js";
import { authorizeRoles, requireAuth } from "../middlewares/authMiddleware.js";
import { validate } from "../validators/index.js";
import {
  submitRoomChangeSchema,
  approveRoomChangeSchema,
  rejectRoomChangeSchema,
} from "../validators/roomChangeValidator.js";

const router = Router();

// More specific routes first to avoid conflicts
router.get(
  "/room-change-requests/pending",
  requireAuth,
  authorizeRoles("dorm_admin", "management", "system_admin"),
  roomChangeController.getPendingRoomChangeRequests
);

router.put(
  "/room-change-requests/:requestId/approve",
  requireAuth,
  authorizeRoles("dorm_admin", "system_admin"),
  validate(approveRoomChangeSchema),
  roomChangeController.approveRoomChange
);

router.put(
  "/room-change-requests/:requestId/reject",
  requireAuth,
  authorizeRoles("dorm_admin", "system_admin"),
  validate(rejectRoomChangeSchema),
  roomChangeController.rejectRoomChange
);

// Student routes - less specific, should come after
router.get(
  "/room-change-requests",
  requireAuth,
  authorizeRoles("student"),
  roomChangeController.getMyRoomChangeRequests
);

router.post(
  "/room-change-requests",
  (req, res, next) => {
    console.log("[DEBUG] POST /room-change-requests route hit - student route");
    next();
  },
  requireAuth,
  authorizeRoles("student"),
  validate(submitRoomChangeSchema),
  roomChangeController.submitRoomChangeRequest
);

export { router as roomChangeRoutes };
