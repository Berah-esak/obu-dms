import { Router } from "express";

import { allocationRoutes } from "./allocationRoutes.js";
import { authRoutes } from "./authRoutes.js";
import { auditRoutes } from "./auditRoutes.js";
import { healthRoutes } from "./healthRoutes.js";
import { inventoryRoutes } from "./inventoryRoutes.js";
import { maintenanceRoutes } from "./maintenanceRoutes.js";
import { notificationRoutes } from "./notificationRoutes.js";
import { reportRoutes } from "./reportRoutes.js";
import { roomChangeRoutes } from "./roomChangeRoutes.js";
import { roomRoutes } from "./roomRoutes.js";
import { studentRoutes } from "./studentRoutes.js";
import { userRoutes } from "./userRoutes.js";
import exitClearanceRoutes from "./exitClearanceRoutes.js";
import { jsonParser } from "../middlewares/jsonParser.js";

const router = Router();

// Apply JSON parser to all routes except maintenance (which uses multipart)
router.use("/health", jsonParser, healthRoutes);
router.use("/auth", jsonParser, authRoutes);
router.use("/exit-requests", jsonParser, exitClearanceRoutes);
router.use(jsonParser, roomChangeRoutes); // Move before other routes to ensure it's matched first
router.use(jsonParser, studentRoutes);
router.use(jsonParser, roomRoutes);
router.use(jsonParser, allocationRoutes);
router.use(maintenanceRoutes); // NO JSON parser - uses multer for multipart
router.use(jsonParser, inventoryRoutes);
router.use(jsonParser, reportRoutes);
router.use(jsonParser, userRoutes);
router.use(jsonParser, notificationRoutes);
router.use(jsonParser, auditRoutes);

export { router as appRouter };
