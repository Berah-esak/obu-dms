import { getDb } from "../config/firebase.js";
import { COLLECTIONS } from "../models/index.js";

const col = () => getDb().collection(COLLECTIONS.ROOM_CHANGE_REQUESTS);

const toRequest = (doc) => {
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

export const roomChangeRepository = {
  findById: async (id) => {
    const doc = await col().doc(id).get();
    return toRequest(doc);
  },

  findByStudent: async (studentId) => {
    const snap = await col()
      .where("student", "==", studentId)
      .get();
    // Sort in memory instead of using orderBy to avoid index requirement
    const docs = snap.docs.map(toRequest);
    return docs.sort((a, b) => {
      const dateA = a.submittedAt?.toDate?.() || a.submittedAt || new Date(0);
      const dateB = b.submittedAt?.toDate?.() || b.submittedAt || new Date(0);
      return dateB - dateA; // descending order
    });
  },

  findPending: async () => {
    const snap = await col()
      .where("status", "==", "pending")
      .get();
    // Sort in memory instead of using orderBy to avoid index requirement
    const docs = snap.docs.map(toRequest);
    return docs.sort((a, b) => {
      const dateA = a.submittedAt?.toDate?.() || a.submittedAt || new Date(0);
      const dateB = b.submittedAt?.toDate?.() || b.submittedAt || new Date(0);
      return dateB - dateA; // descending order
    });
  },

  create: async (payload) => {
    const now = new Date();
    const data = {
      ...payload,
      status: payload.status || "pending",
      submittedAt: payload.submittedAt || now,
      createdAt: now,
      updatedAt: now,
    };
    const ref = await col().add(data);
    return { id: ref.id, ...data };
  },

  updateById: async (id, payload) => {
    const ref = col().doc(id);
    await ref.update({ ...payload, updatedAt: new Date() });
    const updated = await ref.get();
    return toRequest(updated);
  },
};
