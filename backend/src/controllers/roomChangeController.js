import { roomChangeService } from "../services/roomChangeService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const roomChangeController = {
  getMyRoomChangeRequests: asyncHandler(async (req, res) => {
    const data = await roomChangeService.getMyRequests(req.user.id);
    res.status(200).json(data);
  }),

  submitRoomChangeRequest: asyncHandler(async (req, res) => {
    const result = await roomChangeService.submit(req.user.id, req.body);
    res.status(201).json(result);
  }),

  getPendingRoomChangeRequests: asyncHandler(async (req, res) => {
    const data = await roomChangeService.getPending();
    res.status(200).json(data);
  }),

  approveRoomChange: asyncHandler(async (req, res) => {
    const assignment = await roomChangeService.approve(req.params.requestId, req.body, req.user.id);
    res.status(200).json(assignment);
  }),

  rejectRoomChange: asyncHandler(async (req, res) => {
    const result = await roomChangeService.reject(req.params.requestId, req.body, req.user.id);
    res.status(200).json({ success: true, ...result });
  }),
};
