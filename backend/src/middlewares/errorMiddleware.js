import { ApiError } from "../utils/ApiError.js";
import { logger } from "../utils/logger.js";

const ERROR_CODES = {
  400: "VALIDATION_ERROR",
  401: "UNAUTHORIZED",
  403: "FORBIDDEN",
  404: "NOT_FOUND",
  409: "CONFLICT",
  500: "SERVER_ERROR",
};

export const errorHandler = (err, req, res, next) => {
  let statusCode;
  let message;
  let details;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === "ValidationError") {
    // Mongoose schema validation
    statusCode = 400;
    message = "Validation failed";
    details = Object.values(err.errors).map((e) => e.message);
  } else if (err.name === "CastError") {
    // Invalid Mongo ObjectId
    statusCode = 404;
    message = "Resource not found";
  } else if (err.code === 11000) {
    // Mongo duplicate key
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `${field} already exists`;
  } else {
    statusCode = 500;
    message =
      process.env.NODE_ENV === "production"
        ? "Something went wrong"
        : err.message || "Internal server error";
  }

  logger.error(err.message, {
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
    statusCode,
  });

  res.status(statusCode).json({
    success: false,
    code: ERROR_CODES[statusCode] || "SERVER_ERROR",
    message,
    ...(details ? { details } : {}),
  });
};
