// Firestore collection name constants
// These replace Mongoose models — all data access goes through repositories.

export const COLLECTIONS = {
  USERS: "users",
  STUDENTS: "students",
  DORMS: "dorms",
  ROOMS: "rooms",
  ASSIGNMENTS: "assignments",
  ROOM_CHANGE_REQUESTS: "roomChangeRequests",
  MAINTENANCE_REQUESTS: "maintenanceRequests",
  FURNITURE_ITEMS: "furnitureItems",
  LINEN_RECORDS: "linenRecords",
  KEY_RECORDS: "keyRecords",
  NOTIFICATIONS: "notifications",
  AUDIT_LOGS: "auditLogs",
  REFRESH_TOKENS: "refreshTokens",
  PASSWORD_RESET_TOKENS: "passwordResetTokens",
  SYSTEM_SETTINGS: "systemSettings",
  EXIT_REQUESTS: "exitRequests",
  ATTENDANCE_RECORDS: "attendanceRecords",
  MATERIAL_ITEMS: "materialItems",
  ANNOUNCEMENTS: "announcements",
  ANNOUNCEMENT_READS: "announcementReads",
  COMPLAINTS: "complaints",
  DORM_BLOCKS: "dormBlocks",
};
