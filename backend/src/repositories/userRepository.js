import bcrypt from "bcryptjs";
import { getDb } from "../config/firebase.js";
import { COLLECTIONS } from "../models/index.js";

const col = () => getDb().collection(COLLECTIONS.USERS);

// Serialize a Firestore doc snapshot to a plain object
const toUser = (doc, includePassword = false) => {
  if (!doc.exists) return null;
  const data = doc.data();
  if (!includePassword) delete data.password;
  return { id: doc.id, ...data };
};

export const userRepository = {
  findByUsername: async (username, options = {}) => {
    const snap = await col()
      .where("username", "==", String(username).toLowerCase())
      .limit(1)
      .get();
    if (snap.empty) return null;
    return toUser(snap.docs[0], options.includePassword);
  },

  findByEmail: async (email, options = {}) => {
    const snap = await col()
      .where("email", "==", String(email).toLowerCase())
      .limit(1)
      .get();
    if (snap.empty) return null;
    return toUser(snap.docs[0], options.includePassword);
  },

  findAll: async (filter = {}, options = {}) => {
    let query = col();
    for (const [key, value] of Object.entries(filter)) {
      query = query.where(key, "==", value);
    }
    query = query.orderBy("createdAt", "desc");
    if (options.offset) query = query.offset(options.offset);
    if (options.limit) query = query.limit(options.limit);
    const snap = await query.get();
    return snap.docs.map((d) => toUser(d));
  },

  count: async (filter = {}) => {
    let query = col();
    for (const [key, value] of Object.entries(filter)) {
      query = query.where(key, "==", value);
    }
    const snap = await query.count().get();
    return snap.data().count;
  },

  findById: async (id) => {
    const doc = await col().doc(id).get();
    return toUser(doc);
  },

  updateById: async (id, payload) => {
    // Convert snake_case API roles to Title Case DB roles if role is being updated
    if (payload.role) {
      const apiToDbRole = {
        "student": "Student",
        "dorm_admin": "Dorm Admin", 
        "maintenance": "Maintenance Staff",
        "management": "Management",
        "system_admin": "System Admin"
      };
      payload.role = apiToDbRole[payload.role] || payload.role;
    }
    
    const ref = col().doc(id);
    await ref.update({ ...payload, updatedAt: new Date() });
    const updated = await ref.get();
    return toUser(updated);
  },

  updatePassword: async (id, newPassword) => {
    const hashed = await bcrypt.hash(newPassword, 12);
    const ref = col().doc(id);
    await ref.update({ password: hashed, updatedAt: new Date() });
    const updated = await ref.get();
    return toUser(updated);
  },

  create: async (payload) => {
    const hashed = await bcrypt.hash(payload.password, 12);
    const now = new Date();
    
    // Convert snake_case API roles to Title Case DB roles
    const apiToDbRole = {
      "student": "Student",
      "dorm_admin": "Dorm Admin", 
      "maintenance": "Maintenance Staff",
      "management": "Management",
      "system_admin": "System Admin"
    };
    
    const dbRole = apiToDbRole[payload.role] || payload.role || "Student";
    
    const data = {
      ...payload,
      username: payload.username ? String(payload.username).toLowerCase() : undefined,
      email: payload.email ? String(payload.email).toLowerCase() : undefined,
      password: hashed,
      role: dbRole,
      status: payload.status || "Active",
      createdAt: now,
      updatedAt: now,
    };
    const ref = await col().add(data);
    return { id: ref.id, ...data, password: undefined };
  },

  // Used by authService to update lastLogin
  saveLastLogin: async (id) => {
    await col().doc(id).update({ lastLogin: new Date(), updatedAt: new Date() });
  },

  // Compare a plain password against the stored hash
  comparePassword: async (id, plainPassword) => {
    const doc = await col().doc(id).get();
    if (!doc.exists) return false;
    const { password } = doc.data();
    return bcrypt.compare(plainPassword, password);
  },
};
