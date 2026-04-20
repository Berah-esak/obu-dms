import Joi from "joi";
import { ApiError } from "../utils/ApiError.js";

/**
 * Returns an Express middleware that validates req.body against the given
 * Joi schema, throwing a 400 ApiError on failure.
 */
export const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
    convert: true,
  });

  if (error) {
    const details = error.details.map((d) => d.message);
    throw new ApiError(400, details.join("; "));
  }

  req.body = value;
  next();
};

/**
 * Returns an Express middleware that validates req.params against a schema.
 */
export const validateParams = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.params, {
    abortEarly: false,
    convert: true,
  });

  if (error) {
    const details = error.details.map((d) => d.message);
    throw new ApiError(400, details.join("; "));
  }

  req.params = value;
  next();
};
