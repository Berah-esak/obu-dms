import { getDb } from "../config/firebase.js";
import { COLLECTIONS, EXIT_REQUEST_STATUSES } from "../config/constants.js";

const getExitRequestsCollection = () => getDb().collection(COLLECTIONS.EXIT_REQUESTS);

/**
 * Transform Firestore document to ExitRequest object
 */
const toExitRequest = (doc) => {
  if (!doc.exists) return null;
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate?.() || data.createdAt,
    submittedAt: data.submittedAt?.toDate?.() || data.submittedAt || data.createdAt?.toDate?.() || data.createdAt,
    approvedAt: data.approvedAt?.toDate?.() || data.approvedAt,
    rejectedAt: data.rejectedAt?.toDate?.() || data.rejectedAt,
    verifiedAt: data.verifiedAt?.toDate?.() || data.verifiedAt,
    updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
  };
};

/**
 * Create a new exit request
 */
export const create = async (payload) => {
  const now = new Date();
  const docRef = await getExitRequestsCollection().add({
    ...payload,
    createdAt: now,
    submittedAt: now,
    updatedAt: now,
  });
  const doc = await docRef.get();
  return toExitRequest(doc);
};

/**
 * Find exit request by ID
 */
export const findById = async (id) => {
  const doc = await getExitRequestsCollection().doc(id).get();
  return toExitRequest(doc);
};

/**
 * Find exit requests by student ID
 */
export const findByStudent = async (studentId, options = {}) => {
  // Get all documents and filter in memory to avoid index requirements
  const snapshot = await getExitRequestsCollection().get();
  let results = snapshot.docs.map(toExitRequest);
  
  // Filter by studentId in memory
  results = results.filter(req => req.studentId === studentId);
  
  // Apply status filter in memory if provided
  if (options.status) {
    results = results.filter(req => req.status === options.status);
  }
  
  // Sort in memory by createdAt descending
  results.sort((a, b) => {
    const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt || 0);
    const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt || 0);
    return dateB.getTime() - dateA.getTime();
  });
  
  // Apply limit after sorting
  if (options.limit) {
    results = results.slice(0, options.limit);
  }
  
  return results;
};

/**
 * Find pending exit requests
 */
export const findPending = async (options = {}) => {
  // Get all documents and filter in memory to avoid index requirements
  const snapshot = await getExitRequestsCollection().get();
  let results = snapshot.docs.map(toExitRequest);
  
  // Filter by pending status in memory
  results = results.filter(req => req.status === EXIT_REQUEST_STATUSES.PENDING);
  
  // Sort in memory by createdAt descending (most recent first)
  results.sort((a, b) => {
    const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt || 0);
    const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt || 0);
    return dateB.getTime() - dateA.getTime();
  });
  
  // Apply limit after sorting
  if (options.limit) {
    results = results.slice(0, options.limit);
  }
  
  return results;
};

/**
 * Find exit request by verification code
 */
export const findByVerificationCode = async (code) => {
  const snapshot = await getExitRequestsCollection()
    .where("verificationCode", "==", code)
    .limit(1)
    .get();
  
  if (snapshot.empty) return null;
  return toExitRequest(snapshot.docs[0]);
};

/**
 * Update exit request status
 */
export const updateStatus = async (id, status, metadata = {}) => {
  const updateData = {
    status,
    updatedAt: new Date(),
    ...metadata,
  };
  
  await getExitRequestsCollection().doc(id).update(updateData);
  return findById(id);
};

/**
 * Mark verification code as used
 */
export const markCodeAsUsed = async (id, verifiedAt, verifiedBy) => {
  await getExitRequestsCollection().doc(id).update({
    status: EXIT_REQUEST_STATUSES.VERIFIED,
    verificationCodeStatus: "Used",
    verifiedAt: verifiedAt || new Date(),
    verifiedBy,
    updatedAt: new Date(),
  });
  return findById(id);
};

/**
 * Find all exit requests with filters
 */
export const findAll = async (filter = {}, options = {}) => {
  // Get all documents without any where clauses to avoid index requirements
  const snapshot = await getExitRequestsCollection().get();
  let results = snapshot.docs.map(toExitRequest);
  
  // Apply all filters in memory
  if (filter.status) {
    results = results.filter(req => req.status === filter.status);
  }
  
  if (filter.dormBlockId) {
    results = results.filter(req => req.dormBlockId === filter.dormBlockId);
  }
  
  if (filter.startDate) {
    const startDate = filter.startDate instanceof Date ? filter.startDate : new Date(filter.startDate);
    results = results.filter(req => {
      const reqDate = req.createdAt instanceof Date ? req.createdAt : new Date(req.createdAt || 0);
      return reqDate >= startDate;
    });
  }
  
  if (filter.endDate) {
    const endDate = filter.endDate instanceof Date ? filter.endDate : new Date(filter.endDate);
    results = results.filter(req => {
      const reqDate = req.createdAt instanceof Date ? req.createdAt : new Date(req.createdAt || 0);
      return reqDate <= endDate;
    });
  }
  
  // Sort in memory by createdAt descending
  results.sort((a, b) => {
    const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt || 0);
    const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt || 0);
    return dateB.getTime() - dateA.getTime();
  });
  
  // Apply pagination
  if (options.offset) {
    results = results.slice(options.offset);
  }
  
  if (options.limit) {
    results = results.slice(0, options.limit);
  }
  
  return results;
};

/**
 * Count exit requests with filters
 */
export const count = async (filter = {}) => {
  // Get all documents and count in memory to avoid index requirements
  const snapshot = await getExitRequestsCollection().get();
  let results = snapshot.docs.map(toExitRequest);
  
  // Apply filters in memory
  if (filter.status) {
    results = results.filter(req => req.status === filter.status);
  }
  
  if (filter.studentId) {
    results = results.filter(req => req.studentId === filter.studentId);
  }
  
  return results.length;
};

export default {
  create,
  findById,
  findByStudent,
  findPending,
  findByVerificationCode,
  updateStatus,
  markCodeAsUsed,
  findAll,
  count,
};