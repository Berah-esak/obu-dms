import { getDb } from "../config/firebase.js";
import { COLLECTIONS } from "../models/index.js";

const col = () => getDb().collection(COLLECTIONS.AUDIT_LOGS);

const toLog = (doc) => {
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

export const auditRepository = {
  findAll: async (filter = {}, options = {}) => {
    let query = col();
    for (const [key, value] of Object.entries(filter)) {
      query = query.where(key, "==", value);
    }
    query = query.orderBy("timestamp", "desc");
    if (options.offset) query = query.offset(options.offset);
    if (options.limit) query = query.limit(options.limit);
    const snap = await query.get();
    return snap.docs.map(toLog);
  },

  count: async (filter = {}) => {
    let query = col();
    for (const [key, value] of Object.entries(filter)) {
      query = query.where(key, "==", value);
    }
    const snap = await query.count().get();
    return snap.data().count;
  },

  create: async (payload) => {
    const now = new Date();
    const data = { ...payload, timestamp: payload.timestamp || now, createdAt: now };
    const ref = await col().add(data);
    return { id: ref.id, ...data };
  },
};
