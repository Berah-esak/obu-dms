import { authService } from "../services/authService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const authController = {
  login: asyncHandler(async (req, res) => {
    const data = await authService.login(req.body);
    res.status(200).json({
      success: true,
      ...data,
    });
  }),

  logout: asyncHandler(async (req, res) => {
    const data = await authService.logout(req.user?.id);
    res.status(200).json({ success: true, ...data });
  }),

  forgotPassword: asyncHandler(async (req, res) => {
    const data = await authService.forgotPassword(req.body);
    res.status(200).json({ success: true, ...data });
  }),

  resetPassword: asyncHandler(async (req, res) => {
    const data = await authService.resetPassword(req.body);
    res.status(200).json({ success: true, ...data });
  }),

  validateSession: asyncHandler(async (req, res) => {
    const data = await authService.validateSession(req.user.id);
    res.status(200).json(data);
  }),
};
