import Joi from "joi";

export const submitMaintenanceSchema = Joi.object({
  roomId: Joi.string().required(),
  category: Joi.string().valid("Plumbing", "Electrical", "Furniture", "Sanitation", "Other").required(),
  description: Joi.string().min(10).max(1000).required(),
  priority: Joi.string().valid("Low", "Medium", "High").required(),
});

export const updateStatusSchema = Joi.object({
  status: Joi.string().valid("Submitted", "In Progress", "Completed", "Rejected").required(),
  resolutionNotes: Joi.string().max(2000).optional(),
});

export const addNoteSchema = Joi.object({
  note: Joi.string().min(1).max(2000).required(),
  isInternal: Joi.boolean().default(false),
});

export const reassignSchema = Joi.object({
  staffId: Joi.string().required(),
});
