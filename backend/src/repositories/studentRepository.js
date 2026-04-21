import { getDb } from "../config/firebase.js";
import { COLLECTIONS } from "../models/index.js";

const col = () => getDb().collection(COLLECTIONS.USERS);

const toStudent = (doc) => {
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

export const studentRepository = {
  findByUserId: async (userId) => {
    const doc = await col().doc(userId).get();
    const student = toStudent(doc);
    return student && (student.role === "student" || student.role === "Student") ? student : null;
  },

  findById: async (id) => {
    const doc = await col().doc(id).get();
    const student = toStudent(doc);
    return student && (student.role === "student" || student.role === "Student") ? student : null;
  },

  findByStudentId: async (studentId) => {
    const snap = await col()
      .where("studentId", "==", String(studentId).toUpperCase())
      .where("role", "in", ["student", "Student"])
      .limit(1)
      .get();
    if (snap.empty) return null;
    return toStudent(snap.docs[0]);
  },

  findByPhone: async (phone) => {
    const snap = await col().where("phone", "==", phone).where("role", "in", ["student", "Student"]).limit(1).get();
    if (snap.empty) return null;
    return toStudent(snap.docs[0]);
  },

  findByEmail: async (email) => {
    const snap = await col()
      .where("email", "==", String(email).toLowerCase())
      .where("role", "in", ["student", "Student"])
      .limit(1)
      .get();
    if (snap.empty) return null;
    return toStudent(snap.docs[0]);
  },

  findAll: async (filter = {}, options = {}) => {
    let query = col().where("role", "in", ["student", "Student"]);
    for (const [key, value] of Object.entries(filter)) {
      query = query.where(key, "==", value);
    }
    // Don't use orderBy to avoid index requirement
    if (options.offset) query = query.offset(options.offset);
    if (options.limit) query = query.limit(options.limit);
    const snap = await query.get();
    const docs = snap.docs.map(toStudent);
    // Sort in memory
    return docs.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || a.createdAt || new Date(0);
      const dateB = b.createdAt?.toDate?.() || b.createdAt || new Date(0);
      return dateB - dateA; // descending order
    });
  },

  count: async (filter = {}) => {
    let query = col().where("role", "in", ["student", "Student"]);
    for (const [key, value] of Object.entries(filter)) {
      query = query.where(key, "==", value);
    }
    const snap = await query.count().get();
    return snap.data().count;
  },

  create: async (payload) => {
    const now = new Date();
    const data = { ...payload, role: "student", createdAt: now, updatedAt: now };
    const ref = await col().add(data);
    return { id: ref.id, ...data };
  },

  updateById: async (id, payload) => {
    const ref = col().doc(id);
    await ref.update({ ...payload, updatedAt: new Date() });
    const updated = await ref.get();
    return toStudent(updated);
  },
};
