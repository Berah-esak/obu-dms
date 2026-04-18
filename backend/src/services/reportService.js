import { Assignment } from "../models/Assignment.js";
import { FurnitureItem } from "../models/FurnitureItem.js";
import { MaintenanceRequest } from "../models/MaintenanceRequest.js";
import { Room } from "../models/Room.js";
import { Student } from "../models/Student.js";

export const reportService = {
  getDashboardSummary: async () => {
    const totalStudents = await Student.countDocuments();
    const totalRooms = await Room.countDocuments();
    const occupiedBeds = await Room.aggregate([
      { $group: { _id: null, total: { $sum: "$currentOccupancy" } } },
    ]);
    const totalBeds = await Room.aggregate([{ $group: { _id: null, total: { $sum: "$capacity" } } }]);
    const pendingMaintenance = await MaintenanceRequest.countDocuments({ status: "Submitted" });
    const availableBeds = (totalBeds[0]?.total || 0) - (occupiedBeds[0]?.total || 0);

    return {
      totalStudents,
      totalRooms,
      occupancyRate: totalBeds[0]?.total ? (occupiedBeds[0].total / totalBeds[0].total) * 100 : 0,
      pendingMaintenance,
      availableBeds,
    };
  },

  getOccupancyReport: async () => {
    const rooms = await Room.find({}).populate("dormId", "name");
    const map = new Map();

    for (const room of rooms) {
      const key = room.dormId?.name || "Unknown";
      if (!map.has(key)) {
        map.set(key, { building: key, totalRooms: 0, occupiedRooms: 0, data: [] });
      }

      const item = map.get(key);
      item.totalRooms += 1;
      if (room.currentOccupancy > 0) {
        item.occupiedRooms += 1;
      }
      item.data.push({
        floor: room.floor,
        occupancyRate: room.capacity ? (room.currentOccupancy / room.capacity) * 100 : 0,
      });
    }

    return Array.from(map.values()).map((item) => ({
      ...item,
      occupancyRate: item.totalRooms ? (item.occupiedRooms / item.totalRooms) * 100 : 0,
    }));
  },

  getStudentDirectory: async (query) => {
    const filter = {};
    if (query.department) filter.department = query.department;
    if (query.year) filter.year = Number(query.year);

    const students = await Student.find(filter);
    return { students };
  },

  getMaintenanceSummary: async () => {
    const byCategory = await MaintenanceRequest.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $project: { _id: 0, category: "$_id", count: 1 } },
    ]);

    const topIssues = await MaintenanceRequest.aggregate([
      { $group: { _id: "$description", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { _id: 0, description: "$_id", count: 1 } },
    ]);

    return {
      byCategory,
      avgResolutionTime: 0,
      topIssues,
    };
  },

  getRoomUtilization: async () => {
    const rooms = await Room.find({});
    return {
      rooms: rooms.map((room) => ({
        roomId: room.id,
        capacity: room.capacity,
        currentOccupancy: room.currentOccupancy,
        utilizationRate: room.capacity ? (room.currentOccupancy / room.capacity) * 100 : 0,
      })),
    };
  },

  getUnassignedStudents: async () => {
    const assigned = await Assignment.find({ status: "Active" }).distinct("student");
    const students = await Student.find({ _id: { $nin: assigned } });
    return { students };
  },

  getInventoryConditionReport: async () => {
    const byCondition = await FurnitureItem.aggregate([
      { $group: { _id: "$condition", count: { $sum: 1 } } },
      { $project: { _id: 0, condition: "$_id", count: 1 } },
    ]);

    return { byCondition };
  },

  exportReport: async (payload) => ({
    fileUrl: `/exports/${payload.reportType}-${Date.now()}.${payload.format}`,
    expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
  }),
};
