import { settingsService } from "../services/settingsService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const settingsController = {
  getSettings: asyncHandler(async (req, res) => {
    const data = await settingsService.getSettings();
    res.status(200).json({ success: true, data });
  }),

  saveSettings: asyncHandler(async (req, res) => {
    const data = await settingsService.updateSettings(req.body, req.user.id);
    res.status(200).json({ success: true, data });
  }),
};
