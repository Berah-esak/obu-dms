import { reportService } from "../services/reportService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const reportController = {
  getDashboardSummary: asyncHandler(async (req, res) => {
    const data = await reportService.getDashboardSummary();
    res.status(200).json({ success: true, data });
  }),

  getOccupancyReport: asyncHandler(async (req, res) => {
    const data = await reportService.getOccupancyReport(req.query);
    res.status(200).json({ success: true, data });
  }),

  getStudentDirectory: asyncHandler(async (req, res) => {
    const data = await reportService.getStudentDirectory(req.query);
    res.status(200).json({ success: true, data });
  }),

  getMaintenanceSummary: asyncHandler(async (req, res) => {
    const data = await reportService.getMaintenanceSummary(req.query);
    res.status(200).json({ success: true, data });
  }),

  getRoomUtilization: asyncHandler(async (req, res) => {
    const data = await reportService.getRoomUtilization();
    res.status(200).json({ success: true, data });
  }),

  getUnassignedStudentsReport: asyncHandler(async (req, res) => {
    const data = await reportService.getUnassignedStudents();
    res.status(200).json({ success: true, data });
  }),

  getInventoryConditionReport: asyncHandler(async (req, res) => {
    const data = await reportService.getInventoryConditionReport();
    res.status(200).json({ success: true, data });
  }),

  exportReport: asyncHandler(async (req, res) => {
    const data = await reportService.exportReport(req.body);
    res.status(200).json({ success: true, data });
  }),
};
