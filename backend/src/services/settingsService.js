import { settingsRepository } from "../repositories/settingsRepository.js";

const DEFAULT_SETTINGS = {
  systemName: "OBU Dormitory Management System",
  adminEmail: "admin@obu.edu.et",
  sessionTimeout: 30,
  allowStudentRoomChange: true,
  requireApprovalForMaintenance: false,
  maxRoomChangeRequestsPerStudent: 2,
  notificationsEnabled: true,
  maintenanceAutoAssign: false,
  theme: "dark",
  language: "en",
};

export const settingsService = {
  getSettings: async () => {
    const settings = await settingsRepository.get();
    return settings || DEFAULT_SETTINGS;
  },
  saveSettings: async (payload) => settingsRepository.upsert(payload),
};
