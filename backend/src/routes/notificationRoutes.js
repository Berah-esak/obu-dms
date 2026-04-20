import { Router } from "express";

import { notificationController } from "../controllers/notificationController.js";
import { authorizeRoles, requireAuth } from "../middlewares/authMiddleware.js";
import { validate } from "../validators/index.js";
import { broadcastSchema } from "../validators/notificationValidator.js";

const router = Router();

router.get("/notifications", requireAuth, notificationController.getNotifications);
router.get("/notifications/unread-count", requireAuth, notificationController.getUnreadCount);
router.put("/notifications/:notificationId/read", requireAuth, notificationController.markAsRead);
router.put("/notifications/read-all", requireAuth, notificationController.markAllAsRead);
router.post(
  "/notifications/broadcast",
  requireAuth,
  authorizeRoles("dorm_admin", "management", "system_admin"),
  validate(broadcastSchema),
  notificationController.broadcastNotification
);

export { router as notificationRoutes };
