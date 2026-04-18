import { notificationService } from "../services/notificationService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const notificationController = {
  getNotifications: asyncHandler(async (req, res) => {
    const data = await notificationService.getNotifications(req.user.id, req.query);
    res.status(200).json(data);
  }),

  getUnreadCount: asyncHandler(async (req, res) => {
    const data = await notificationService.getUnreadCount(req.user.id);
    res.status(200).json(data);
  }),

  markAsRead: asyncHandler(async (req, res) => {
    const data = await notificationService.markAsRead(req.params.notificationId);
    res.status(200).json({ success: true, ...data });
  }),

  markAllAsRead: asyncHandler(async (req, res) => {
    const data = await notificationService.markAllAsRead(req.user.id);
    res.status(200).json({ success: true, ...data });
  }),

  broadcastNotification: asyncHandler(async (req, res) => {
    const data = await notificationService.broadcast(req.body, req.user.id);
    res.status(200).json({ success: true, ...data });
  }),
};
