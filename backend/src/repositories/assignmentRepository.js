import { getDb } from "../config/firebase.js";
import { COLLECTIONS } from "../models/index.js";

const col = () => getDb().collection(COLLECTIONS.ASSIGNMENTS);

const toAssignment = (doc) => {
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

export const assignmentRepository = {
  findActiveByStudent: async (studentUserId) => {
    // Get all assignments and filter in memory to avoid index requirements
    const snap = await col().get();
    const results = snap.docs.map(toAssignment);
    
    const activeAssignment = results.find(assignment => 
      assignment.student === studentUserId && assignment.status === "Active"
    );
    
    return activeAssignment || null;
  },

  findById: async (id) => {
    const doc = await col().doc(id).get();
    return toAssignment(doc);
  },

  findAll: async (filter = {}) => {
    // Get all assignments and filter in memory to avoid index requirements
    const snap = await col().get();
    let results = snap.docs.map(toAssignment);
    
    // Apply filters in memory
    for (const [key, value] of Object.entries(filter)) {
      results = results.filter(assignment => assignment[key] === value);
    }
    
    return results;
  },

  create: async (payload) => {
    const now = new Date();
    const data = {
      ...payload,
      status: payload.status || "Active",
      startDate: payload.startDate || now,
      createdAt: now,
      updatedAt: now,
    };
    const ref = await col().add(data);
    return { id: ref.id, ...data };
  },

  vacateById: async (id) => {
    const ref = col().doc(id);
    await ref.update({ status: "Vacated", endDate: new Date(), updatedAt: new Date() });
    const updated = await ref.get();
    return toAssignment(updated);
  },
};
