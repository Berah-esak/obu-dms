import Joi from "joi";

export const submitRoomChangeSchema = Joi.object({
  reason: Joi.string().valid("conflict", "maintenance", "health", "other").required(),
  description: Joi.string().min(10).max(1000).required(),
});

export const approveRoomChangeSchema = Joi.object({
  newRoomId: Joi.string().required(),
});

export const rejectRoomChangeSchema = Joi.object({
  rejectionReason: Joi.string().min(5).max(500).required(),
});
