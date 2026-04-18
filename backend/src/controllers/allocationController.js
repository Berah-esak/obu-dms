import { allocationService } from "../services/allocationService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const allocationController = {
  getEligibleStudents: asyncHandler(async (req, res) => {
    const data = await allocationService.getEligibleStudents(req.body || {});
    res.status(200).json(data);
  }),

  autoAllocate: asyncHandler(async (req, res) => {
    const data = await allocationService.autoAllocate(req.body, req.user.id);
    res.status(200).json(data);
  }),

  manualAllocate: asyncHandler(async (req, res) => {
    const assignment = await allocationService.manualAllocate(req.body, req.user.id);
    res.status(201).json(assignment);
  }),

  vacateRoom: asyncHandler(async (req, res) => {
    const data = await allocationService.vacateRoom(req.params.assignmentId);
    res.status(200).json({ success: true, ...data });
  }),
};

    res.status(200).json(data);
  }),

  getUnassignedStudentsReport: asyncHandler(async (req, res) => {
    const data = await reportService.getUnassignedStudents();
    res.status(200).json(data);
  }),

  getInventoryConditionReport: asyncHandler(async (req, res) => {
    const data = await reportService.getInventoryConditionReport();
    res.status(200).json(data);
  }),

  exportReport: asyncHandler(async (req, res) => {
    const data = await reportService.exportReport(req.body);
    res.status(200).json(data);
  }),
};
