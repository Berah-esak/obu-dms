import { getDb } from "../config/firebase.js";
import { COLLECTIONS } from "../models/index.js";
import { dormRepository } from "./dormRepository.js";
import { FieldValue } from "firebase-admin/firestore";

const col = () => getDb().collection(COLLECTIONS.ROOMS);

const toRoom = (doc) => {
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

// Attach dorm name/code to a room object
const populateDorm = async (room) => {
  if (!room || !room.dormId) return room;
  const dorm = await dormRepository.findById(room.dormId);
  return { ...room, dorm: dorm ? { id: dorm.id, name: dorm.name, code: dorm.code } : null };
};

export const roomRepository = {
  findAll: async (filter = {}) => {
    let query = col();
    for (const [key, value] of Object.entries(filter)) {
      query = query.where(key, "==", value);
    }
    const snap = await query.get();
    const rooms = snap.docs.map(toRoom);
    return Promise.all(rooms.map(populateDorm));
  },

  findById: async (id) => {
    const doc = await col().doc(id).get();
    const room = toRoom(doc);
    return populateDorm(room);
  },

  findAvailable: async (filter = {}) => {
    let query = col().where("status", "==", "Available");
    for (const [key, value] of Object.entries(filter)) {
      query = query.where(key, "==", value);
    }
    const snap = await query.get();
    const rooms = snap.docs.map(toRoom);
    return Promise.all(rooms.map(populateDorm));
  },

  create: async (payload) => {
    const now = new Date();
    const data = {
      ...payload,
      currentOccupancy: payload.currentOccupancy ?? 0,
      status: payload.status || "Available",
      createdAt: now,
      updatedAt: now,
    };
    const ref = await col().add(data);
    const room = { id: ref.id, ...data };
    return populateDorm(room);
  },

  updateById: async (id, payload) => {
    const ref = col().doc(id);
    await ref.update({ ...payload, updatedAt: new Date() });
    const updated = await ref.get();
    return populateDorm(toRoom(updated));
  },

  incrementOccupancy: async (id, delta) => {
    const ref = col().doc(id);
    await ref.update({
      currentOccupancy: FieldValue.increment(delta),
      updatedAt: new Date(),
    });
    const updated = await ref.get();
    return populateDorm(toRoom(updated));
  },
};
