import Joi from "joi";

export const addFurnitureSchema = Joi.object({
  roomId: Joi.string().required(),
  itemName: Joi.string().min(1).max(100).required(),
  quantity: Joi.number().integer().min(1).required(),
  condition: Joi.string().valid("Good", "Fair", "Damaged", "Missing").required(),
});

export const updateFurnitureSchema = Joi.object({
  quantity: Joi.number().integer().min(0).optional(),
  condition: Joi.string().valid("Good", "Fair", "Damaged", "Missing").optional(),
}).min(1);

export const issueLinenSchema = Joi.object({
  studentId: Joi.string().required(),
  items: Joi.array().items(Joi.string()).min(1).required(),
  dateIssued: Joi.string().isoDate().required(),
  expectedReturnDate: Joi.string().isoDate().optional(),
});

export const returnLinenSchema = Joi.object({
  recordId: Joi.string().required(),
  itemsReturned: Joi.array().items(Joi.string()).min(1).required(),
  damages: Joi.string().max(500).optional(),
});

export const issueKeySchema = Joi.object({
  studentId: Joi.string().required(),
  roomId: Joi.string().required(),
  keyCode: Joi.string().min(1).max(50).required(),
});

export const returnKeySchema = Joi.object({
  recordId: Joi.string().required(),
  condition: Joi.string().valid("Good", "Damaged", "Missing").required(),
});
