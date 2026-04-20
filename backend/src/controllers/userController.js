import { userService } from "../services/userService.js";
import { auditService } from "../services/auditService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const userController = {
  getUsers: asyncHandler(async (req, res) => {
    const data = await userService.getUsers(req.query);
    res.status(200).json({ success: true, data });
  }),

  createUser: asyncHandler(async (req, res) => {
    const user = await userService.createUser(req.body);
    
    auditService.log({
      user: req.user.id,
      action: "CREATE",
      entity: "User",
      entityId: user._id || user.id,
      ipAddress: req.ip,
    });

    res.status(201).json({ success: true, data: user });
  }),

  getUser: asyncHandler(async (req, res) => {
    const user = await userService.getUser(req.params.userId);
    res.status(200).json({ success: true, data: user });
  }),

  updateUser: asyncHandler(async (req, res) => {
    const user = await userService.updateUser(req.params.userId, req.body);
    
    auditService.log({
      user: req.user.id,
      action: "UPDATE",
      entity: "User",
      entityId: req.params.userId,
      ipAddress: req.ip,
    });

    res.status(200).json({ success: true, data: user });
  }),

  deactivateUser: asyncHandler(async (req, res) => {
    const data = await userService.deactivate(req.params.userId);
    
    auditService.log({
      user: req.user.id,
      action: "UPDATE",
      entity: "User",
      entityId: req.params.userId,
      details: "Deactivated",
      ipAddress: req.ip,
    });

    res.status(200).json({ success: true, data });
  }),

  reactivateUser: asyncHandler(async (req, res) => {
    const data = await userService.reactivate(req.params.userId);
    
    auditService.log({
      user: req.user.id,
      action: "UPDATE",
      entity: "User",
      entityId: req.params.userId,
      details: "Reactivated",
      ipAddress: req.ip,
    });

    res.status(200).json({ success: true, data });
  }),

  adminResetPassword: asyncHandler(async (req, res) => {
    const data = await userService.adminResetPassword(req.params.userId);
    
    auditService.log({
      user: req.user.id,
      action: "UPDATE",
      entity: "User",
      entityId: req.params.userId,
      details: "Admin reset password",
      ipAddress: req.ip,
    });

    res.status(200).json({ success: true, data });
  }),

  getRolePermissions: asyncHandler(async (req, res) => {
    const data = await userService.getRolePermissions();
    res.status(200).json({ success: true, data });
  }),
};
