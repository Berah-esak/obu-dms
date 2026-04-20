import Joi from "joi";

export const broadcastSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  message: Joi.string().min(1).max(2000).required(),
  target: Joi.string().valid("all", "dorm", "student").required(),
  targetId: Joi.string().optional().allow(null, ""),
  attachmentUrl: Joi.string().uri().optional().allow(null, ""),
});
