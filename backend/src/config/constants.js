/**
 * System Constants
 * Hardcoded credentials and configuration values
 */

export const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "Admin@2026",
  email: "admin@gmail.com",
  fullName: "System Administrator",
  role: "System Admin",
};

export const SYSTEM_ROLES = {
  SYSTEM_ADMIN: "System Admin",
  PROCTOR_HEAD: "Proctor Head",
  PROCTOR: "Proctor",
  DORM_ADMIN: "Dorm Admin", // Legacy - same as Proctor Head
  MAINTENANCE_STAFF: "Maintenance Staff",
  MANAGER: "Management",
  STUDENT: "Student",
  GATE_GUARD: "Gate Guard",
};

export const USER_STATUSES = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
};

export const ROOM_STATUSES = {
  AVAILABLE: "Available",
  OCCUPIED: "Occupied",
  UNDER_MAINTENANCE: "Under Maintenance",
};

export const MAINTENANCE_PRIORITIES = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

export const MAINTENANCE_STATUSES = {
  SUBMITTED: "Submitted",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  REJECTED: "Rejected",
};

export const ROOM_CHANGE_REASONS = {
  CONFLICT: "conflict",
  MAINTENANCE: "maintenance",
  HEALTH: "health",
  OTHER: "other",
};

export const ROOM_CHANGE_STATUSES = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

export const EXIT_REQUEST_STATUSES = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  VERIFIED: "Verified",
};

export const VERIFICATION_CODE_STATUSES = {
  ACTIVE: "Active",
  USED: "Used",
};

export const COMPLAINT_STATUSES = {
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under Review",
  RESOLVED: "Resolved",
};

export const COMPLAINT_CATEGORIES = {
  FACILITY: "Facility",
  ROOMMATE: "Roommate",
  NOISE: "Noise",
  SAFETY: "Safety",
  OTHER: "Other",
};

export const ATTENDANCE_STATUSES = {
  PRESENT: "Present",
  ABSENT: "Absent",
};

export const MATERIAL_CONDITIONS = {
  GOOD: "Good",
  FAIR: "Fair",
  DAMAGED: "Damaged",
  MISSING: "Missing",
};

export const AUDIT_ACTIONS = {
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  APPROVE: "APPROVE",
  REJECT: "REJECT",
  ASSIGN: "ASSIGN",
};

export const NOTIFICATION_TYPES = {
  ROOM_ASSIGNMENT: "room_assignment",
  ROOM_CHANGE: "room_change",
  MAINTENANCE_UPDATE: "maintenance_update",
  ANNOUNCEMENT: "announcement",
  EXIT_REQUEST: "exit_request",
  COMPLAINT: "complaint",
  ATTENDANCE: "attendance",
};

export const GENDER_RESTRICTIONS = {
  MALE: "Male",
  FEMALE: "Female",
  NONE: "None",
};

export const ROOM_TYPES = {
  SINGLE: "Single",
  DOUBLE: "Double",
  TRIPLE: "Triple",
};

export const FURNITURE_CONDITIONS = {
  GOOD: "Good",
  FAIR: "Fair",
  DAMAGED: "Damaged",
  MISSING: "Missing",
};

export const KEY_CONDITIONS = {
  GOOD: "Good",
  DAMAGED: "Damaged",
  LOST: "Lost",
};

export const LINEN_ITEMS = [
  "Sheet",
  "Blanket",
  "Pillowcase",
  "Towel",
  "Mattress Cover",
];

export const FURNITURE_ITEMS = [
  "Bed",
  "Mattress",
  "Desk",
  "Chair",
  "Wardrobe",
  "Shelf",
  "Lamp",
  "Mirror",
];

export const MAINTENANCE_CATEGORIES = {
  PLUMBING: "Plumbing",
  ELECTRICAL: "Electrical",
  FURNITURE: "Furniture",
  SANITATION: "Sanitation",
  OTHER: "Other",
};

export const PAGINATION = {
  DEFAULT_LIMIT: 25,
  DEFAULT_OFFSET: 0,
  MAX_LIMIT: 100,
};

export const SESSION_CONFIG = {
  JWT_EXPIRES_IN: "7d",
  REFRESH_TOKEN_EXPIRES_IN: 30 * 24 * 60 * 60 * 1000, // 30 days
  PASSWORD_RESET_EXPIRES_IN: 60 * 60 * 1000, // 1 hour
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
};

export const VALIDATION_RULES = {
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 50,
  PASSWORD_MIN_LENGTH: 6,
  FULLNAME_MIN_LENGTH: 2,
  FULLNAME_MAX_LENGTH: 120,
  PHONE_PATTERN: /^[0-9]{10}$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  UNIVERSITY_EMAIL_DOMAIN: "@gmail.com",
};

export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: "Invalid credentials",
  USER_NOT_FOUND: "User not found",
  EMAIL_ALREADY_EXISTS: "Email already exists",
  USERNAME_ALREADY_EXISTS: "Username already exists",
  INSUFFICIENT_PERMISSIONS: "Insufficient permissions",
  INVALID_TOKEN: "Invalid or expired token",
  SESSION_EXPIRED: "Session expired",
  INVALID_EMAIL_DOMAIN: "Email must be from @gmail.com domain",
  ROOM_AT_CAPACITY: "Room is at maximum capacity",
  STUDENT_ALREADY_ASSIGNED: "Student is already assigned to a room",
  INVALID_ROLE: "Invalid user role",
  VERIFICATION_CODE_INVALID: "Invalid verification code",
  VERIFICATION_CODE_USED: "Verification code has already been used",
  EXIT_REQUEST_NOT_FOUND: "Exit request not found",
};

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Login successful",
  LOGOUT_SUCCESS: "Logout successful",
  REGISTRATION_SUCCESS: "Registration successful",
  USER_CREATED: "User created successfully",
  USER_UPDATED: "User updated successfully",
  USER_DELETED: "User deleted successfully",
  PASSWORD_RESET: "Password reset successful",
  ROOM_ASSIGNED: "Room assigned successfully",
  EXIT_REQUEST_SUBMITTED: "Exit request submitted successfully",
  EXIT_REQUEST_APPROVED: "Exit request approved successfully",
  EXIT_REQUEST_REJECTED: "Exit request rejected",
  VERIFICATION_SUCCESS: "Verification successful",
};

// Firestore collection names
export const COLLECTIONS = {
  USERS: "users",
  STUDENTS: "students",
  ROOMS: "rooms",
  DORMS: "dorms",
  ASSIGNMENTS: "assignments",
  MAINTENANCE_REQUESTS: "maintenanceRequests",
  ROOM_CHANGE_REQUESTS: "roomChangeRequests",
  NOTIFICATIONS: "notifications",
  AUDIT_LOGS: "auditLogs",
  SETTINGS: "settings",
  REFRESH_TOKENS: "refreshTokens",
  EXIT_REQUESTS: "exitRequests",
  ATTENDANCE_RECORDS: "attendanceRecords",
  MATERIAL_ITEMS: "materialItems",
  ANNOUNCEMENTS: "announcements",
  ANNOUNCEMENT_READS: "announcementReads",
  COMPLAINTS: "complaints",
  DORM_BLOCKS: "dormBlocks",
};
