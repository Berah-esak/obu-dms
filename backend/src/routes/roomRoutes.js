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

router.use(
  requireAuth,
  authorizeRoles("dorm_admin", "management", "system_admin")
);

router.get("/dorms", roomController.getAllDorms);
router.post("/dorms", validate(createDormSchema), roomController.createDorm);
router.post("/dorms/:dormId/floors", validate(addFloorSchema), roomController.addFloor);

router.get("/rooms", roomController.getRooms);
router.post("/rooms", validate(createRoomSchema), roomController.createRoom);
router.get("/rooms/available", roomController.getAvailableRooms);
router.get("/rooms/:roomId", roomController.getRoom);
router.put("/rooms/:roomId", validate(updateRoomSchema), roomController.updateRoom);
router.get("/rooms/:roomId/occupants", roomController.getRoomOccupants);

export { router as roomRoutes };
