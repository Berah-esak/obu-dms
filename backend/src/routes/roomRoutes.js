import { Router } from "express";

import { roomController } from "../controllers/roomController.js";
import { authorizeRoles, requireAuth } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(
  requireAuth,
  authorizeRoles("Dorm Admin", "Management", "System Admin")
);

router.get("/dorms", roomController.getAllDorms);
router.post("/dorms", roomController.createDorm);
router.post("/dorms/:dormId/floors", roomController.addFloor);

router.get("/rooms", roomController.getRooms);
router.post("/rooms", roomController.createRoom);
router.get("/rooms/available", roomController.getAvailableRooms);
router.get("/rooms/:roomId", roomController.getRoom);
router.put("/rooms/:roomId", roomController.updateRoom);
router.get("/rooms/:roomId/occupants", roomController.getRoomOccupants);

export { router as roomRoutes };
