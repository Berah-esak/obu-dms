import crypto from "node:crypto";

import { Student } from "../models/Student.js";
import { userRepository } from "../repositories/userRepository.js";
import { ApiError } from "../utils/ApiError.js";

const buildUserFilter = (query) => {
  const filter = {};

  if (query.role) filter.role = query.role;
  if (query.status) filter.status = query.status;
  if (query.search) {
    filter.$or = [
      { fullName: { $regex: query.search, $options: "i" } },
      { email: { $regex: query.search, $options: "i" } },
      { username: { $regex: query.search, $options: "i" } },
    ];
  }

  return filter;
};

export const userService = {
  getUsers: async (query) => {
    const users = await userRepository.findAll(buildUserFilter(query), {
      limit: Number(query.limit || 25),
      offset: Number(query.offset || 0),
    });

    const total = await userRepository.count(buildUserFilter(query));
    return { users, total };
  },

  createUser: async (payload) => {
    const username = payload.username || payload.email.split("@")[0];
    const password = payload.password || crypto.randomBytes(8).toString("hex");

    const existing = await userRepository.findByEmail(payload.email);
    if (existing) {
      throw new ApiError(409, "Email already exists");
    }

    const user = await userRepository.create({
      username,
      fullName: payload.fullName,
      email: payload.email,
      password,
      role: payload.role,
      status: "Active",
      studentId: payload.studentId,
    });

    if (payload.role === "Student" && payload.studentId) {
      await Student.create({
        studentId: payload.studentId,
        fullName: payload.fullName,
        gender: payload.gender || "M",
        department: payload.department || "General",
        year: payload.year || 1,
        phone: payload.phone || "0910000000",
        email: payload.email,
        user: user.id,
      });
    }

    return user;
  },

  getUser: async (userId) => {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return user;
  },

  updateUser: async (userId, payload) => {
    const user = await userRepository.updateById(userId, payload);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return user;
  },

  deactivate: async (userId) => {
    await userRepository.updateById(userId, { status: "Inactive" });
    return { message: "User deactivated" };
  },

  reactivate: async (userId) => {
    await userRepository.updateById(userId, { status: "Active" });
    return { message: "User reactivated" };
  },

  adminResetPassword: async (userId) => {
    const password = crypto.randomBytes(8).toString("hex");
    await userRepository.updateById(userId, { password });
    return { message: "Reset link sent" };
  },

  getRolePermissions: async () => ({
    roles: [
      { role: "Student", permissions: ["student:self", "maintenance:create"] },
      { role: "Dorm Admin", permissions: ["rooms:manage", "allocation:manage", "maintenance:manage"] },
      { role: "Maintenance Staff", permissions: ["maintenance:assigned"] },
      { role: "Management", permissions: ["reports:view", "audit:view"] },
      { role: "System Admin", permissions: ["*"] },
    ],
  }),
};
