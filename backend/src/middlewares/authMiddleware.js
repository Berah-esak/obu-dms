import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
import { logger } from "../utils/logger.js";

/**
 * Maps DB role values (Title Case) → API role tokens (snake_case).
 * This lets the DB enum stay as-is while the JWT and frontend
 * always deal with consistent snake_case role strings.
 */
const DB_ROLE_TO_API_ROLE = {
  "Student": "student",
  "Dorm Admin": "dorm_admin",
  "Maintenance Staff": "maintenance",
  "Management": "management",
  "System Admin": "system_admin",
};

/** Also accept snake_case roles in case they are already normalised */
const API_ROLES = new Set(Object.values(DB_ROLE_TO_API_ROLE));

export const normaliseRole = (role) => {
  if (!role) return "student";
  if (API_ROLES.has(role)) return role;
  return DB_ROLE_TO_API_ROLE[role] || role.toLowerCase().replace(/\s+/g, "_");
};

export const requireAuth = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new ApiError(401, "Authorization token is missing");
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    const originalRole = decoded.role;
    const normalizedRole = normaliseRole(decoded.role);
    
    logger.info(`[AUTH DEBUG] Original role from JWT: "${originalRole}", Normalized role: "${normalizedRole}"`);
    
    req.user = {
      id: decoded.sub,
      role: normalizedRole,
    };

    next();
  } catch (error) {
    logger.error(`[AUTH DEBUG] Token verification failed: ${error.message}`);
    logger.error(`[AUTH DEBUG] Token (first 20 chars): ${token.substring(0, 20)}...`);
    throw new ApiError(401, "Invalid or expired token");
  }
};

/**
 * Accepts snake_case role strings (matching the frontend's UserRole type):
 *   "student" | "dorm_admin" | "maintenance" | "management" | "system_admin"
 */
export const authorizeRoles = (...allowedRoles) =>
  (req, res, next) => {
    if (!req.user?.role) {
      throw new ApiError(401, "Unauthorized");
    }
    
    logger.info(`[AUTH DEBUG] User role: "${req.user.role}", Allowed roles: [${allowedRoles.join(', ')}]`);
    
    if (!allowedRoles.includes(req.user.role)) {
      logger.error(`[AUTH DEBUG] Role "${req.user.role}" not in allowed roles: [${allowedRoles.join(', ')}]`);
      throw new ApiError(403, "Insufficient permission");
    }

    next();
  };
