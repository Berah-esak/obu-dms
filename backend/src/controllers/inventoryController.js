import { inventoryService } from "../services/inventoryService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const inventoryController = {
  getRoomFurniture: asyncHandler(async (req, res) => {
    const data = await inventoryService.getRoomFurniture(req.params.roomId);
    res.status(200).json({ success: true, data });
  }),

  addFurniture: asyncHandler(async (req, res) => {
    const data = await inventoryService.addFurniture(req.body);
    res.status(201).json({ success: true, data });
  }),

  updateFurniture: asyncHandler(async (req, res) => {
    const data = await inventoryService.updateFurniture(req.params.itemId, req.body);
    res.status(200).json({ success: true, data });
  }),

  issueLinen: asyncHandler(async (req, res) => {
    const data = await inventoryService.issueLinen(req.body, req.user.id);
    res.status(201).json({ success: true, data });
  }),

  returnLinen: asyncHandler(async (req, res) => {
    const data = await inventoryService.returnLinen(req.body, req.user.id);
    res.status(200).json({ success: true, data });
  }),

  issueKey: asyncHandler(async (req, res) => {
    const data = await inventoryService.issueKey(req.body, req.user.id);
    res.status(201).json({ success: true, data });
  }),

  returnKey: asyncHandler(async (req, res) => {
    const data = await inventoryService.returnKey(req.body, req.user.id);
    res.status(200).json({ success: true, data });
  }),

  getMissingKeys: asyncHandler(async (req, res) => {
    const data = await inventoryService.getMissingKeys();
    res.status(200).json({ success: true, data });
  }),
};
