import { maintenanceRepository } from "../repositories/maintenanceRepository.js";
import { ApiError } from "../utils/ApiError.js";

const buildFilter = (query) => {
  const filter = {};
  if (query.status) filter.status = query.status;
  if (query.priority) filter.priority = query.priority;
  return filter;
};

export const maintenanceService = {
  getRequests: async (query) => {
    const requests = await maintenanceRepository.findAll(buildFilter(query));
    return { requests };
  },

  getPending: async () => {
    const requests = await maintenanceRepository.findAll({ status: "Submitted" });
    return { requests };
  },

  submit: async (userId, payload, attachment = null) => {
    const sequence = Date.now();
    
    // For now, store attachment metadata (in production, upload to cloud storage)
    const attachmentData = attachment ? [{
      filename: attachment.filename,
      mimetype: attachment.mimetype,
      size: attachment.size,
      // In production, upload file.buffer to cloud storage and store URL
      // url: await uploadToCloudStorage(attachment.buffer, attachment.filename)
    }] : undefined;
    
    return maintenanceRepository.create({
      requestId: `MR-${new Date().getFullYear()}-${String(sequence).slice(-6)}`,
      roomId: payload.roomId,
      dormBlockId: payload.dormBlockId,
      category: payload.category,
      description: payload.description,
      priority: payload.priority,
      submittedBy: userId,
      trackingNumber: `TRK-${sequence}`,
      attachments: attachmentData,
    });
  },

  getAssigned: async (userId) => {
    const tasks = await maintenanceRepository.findAssigned(userId);
    return { tasks };
  },

  approve: async (requestId, payload, userId) => {
    const request = await maintenanceRepository.findById(requestId);
    if (!request) {
      throw new ApiError(404, "Maintenance request not found");
    }

    const updated = await maintenanceRepository.updateById(requestId, {
      status: "In Progress",
      approvedBy: userId,
      approvedAt: new Date(),
      adminNotes: payload.notes || payload.adminNotes,
    });

    return { message: "Maintenance request approved", request: updated };
  },

  reject: async (requestId, payload, userId) => {
    const request = await maintenanceRepository.findById(requestId);
    if (!request) {
      throw new ApiError(404, "Maintenance request not found");
    }

    const updated = await maintenanceRepository.updateById(requestId, {
      status: "Rejected",
      rejectedBy: userId,
      rejectedAt: new Date(),
      rejectionReason: payload.reason || payload.rejectionReason,
    });

    return { message: "Maintenance request rejected", request: updated };
  },

  updateStatus: async (requestId, payload) => {
    const request = await maintenanceRepository.findById(requestId);
    if (!request) {
      throw new ApiError(404, "Maintenance request not found");
    }

    const updated = await maintenanceRepository.updateById(requestId, {
      status: payload.status,
      resolutionNotes: payload.resolutionNotes,
    });

    return { message: "Status updated", request: updated };
  },

  addNote: async (requestId, payload, userId) => {
    const request = await maintenanceRepository.findById(requestId);
    if (!request) {
      throw new ApiError(404, "Maintenance request not found");
    }

    const newNote = {
      note: payload.note,
      isInternal: Boolean(payload.isInternal),
      addedBy: userId,
      addedAt: new Date(),
    };

    const updatedNotes = [...(request.notes || []), newNote];
    await maintenanceRepository.updateById(requestId, { notes: updatedNotes });

    return { note: newNote };
  },

  reassign: async (requestId, payload) => {
    const request = await maintenanceRepository.findById(requestId);
    if (!request) {
      throw new ApiError(404, "Maintenance request not found");
    }

    await maintenanceRepository.updateById(requestId, { assignedTo: payload.staffId });
    return { message: "Reassigned successfully" };
  },
};
