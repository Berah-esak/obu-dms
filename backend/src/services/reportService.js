import { getDb } from "../config/firebase.js";
import { COLLECTIONS } from "../models/index.js";
import { assignmentRepository } from "../repositories/assignmentRepository.js";
import { studentRepository } from "../repositories/studentRepository.js";
import { roomRepository } from "../repositories/roomRepository.js";

const col = (name) => getDb().collection(name);

export const reportService = {
  getDashboardSummary: async () => {
    const [studentsSnap, roomsSnap, maintenanceSnap] = await Promise.all([
      col(COLLECTIONS.STUDENTS).count().get(),
      col(COLLECTIONS.ROOMS).get(),
      col(COLLECTIONS.MAINTENANCE_REQUESTS).where("status", "==", "Submitted").count().get(),
    ]);

    const totalStudents = studentsSnap.data().count;
    const pendingMaintenance = maintenanceSnap.data().count;

    const rooms = roomsSnap.docs.map((d) => d.data());
    const totalRooms = rooms.length;
    const occupiedTotal = rooms.reduce((sum, r) => sum + (r.currentOccupancy || 0), 0);
    const totalBedCapacity = rooms.reduce((sum, r) => sum + (r.capacity || 0), 0);
    const availableBeds = totalBedCapacity - occupiedTotal;

    return {
      totalStudents,
      totalRooms,
      occupancyRate: totalBedCapacity ? (occupiedTotal / totalBedCapacity) * 100 : 0,
      pendingMaintenance,
      availableBeds,
    };
  },

  getOccupancyReport: async (query = {}) => {
    const rooms = await roomRepository.findAll({});
    const filteredRooms = query.building
      ? rooms.filter(
          (room) =>
            room.dorm?.name === query.building || room.dorm?.code === query.building
        )
      : rooms;

    const totalRooms = filteredRooms.length;
    const occupiedRooms = filteredRooms.filter((room) => (room.currentOccupancy || 0) > 0).length;
    const data = filteredRooms.map((room) => ({
      floor: room.floor,
      occupancyRate: room.capacity ? ((room.currentOccupancy || 0) / room.capacity) * 100 : 0,
    }));

    return {
      building: query.building || "All Buildings",
      totalRooms,
      occupiedRooms,
      occupancyRate: totalRooms ? (occupiedRooms / totalRooms) * 100 : 0,
      data,
    };
  },

  getStudentDirectory: async (query) => {
    const filter = {};
    if (query.department) filter.department = query.department;
    if (query.year) filter.year = Number(query.year);

    const students = await studentRepository.findAll(filter);
    return { students };
  },

  getMaintenanceSummary: async () => {
    const snap = await col(COLLECTIONS.MAINTENANCE_REQUESTS).get();
    const requests = snap.docs.map((d) => d.data());

    // Group by category
    const categoryMap = {};
    for (const req of requests) {
      categoryMap[req.category] = (categoryMap[req.category] || 0) + 1;
    }
    const byCategory = Object.entries(categoryMap).map(([category, count]) => ({
      category,
      count,
    }));

    // Top issues by description
    const descMap = {};
    for (const req of requests) {
      descMap[req.description] = (descMap[req.description] || 0) + 1;
    }
    const topIssues = Object.entries(descMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([description, count]) => ({ description, count }));

    return {
      byCategory,
      avgResolutionTime: 0,
      topIssues,
    };
  },

  getRoomUtilization: async () => {
    const rooms = await roomRepository.findAll({});
    return {
      rooms: rooms.map((room) => ({
        roomId: room.id,
        capacity: room.capacity,
        currentOccupancy: room.currentOccupancy || 0,
        utilizationRate: room.capacity
          ? ((room.currentOccupancy || 0) / room.capacity) * 100
          : 0,
      })),
    };
  },

  getUnassignedStudents: async () => {
    // Get all active assignment student IDs
    const assignmentsSnap = await col(COLLECTIONS.ASSIGNMENTS)
      .where("status", "==", "Active")
      .get();
    const assignedStudentIds = new Set(
      assignmentsSnap.docs.map((d) => d.data().student)
    );

    const allStudents = await studentRepository.findAll({});
    const students = allStudents.filter((s) => !assignedStudentIds.has(s.id));
    return { students };
  },

  getInventoryConditionReport: async () => {
    const snap = await col(COLLECTIONS.FURNITURE_ITEMS).get();
    const items = snap.docs.map((d) => d.data());

    const conditionMap = {};
    for (const item of items) {
      conditionMap[item.condition] = (conditionMap[item.condition] || 0) + 1;
    }
    const byCondition = Object.entries(conditionMap).map(([condition, count]) => ({
      condition,
      count,
    }));

    return { byCondition };
  },

  exportReport: async (payload) => ({
    fileUrl: `/exports/${payload.reportType}-${Date.now()}.${payload.format}`,
    expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
  }),
};
