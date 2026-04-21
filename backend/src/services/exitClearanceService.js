import * as exitRequestRepository from "../repositories/exitRequestRepository.js";
import { studentRepository } from "../repositories/studentRepository.js";
import { notificationRepository } from "../repositories/notificationRepository.js";
import { EXIT_REQUEST_STATUSES, VERIFICATION_CODE_STATUSES, ERROR_MESSAGES, NOTIFICATION_TYPES } from "../config/constants.js";
import { ApiError } from "../utils/ApiError.js";
import crypto from "crypto";

/**
 * Generate a unique verification code
 */
const generateVerificationCode = () => {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
};

/**
 * Submit a new exit request
 */
export const submitRequest = async (userId, payload) => {
  // Get user details
  const { userRepository } = await import("../repositories/userRepository.js");
  const user = await userRepository.findById(userId);
  
  if (!user || user.role !== "Student") {
    throw new ApiError(404, "Student not found");
  }

  // Try to get student record by user ID
  let student = await studentRepository.findByUserId(userId);
  
  // If no student record, check if user has direct room assignment
  let roomId = user.roomId;
  let dormBlockId = user.dormBlockId;
  let studentName = user.fullName;
  
  // If student record exists, check for room assignment in assignments table
  if (student) {
    const { assignmentRepository } = await import("../repositories/assignmentRepository.js");
    const assignment = await assignmentRepository.findActiveByStudent(student.id);
    
    if (assignment) {
      roomId = assignment.room;
      dormBlockId = assignment.dorm;
    }
    studentName = student.fullName;
  }

  console.log('[EXIT REQUEST] User data:', JSON.stringify({
    userId: user.id,
    username: user.username,
    role: user.role,
    hasStudentRecord: !!student,
    roomId: roomId,
    dormBlockId: dormBlockId
  }, null, 2));

  if (!roomId) {
    throw new ApiError(400, "You must be assigned to a room before submitting an exit request. Please contact the dorm administrator for room assignment.");
  }

  const exitRequest = await exitRequestRepository.create({
    studentId: user.id,
    studentName: studentName,
    dormBlockId: dormBlockId || "N/A",
    roomId: roomId,
    items: payload.items || [],
    reason: payload.reason || "",
    status: EXIT_REQUEST_STATUSES.PENDING,
  });

  // Notify Proctor Head (Dorm Admin) - using repository directly
  await notificationRepository.create({
    recipient: "proctor-head", // This should be dynamic based on dorm block
    type: NOTIFICATION_TYPES.EXIT_REQUEST,
    title: "New Exit Request",
    message: `${student.fullName} has submitted an exit request`,
    relatedId: exitRequest.id,
  });

  return exitRequest;
};

/**
 * Get student's exit requests
 */
export const getStudentRequests = async (studentId, query = {}) => {
  const options = {
    limit: query.limit || 25,
    status: query.status,
  };

  const requests = await exitRequestRepository.findByStudent(studentId, options);
  const total = await exitRequestRepository.count({ studentId });

  return { requests, total };
};

/**
 * Get pending exit requests (for Proctor Head)
 */
export const getPendingRequests = async (query = {}) => {
  const options = {
    limit: query.limit || 25,
  };

  const requests = await exitRequestRepository.findPending(options);
  const total = await exitRequestRepository.count({ status: EXIT_REQUEST_STATUSES.PENDING });

  return { requests, total };
};

/**
 * Approve exit request (Proctor Head only)
 */
export const approveRequest = async (requestId, proctorHeadId, metadata = {}) => {
  const request = await exitRequestRepository.findById(requestId);
  if (!request) {
    throw new ApiError(404, ERROR_MESSAGES.EXIT_REQUEST_NOT_FOUND);
  }

  if (request.status !== EXIT_REQUEST_STATUSES.PENDING) {
    throw new ApiError(400, "Only pending requests can be approved");
  }

  // Generate unique verification code
  let verificationCode;
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 10;

  while (!isUnique && attempts < maxAttempts) {
    verificationCode = generateVerificationCode();
    const existing = await exitRequestRepository.findByVerificationCode(verificationCode);
    if (!existing || existing.verificationCodeStatus === VERIFICATION_CODE_STATUSES.USED) {
      isUnique = true;
    }
    attempts++;
  }

  if (!isUnique) {
    throw new ApiError(500, "Failed to generate unique verification code");
  }

  const updatedRequest = await exitRequestRepository.updateStatus(
    requestId,
    EXIT_REQUEST_STATUSES.APPROVED,
    {
      verificationCode,
      verificationCodeStatus: VERIFICATION_CODE_STATUSES.ACTIVE,
      approvedBy: proctorHeadId,
      approvedAt: new Date(),
      ...metadata,
    }
  );

  // Notify student
  await notificationRepository.create({
    recipient: request.studentId,
    type: NOTIFICATION_TYPES.EXIT_REQUEST,
    title: "Exit Request Approved",
    message: `Your exit request has been approved. Verification code: ${verificationCode}`,
    relatedId: requestId,
  });

  return updatedRequest;
};

/**
 * Reject exit request (Proctor Head only)
 */
export const rejectRequest = async (requestId, proctorHeadId, reason) => {
  const request = await exitRequestRepository.findById(requestId);
  if (!request) {
    throw new ApiError(404, ERROR_MESSAGES.EXIT_REQUEST_NOT_FOUND);
  }

  if (request.status !== EXIT_REQUEST_STATUSES.PENDING) {
    throw new ApiError(400, "Only pending requests can be rejected");
  }

  const updatedRequest = await exitRequestRepository.updateStatus(
    requestId,
    EXIT_REQUEST_STATUSES.REJECTED,
    {
      rejectedBy: proctorHeadId,
      rejectedAt: new Date(),
      rejectionReason: reason || "No reason provided",
    }
  );

  // Notify student
  await notificationRepository.create({
    recipient: request.studentId,
    type: NOTIFICATION_TYPES.EXIT_REQUEST,
    title: "Exit Request Rejected",
    message: `Your exit request has been rejected. Reason: ${reason || "No reason provided"}`,
    relatedId: requestId,
  });

  return updatedRequest;
};

/**
 * Verify exit code (Gate Guard)
 */
export const verifyCode = async (code, gateGuardId) => {
  const request = await exitRequestRepository.findByVerificationCode(code);
  
  if (!request) {
    throw new ApiError(404, ERROR_MESSAGES.VERIFICATION_CODE_INVALID);
  }

  if (request.verificationCodeStatus === VERIFICATION_CODE_STATUSES.USED) {
    throw new ApiError(409, ERROR_MESSAGES.VERIFICATION_CODE_USED);
  }

  if (request.status !== EXIT_REQUEST_STATUSES.APPROVED) {
    throw new ApiError(400, "Exit request is not in approved status");
  }

  const updatedRequest = await exitRequestRepository.markCodeAsUsed(
    request.id,
    new Date(),
    gateGuardId
  );

  return {
    valid: true,
    request: updatedRequest,
  };
};

/**
 * Get exit request history with filters
 */
export const getRequestHistory = async (filter = {}, options = {}) => {
  const requests = await exitRequestRepository.findAll(filter, options);
  const total = await exitRequestRepository.count(filter);

  return { requests, total };
};

export default {
  submitRequest,
  getStudentRequests,
  getPendingRequests,
  approveRequest,
  rejectRequest,
  verifyCode,
  getRequestHistory,
  generateVerificationCode,
};
