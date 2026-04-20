import { auditService } from "../services/auditService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const auditController = {
  getAuditLogs: asyncHandler(async (req, res) => {
    const data = await auditService.getAuditLogs(req.query);
    res.status(200).json({ success: true, data });
  }),

  exportAuditLogs: asyncHandler(async (req, res) => {
    const data = await auditService.exportAuditLogs(req.query);
    res.status(200).json({ success: true, data });
  }),
};
