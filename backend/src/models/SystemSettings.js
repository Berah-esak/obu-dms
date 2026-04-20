import mongoose from "mongoose";

const systemSettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "global",
    },
    systemName: {
      type: String,
      required: true,
      trim: true,
    },
    adminEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    sessionTimeout: {
      type: Number,
      default: 30,
      min: 5,
      max: 120,
    },
    allowStudentRoomChange: {
      type: Boolean,
      default: true,
    },
    requireApprovalForMaintenance: {
      type: Boolean,
      default: false,
    },
    maxRoomChangeRequestsPerStudent: {
      type: Number,
      default: 2,
      min: 1,
      max: 10,
    },
    notificationsEnabled: {
      type: Boolean,
      default: true,
    },
    maintenanceAutoAssign: {
      type: Boolean,
      default: false,
    },
    theme: {
      type: String,
      default: "dark",
    },
    language: {
      type: String,
      default: "en",
    },
  },
  {
    timestamps: true,
  }
);

systemSettingsSchema.set("toJSON", {
  virtuals: true,
  transform: (_, ret) => {
    delete ret.__v;
    return ret;
  },
});

export const SystemSettings = mongoose.model("SystemSettings", systemSettingsSchema);
