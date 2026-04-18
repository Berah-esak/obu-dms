import { notificationRepository } from "../repositories/notificationRepository.js";

export const notificationService = {
  getNotifications: async (userId, query) => {
    const limit = Number(query.limit || 20);
    const offset = Number(query.offset || 0);
    const unreadOnly = query.unreadOnly === "true";

    const notifications = await notificationRepository.findByRecipient(userId, {
      limit,
      offset,
      unreadOnly,
    });

    return { notifications, total: notifications.length };
  },

  getUnreadCount: async (userId) => ({ count: await notificationRepository.countUnread(userId) }),

  markAsRead: async (id) => {
    await notificationRepository.markRead(id);
    return { message: "Marked as read" };
  },

  markAllAsRead: async (userId) => {
    await notificationRepository.markAllRead(userId);
    return { message: "All marked as read" };
  },

  broadcast: async (payload, actorId) => {
    await notificationRepository.create({
      recipient: payload.target === "specific_user" ? payload.targetId : undefined,
      title: payload.title,
      message: payload.message,
      type: "announcement",
      target: payload.target,
      targetId: payload.targetId,
      attachmentUrl: payload.attachmentUrl,
      createdBy: actorId,
    });

    return { message: "Broadcast sent" };
  },
};
