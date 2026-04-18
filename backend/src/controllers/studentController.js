import { studentService } from "../services/studentService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const studentController = {
  getMyAssignment: asyncHandler(async (req, res) => {
    const data = await studentService.getAssignment(req.user.id);
    res.status(200).json(data);
  }),

  getMyMaintenanceRequests: asyncHandler(async (req, res) => {
    const data = await studentService.getMaintenanceHistory(req.user.id, req.query);
    res.status(200).json(data);
  }),

  getStudentProfile: asyncHandler(async (req, res) => {
    const data = await studentService.getProfile(req.user.id);
    res.status(200).json(data);
  }),
};

    res.status(200).json({ success: true, ...data });
  }),

  addMaintenanceNote: asyncHandler(async (req, res) => {
    const data = await maintenanceService.addNote(req.params.requestId, req.body, req.user.id);
    res.status(200).json(data);
  }),

  reassignMaintenanceRequest: asyncHandler(async (req, res) => {
    const data = await maintenanceService.reassign(req.params.requestId, req.body);
    res.status(200).json({ success: true, ...data });
  }),
};
