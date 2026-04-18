import { userService } from "../services/userService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const userController = {
  getUsers: asyncHandler(async (req, res) => {
    const data = await userService.getUsers(req.query);
    res.status(200).json(data);
  }),

  createUser: asyncHandler(async (req, res) => {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  }),

  getUser: asyncHandler(async (req, res) => {
    const user = await userService.getUser(req.params.userId);
    res.status(200).json(user);
  }),

  updateUser: asyncHandler(async (req, res) => {
    const user = await userService.updateUser(req.params.userId, req.body);
    res.status(200).json(user);
  }),

  deactivateUser: asyncHandler(async (req, res) => {
    const data = await userService.deactivate(req.params.userId);
    res.status(200).json({ success: true, ...data });
  }),

  reactivateUser: asyncHandler(async (req, res) => {
    const data = await userService.reactivate(req.params.userId);
    res.status(200).json({ success: true, ...data });
  }),

  adminResetPassword: asyncHandler(async (req, res) => {
    const data = await userService.adminResetPassword(req.params.userId);
    res.status(200).json({ success: true, ...data });
  }),

  getRolePermissions: asyncHandler(async (req, res) => {
    const data = await userService.getRolePermissions();
    res.status(200).json(data);
  }),
};
