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
    const occupiedTotal = occupiedBeds[0]?.total || 0;
    const totalBedCapacity = totalBeds[0]?.total || 0;
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
    const rooms = await Room.find({}).populate("dormId", "name code");
    const filteredRooms = query.building
      ? rooms.filter(
          (room) => room.dormId?.name === query.building || room.dormId?.code === query.building
        )
      : rooms;

    const totalRooms = filteredRooms.length;
    const occupiedRooms = filteredRooms.filter((room) => room.currentOccupancy > 0).length;
    const data = filteredRooms.map((room) => ({
      floor: room.floor,
      occupancyRate: room.capacity ? (room.currentOccupancy / room.capacity) * 100 : 0,
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
