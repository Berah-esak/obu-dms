import * as exitClearanceService from "../services/exitClearanceService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { SUCCESS_MESSAGES } from "../config/constants.js";

/**
 * Submit exit request (Student only)
 * POST /api/exit-requests
 */
export const submitExitRequest = asyncHandler(async (req, res) => {
  const studentId = req.user.id;
  const payload = req.body;

  const exitRequest = await exitClearanceService.submitRequest(studentId, payload);

  res.status(201).json({
    success: true,
    message: SUCCESS_MESSAGES.EXIT_REQUEST_SUBMITTED,
    data: { exitRequest },
  });
});

/**
 * Get my exit requests (Student only)
 * GET /api/exit-requests/my-requests
 */
export const getMyExitRequests = asyncHandler(async (req, res) => {
  const studentId = req.user.id;
  const query = {
    limit: parseInt(req.query.limit) || 25,
    status: req.query.status,
  };

  const result = await exitClearanceService.getStudentRequests(studentId, query);

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * Get pending exit requests (Proctor Head only)
 * GET /api/exit-requests/pending
 */
export const getPendingExitRequests = asyncHandler(async (req, res) => {
  const query = {
    limit: parseInt(req.query.limit) || 25,
  };

  const result = await exitClearanceService.getPendingRequests(query);

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * Approve exit request (Proctor Head only)
 * POST /api/exit-requests/:id/approve
 */
export const approveExitRequest = asyncHandler(async (req, res) => {
  const requestId = req.params.id;
  const proctorHeadId = req.user.id;
  const metadata = req.body;

  const exitRequest = await exitClearanceService.approveRequest(requestId, proctorHeadId, metadata);

  res.status(200).json({
    success: true,
    message: SUCCESS_MESSAGES.EXIT_REQUEST_APPROVED,
    data: { exitRequest },
  });
});

/**
 * Reject exit request (Proctor Head only)
 * POST /api/exit-requests/:id/reject
 */
export const rejectExitRequest = asyncHandler(async (req, res) => {
  const requestId = req.params.id;
  const proctorHeadId = req.user.id;
  const { reason } = req.body;

  const exitRequest = await exitClearanceService.rejectRequest(requestId, proctorHeadId, reason);

  res.status(200).json({
    success: true,
    message: SUCCESS_MESSAGES.EXIT_REQUEST_REJECTED,
    data: { exitRequest },
  });
});

/**
 * Verify exit code (Gate Guard only)
 * POST /api/exit-requests/verify
 */
export const verifyExitCode = asyncHandler(async (req, res) => {
  const { code } = req.body;
  const gateGuardId = req.user.id;

  const result = await exitClearanceService.verifyCode(code, gateGuardId);

  res.status(200).json({
    success: true,
    message: SUCCESS_MESSAGES.VERIFICATION_SUCCESS,
    data: result,
  });
});

/**
 * Get exit request history (Proctor Head only)
 * GET /api/exit-requests/history
 */
export const getExitRequestHistory = asyncHandler(async (req, res) => {
  const filter = {
    status: req.query.status,
    dormBlockId: req.query.dormBlockId,
    startDate: req.query.startDate ? new Date(req.query.startDate) : undefined,
    endDate: req.query.endDate ? new Date(req.query.endDate) : undefined,
  };

  const options = {
    limit: parseInt(req.query.limit) || 25,
    offset: parseInt(req.query.offset) || 0,
  };

  const result = await exitClearanceService.getRequestHistory(filter, options);

  res.status(200).json({
    success: true,
    data: result,
  });
});

export default {
  submitExitRequest,
  getMyExitRequests,
  getPendingExitRequests,
  approveExitRequest,
  rejectExitRequest,
  verifyExitCode,
  getExitRequestHistory,
};
