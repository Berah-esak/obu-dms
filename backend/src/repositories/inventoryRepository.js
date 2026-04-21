import { getDb } from "../config/firebase.js";
import { COLLECTIONS } from "../models/index.js";

const furnitureCol = () => getDb().collection(COLLECTIONS.FURNITURE_ITEMS);
const linenCol = () => getDb().collection(COLLECTIONS.LINEN_RECORDS);
const keyCol = () => getDb().collection(COLLECTIONS.KEY_RECORDS);

const toDoc = (doc) => {
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

export const inventoryRepository = {
  // ── Furniture ────────────────────────────────────────────────────────────────
  getFurnitureByRoom: async (roomId) => {
    const snap = await furnitureCol().where("roomId", "==", roomId).get();
    return snap.docs.map(toDoc);
  },

  addFurniture: async (payload) => {
    const now = new Date();
    const data = { ...payload, createdAt: now, updatedAt: now };
    const ref = await furnitureCol().add(data);
    return { id: ref.id, ...data };
  },

  updateFurniture: async (id, payload) => {
    const ref = furnitureCol().doc(id);
    await ref.update({ ...payload, updatedAt: new Date() });
    const updated = await ref.get();
    return toDoc(updated);
  },

  // ── Linen ────────────────────────────────────────────────────────────────────
  issueLinen: async (payload) => {
    const now = new Date();
    const data = { ...payload, dateIssued: payload.dateIssued || now, createdAt: now, updatedAt: now };
    const ref = await linenCol().add(data);
    return { id: ref.id, ...data };
  },

  returnLinen: async (id, payload) => {
    const ref = linenCol().doc(id);
    await ref.update({ ...payload, updatedAt: new Date() });
    const updated = await ref.get();
    return toDoc(updated);
  },

  // ── Keys ─────────────────────────────────────────────────────────────────────
  issueKey: async (payload) => {
    const now = new Date();
    const data = {
      ...payload,
      status: payload.status || "Issued",
      dateIssued: payload.dateIssued || now,
      createdAt: now,
      updatedAt: now,
    };
    const ref = await keyCol().add(data);
    return { id: ref.id, ...data };
  },

  returnKey: async (id, payload) => {
    const ref = keyCol().doc(id);
    await ref.update({ ...payload, updatedAt: new Date() });
    const updated = await ref.get();
    return toDoc(updated);
  },

  getMissingKeys: async () => {
    const snap = await keyCol()
      .where("status", "==", "Missing")
      .orderBy("updatedAt", "desc")
      .get();
    return snap.docs.map(toDoc);
  },
};
