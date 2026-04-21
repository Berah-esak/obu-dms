import { getDb } from "../config/firebase.js";
import { COLLECTIONS } from "../models/index.js";

const refreshCol = () => getDb().collection(COLLECTIONS.REFRESH_TOKENS);
const resetCol = () => getDb().collection(COLLECTIONS.PASSWORD_RESET_TOKENS);

const toDoc = (doc) => {
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

export const tokenRepository = {
  // ── Refresh tokens ──────────────────────────────────────────────────────────
  createRefreshToken: async (payload) => {
    const now = new Date();
    const data = { ...payload, createdAt: now, updatedAt: now };
    const ref = await refreshCol().add(data);
    return { id: ref.id, ...data };
  },

  findRefreshToken: async (token) => {
    const snap = await refreshCol().where("token", "==", token).limit(1).get();
    if (snap.empty) return null;
    return toDoc(snap.docs[0]);
  },

  revokeRefreshToken: async (token) => {
    const snap = await refreshCol().where("token", "==", token).limit(1).get();
    if (snap.empty) return null;
    const ref = snap.docs[0].ref;
    await ref.update({ revokedAt: new Date(), updatedAt: new Date() });
    const updated = await ref.get();
    return toDoc(updated);
  },

  // ── Password reset tokens ────────────────────────────────────────────────────
  createPasswordResetToken: async (payload) => {
    const now = new Date();
    const data = { ...payload, usedAt: null, createdAt: now, updatedAt: now };
    const ref = await resetCol().add(data);
    return { id: ref.id, ...data };
  },

  findValidPasswordResetToken: async (token) => {
    const snap = await resetCol()
      .where("token", "==", token)
      .where("usedAt", "==", null)
      .limit(1)
      .get();
    if (snap.empty) return null;
    return toDoc(snap.docs[0]);
  },

  markPasswordTokenUsed: async (id) => {
    const ref = resetCol().doc(id);
    await ref.update({ usedAt: new Date(), updatedAt: new Date() });
    const updated = await ref.get();
    return toDoc(updated);
  },
};
