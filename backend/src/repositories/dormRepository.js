import { getDb } from "../config/firebase.js";
import { COLLECTIONS } from "../models/index.js";

const col = () => getDb().collection(COLLECTIONS.DORMS);

const toDorm = (doc) => {
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

export const dormRepository = {
  findAll: async () => {
    const snap = await col().orderBy("name", "asc").get();
    return snap.docs.map(toDorm);
  },

  findById: async (id) => {
    const doc = await col().doc(id).get();
    return toDorm(doc);
  },

  findByCode: async (code) => {
    const snap = await col()
      .where("code", "==", String(code).toUpperCase())
      .limit(1)
      .get();
    if (snap.empty) return null;
    return toDorm(snap.docs[0]);
  },

  create: async (payload) => {
    const now = new Date();
    const data = { ...payload, createdAt: now, updatedAt: now };
    const ref = await col().add(data);
    return { id: ref.id, ...data };
  },

  updateById: async (id, payload) => {
    const ref = col().doc(id);
    await ref.update({ ...payload, updatedAt: new Date() });
    const updated = await ref.get();
    return toDorm(updated);
  },
};
