import { roomService } from "../services/roomService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const roomController = {
  getAllDorms: asyncHandler(async (req, res) => {
    const buildings = await roomService.getAllDorms();
    res.status(200).json({ buildings });
  }),

  createDorm: asyncHandler(async (req, res) => {
    const dorm = await roomService.createDorm(req.body);
    res.status(201).json(dorm);
  }),

  addFloor: asyncHandler(async (req, res) => {
    const result = await roomService.addFloor(req.params.dormId, req.body);
    res.status(201).json(result);
  }),

  getRooms: asyncHandler(async (req, res) => {
    const rooms = await roomService.getRooms(req.query);
    res.status(200).json({ rooms });
  }),

  createRoom: asyncHandler(async (req, res) => {
    const room = await roomService.createRoom(req.body);
    res.status(201).json(room);
  }),

  getRoom: asyncHandler(async (req, res) => {
    const room = await roomService.getRoom(req.params.roomId);
    res.status(200).json(room);
  }),

  updateRoom: asyncHandler(async (req, res) => {
    const room = await roomService.updateRoom(req.params.roomId, req.body);
    res.status(200).json(room);
  }),

  getRoomOccupants: asyncHandler(async (req, res) => {
    const data = await roomService.getRoomOccupants(req.params.roomId);
    res.status(200).json(data);
  }),

  getAvailableRooms: asyncHandler(async (req, res) => {
    const data = await roomService.getAvailableRooms(req.query);
    res.status(200).json(data);
  }),

  getUnassignedStudents: asyncHandler(async (req, res) => {
    const data = await roomService.getUnassignedStudents();
    res.status(200).json(data);
  }),
};
