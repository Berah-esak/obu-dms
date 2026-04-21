import { Router } from "express";

import { roomController } from "../controllers/roomController.js";
import { authorizeRoles, requireAuth } from "../middlewares/authMiddleware.js";
import { validate } from "../validators/index.js";
import {
  createDormSchema,
  addFloorSchema,
  createRoomSchema,
  updateRoomSchema,
} from "../validators/roomValidator.js";

const router = Router();

// Public/Student accessible routes (no role restriction or student-only)
router.get("/rooms/available", requireAuth, roomController.getAvailableRooms);

// Admin-only routes
router.get("/dorms", requireAuth, authorizeRoles("dorm_admin", "management", "system_admin"), roomController.getAllDorms);
router.post("/dorms", requireAuth, authorizeRoles("dorm_admin", "management", "system_admin"), validate(createDormSchema), roomController.createDorm);
router.post("/dorms/:dormId/floors", requireAuth, authorizeRoles("dorm_admin", "management", "system_admin"), validate(addFloorSchema), roomController.addFloor);

router.get("/rooms", requireAuth, authorizeRoles("dorm_admin", "management", "system_admin"), roomController.getRooms);
router.post("/rooms", requireAuth, authorizeRoles("dorm_admin", "management", "system_admin"), validate(createRoomSchema), roomController.createRoom);
router.get("/rooms/:roomId", requireAuth, authorizeRoles("dorm_admin", "management", "system_admin"), roomController.getRoom);
router.put("/rooms/:roomId", requireAuth, authorizeRoles("dorm_admin", "management", "system_admin"), validate(updateRoomSchema), roomController.updateRoom);
router.get("/rooms/:roomId/occupants", requireAuth, authorizeRoles("dorm_admin", "management", "system_admin"), roomController.getRoomOccupants);

export { router as roomRoutes };
