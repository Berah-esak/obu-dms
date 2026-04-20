import { Router } from "express";

import { inventoryController } from "../controllers/inventoryController.js";
import { authorizeRoles, requireAuth } from "../middlewares/authMiddleware.js";
import { validate } from "../validators/index.js";
import {
  addFurnitureSchema,
  updateFurnitureSchema,
  issueLinenSchema,
  returnLinenSchema,
  issueKeySchema,
  returnKeySchema,
} from "../validators/inventoryValidator.js";

const router = Router();

router.use(
  requireAuth,
  authorizeRoles("dorm_admin", "maintenance", "management", "system_admin")
);

router.get("/inventory/furniture/room/:roomId", inventoryController.getRoomFurniture);
router.post("/inventory/furniture", validate(addFurnitureSchema), inventoryController.addFurniture);
router.put("/inventory/furniture/:itemId", validate(updateFurnitureSchema), inventoryController.updateFurniture);
router.post("/inventory/linen/issue", validate(issueLinenSchema), inventoryController.issueLinen);
router.post("/inventory/linen/return", validate(returnLinenSchema), inventoryController.returnLinen);
router.post("/inventory/keys/issue", validate(issueKeySchema), inventoryController.issueKey);
router.post("/inventory/keys/return", validate(returnKeySchema), inventoryController.returnKey);
router.get("/inventory/keys/missing", inventoryController.getMissingKeys);

export { router as inventoryRoutes };
