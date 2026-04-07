/**
 * Local in-memory + localStorage store for all form submissions.
 * Acts as a mock backend — all pages read/write here instead of the API.
 */
import { mockRoomChangeRequests, mockMaintenanceRequests, mockNotifications, mockAuditLogs, mockDashboard, mockRooms, mockStudents } from './mock-data';

function loadOrDefault<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// ── Room Change Requests ──────────────────────────────────────────────────────
export function getRoomChangeRequests() {
  return loadOrDefault('dms_room_changes', mockRoomChangeRequests);
}

export function addRoomChangeRequest(req: any) {
  const all = getRoomChangeRequests();
  const updated = [req, ...all];
  save('dms_room_changes', updated);
  return updated;
}

export function updateRoomChangeRequest(id: string, patch: any) {
  const all = getRoomChangeRequests();
  const updated = all.map((r: any) => r.id === id ? { ...r, ...patch } : r);
  save('dms_room_changes', updated);
  return updated;
}

// ── Maintenance Requests ──────────────────────────────────────────────────────
export function getMaintenanceRequests() {
  return loadOrDefault('dms_maintenance', mockMaintenanceRequests);
}

export function addMaintenanceRequest(req: any) {
  const all = getMaintenanceRequests();
  const updated = [req, ...all];
  save('dms_maintenance', updated);
  return updated;
}

export function updateMaintenanceRequest(id: string, patch: any) {
  const all = getMaintenanceRequests();
  const updated = all.map((r: any) => r.id === id ? { ...r, ...patch } : r);
  save('dms_maintenance', updated);
  return updated;
}

// ── Notifications ─────────────────────────────────────────────────────────────
export function getNotifications() {
  return loadOrDefault('dms_notifications', mockNotifications);
}

export function markNotificationRead(id: string) {
  const all = getNotifications();
  const updated = all.map((n: any) => n.id === id ? { ...n, isRead: true } : n);
  save('dms_notifications', updated);
  return updated;
}

export function markAllNotificationsRead() {
  const all = getNotifications();
  const updated = all.map((n: any) => ({ ...n, isRead: true }));
  save('dms_notifications', updated);
  return updated;
}

export function addNotification(n: any) {
  const all = getNotifications();
  const updated = [n, ...all];
  save('dms_notifications', updated);
  return updated;
}

// ── Audit Logs ────────────────────────────────────────────────────────────────
export function getAuditLogs() {
  return loadOrDefault('dms_audit_logs', mockAuditLogs);
}

export function addAuditLog(log: any) {
  const all = getAuditLogs();
  const updated = [log, ...all];
  save('dms_audit_logs', updated);
  return updated;
}

// ── Dashboard Summary ─────────────────────────────────────────────────────────
export function getDashboardSummary() {
  return loadOrDefault('dms_dashboard', mockDashboard);
}

// ── Rooms ─────────────────────────────────────────────────────────────────────
export function getRooms() {
  return loadOrDefault('dms_rooms', mockRooms);
}

export function saveRooms(rooms: any[]) {
  save('dms_rooms', rooms);
}

// ── Students ──────────────────────────────────────────────────────────────────
export function getStudents() {
  return loadOrDefault('dms_students', mockStudents);
}

export function saveStudents(students: any[]) {
  save('dms_students', students);
}

// ── Settings ──────────────────────────────────────────────────────────────────
const defaultSettings = {
  systemName: 'OBU Dormitory Management System',
  adminEmail: 'admin@obu.edu.et',
  sessionTimeout: 30,
  allowStudentRoomChange: true,
  requireApprovalForMaintenance: false,
  maxRoomChangeRequestsPerStudent: 2,
  notificationsEnabled: true,
  maintenanceAutoAssign: false,
  theme: 'dark',
  language: 'en',
};

export function getSettings() {
  return loadOrDefault('dms_settings', defaultSettings);
}

export function saveSettings(settings: any) {
  save('dms_settings', settings);
  return settings;
}

// ── ID generator ──────────────────────────────────────────────────────────────
export function genId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}
