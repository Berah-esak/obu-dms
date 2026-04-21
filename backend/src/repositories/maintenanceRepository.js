import { getDb } from "../config/firebase.js";
import { COLLECTIONS } from "../models/index.js";

const col = () => getDb().collection(COLLECTIONS.MAINTENANCE_REQUESTS);

const toRequest = (doc) => {
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

export const maintenanceRepository = {
  findById: async (id) => {
    const doc = await col().doc(id).get();
    return toRequest(doc);
  },

  findAll: async (filter = {}) => {
    let query = col();
    for (const [key, value] of Object.entries(filter)) {
      query = query.where(key, "==", value);
    }
    // Don't use orderBy to avoid index requirement
    const snap = await query.get();
    const docs = snap.docs.map(toRequest);
    // Sort in memory
    return docs.sort((a, b) => {
      const dateA = a.submittedAt?.toDate?.() || a.submittedAt || new Date(0);
      const dateB = b.submittedAt?.toDate?.() || b.submittedAt || new Date(0);
      return dateB - dateA; // descending order
    });
  },

  findBySubmitter: async (userId, options = {}) => {
    let query = col().where("submittedBy", "==", userId);
    if (options.offset) query = query.offset(options.offset);
    if (options.limit) query = query.limit(options.limit);
    const snap = await query.get();
    const docs = snap.docs.map(toRequest);
    // Sort in memory
    return docs.sort((a, b) => {
      const dateA = a.submittedAt?.toDate?.() || a.submittedAt || new Date(0);
      const dateB = b.submittedAt?.toDate?.() || b.submittedAt || new Date(0);
      return dateB - dateA; // descending order
    });
  },

  findAssigned: async (userId) => {
    const snap = await col()
      .where("assignedTo", "==", userId)
      .get();
    const docs = snap.docs.map(toRequest);
    // Sort in memory
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
      status: payload.status || "Submitted",
      submittedAt: payload.submittedAt || now,
      notes: payload.notes || [],
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
