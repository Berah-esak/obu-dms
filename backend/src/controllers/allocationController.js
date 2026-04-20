import { allocationService } from "../services/allocationService.js";
import { auditService } from "../services/auditService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const allocationController = {
  getEligibleStudents: asyncHandler(async (req, res) => {
    const data = await allocationService.getEligibleStudents(req.body || {});
    res.status(200).json({ success: true, data });
  }),

  autoAllocate: asyncHandler(async (req, res) => {
    const data = await allocationService.autoAllocate(req.body, req.user.id);
    
    if (!req.body.previewOnly) {
      auditService.log({
        user: req.user.id,
        action: "ASSIGN",
        entity: "AutoAllocation",
        entityId: "batch",
        details: `Assigned ${data.assigned.length} students`,
        ipAddress: req.ip,
      });
    }

    res.status(200).json({ success: true, data });
  }),

  manualAllocate: asyncHandler(async (req, res) => {
    const assignment = await allocationService.manualAllocate(req.body, req.user.id);
    
    auditService.log({
      user: req.user.id,
      action: "ASSIGN",
      entity: "Assignment",
      entityId: assignment._id || assignment.id,
      ipAddress: req.ip,
    });

    res.status(201).json({ success: true, data: assignment });
  }),

  vacateRoom: asyncHandler(async (req, res) => {
    const data = await allocationService.vacateRoom(req.params.assignmentId);
    
    auditService.log({
      user: req.user.id,
      action: "DELETE",
      entity: "Assignment",
      entityId: req.params.assignmentId,
      ipAddress: req.ip,
    });

    res.status(200).json({ success: true, data });
  }),
};
