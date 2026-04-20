import { SystemSettings } from "../models/SystemSettings.js";

export const settingsRepository = {
  get: () => SystemSettings.findOne({ key: "global" }),
  upsert: (payload) =>
    SystemSettings.findOneAndUpdate(
      { key: "global" },
      { $set: { ...payload, key: "global" } },
      { new: true, upsert: true, runValidators: true }
    ),
};
