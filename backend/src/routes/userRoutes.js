import { Router } from "express";

import { userController } from "../controllers/userController.js";
import { authorizeRoles, requireAuth } from "../middlewares/authMiddleware.js";
import { validate } from "../validators/index.js";
import { createUserSchema, updateUserSchema } from "../validators/userValidator.js";

const router = Router();

router.use(requireAuth, authorizeRoles("system_admin"));

router.get("/users", userController.getUsers);
router.post("/users", validate(createUserSchema), userController.createUser);
router.get("/users/:userId", userController.getUser);
router.put("/users/:userId", validate(updateUserSchema), userController.updateUser);
router.post("/users/:userId/deactivate", userController.deactivateUser);
router.post("/users/:userId/reactivate", userController.reactivateUser);
router.post("/users/:userId/reset-password", userController.adminResetPassword);
router.get("/roles/permissions", userController.getRolePermissions);

export { router as userRoutes };
