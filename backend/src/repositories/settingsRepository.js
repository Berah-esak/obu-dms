import { getDb } from "../config/firebase.js";
import { COLLECTIONS } from "../models/index.js";

// System settings are stored as a single document with id "global"
const docRef = () => getDb().collection(COLLECTIONS.SYSTEM_SETTINGS).doc("global");

const toSettings = (doc) => {
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

export const settingsRepository = {
  get: async () => {
    const doc = await docRef().get();
    return toSettings(doc);
  },

  upsert: async (payload) => {
    const now = new Date();
    const ref = docRef();
    const existing = await ref.get();
    if (existing.exists) {
      await ref.update({ ...payload, updatedAt: now });
    } else {
      await ref.set({ key: "global", ...payload, createdAt: now, updatedAt: now });
    }
    const updated = await ref.get();
    return toSettings(updated);
  },
};
