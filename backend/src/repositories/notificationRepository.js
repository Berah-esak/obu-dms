import { getDb } from "../config/firebase.js";
import { COLLECTIONS } from "../models/index.js";

const col = () => getDb().collection(COLLECTIONS.NOTIFICATIONS);

const toNotification = (doc) => {
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

export const notificationRepository = {
  findByRecipient: async (recipient, options = {}) => {
    // Get all notifications and filter in memory to avoid index requirements
    const snap = await col().get();
    let results = snap.docs.map(toNotification);
    
    // Filter by recipient in memory
    results = results.filter(notif => notif.recipient === recipient);
    
    // Apply unread filter in memory if needed
    if (options.unreadOnly) {
      results = results.filter(notif => notif.isRead === false);
    }
    
    // Sort in memory by createdAt descending
    results.sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt || 0);
      const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt || 0);
      return dateB.getTime() - dateA.getTime();
    });
    
    // Apply pagination
    if (options.offset) {
      results = results.slice(options.offset);
    }
    if (options.limit) {
      results = results.slice(0, options.limit);
    }
    
    return results;
  },

  countUnread: async (recipient) => {
    // Get all notifications and count in memory to avoid index requirements
    const snap = await col().get();
    const results = snap.docs.map(toNotification);
    
    return results.filter(notif => 
      notif.recipient === recipient && notif.isRead === false
    ).length;
  },

  markRead: async (id) => {
    const ref = col().doc(id);
    await ref.update({ isRead: true, readAt: new Date(), updatedAt: new Date() });
    const updated = await ref.get();
    return toNotification(updated);
  },

  markAllRead: async (recipient) => {
    // Get all notifications and filter in memory to avoid index requirements
    const snap = await col().get();
    const unreadDocs = snap.docs.filter(doc => {
      const data = doc.data();
      return data.recipient === recipient && data.isRead === false;
    });
    
    const batch = getDb().batch();
    const now = new Date();
    unreadDocs.forEach((doc) => {
      batch.update(doc.ref, { isRead: true, readAt: now, updatedAt: now });
    });
    await batch.commit();
  },

  create: async (payload) => {
    const now = new Date();
    const data = { ...payload, isRead: false, createdAt: now, updatedAt: now };
    const ref = await col().add(data);
    return { id: ref.id, ...data };
  },
};
