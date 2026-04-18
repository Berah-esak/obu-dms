import crypto from "node:crypto";
import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import { tokenRepository } from "../repositories/tokenRepository.js";
import { userRepository } from "../repositories/userRepository.js";
import { ApiError } from "../utils/ApiError.js";

const generateToken = (userId, role) =>
  jwt.sign({ sub: userId, role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });

export const authService = {
  login: async (payload) => {
    if (!payload.username || !payload.password) {
      throw new ApiError(400, "username and password are required");
    }

    const user = await userRepository.findByUsername(payload.username, {
      includePassword: true,
    });

    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }

    const isPasswordValid = await user.comparePassword(payload.password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid credentials");
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user.id, user.role);
    const refreshToken = crypto.randomBytes(48).toString("hex");
    await tokenRepository.createRefreshToken({
      user: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    return {
      token,
      refreshToken,
      role: user.role,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    };
  },

  logout: async () => ({ message: "Logout successful" }),

  forgotPassword: async (payload) => {
    if (!payload.email) {
      throw new ApiError(400, "email is required");
    }

    const user = await userRepository.findByEmail(payload.email.toLowerCase());
    if (!user) {
      return { message: "Reset link sent if email exists" };
    }

    const token = crypto.randomBytes(32).toString("hex");
    await tokenRepository.createPasswordResetToken({
      user: user.id,
      token,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    });

    return { message: "Reset link sent if email exists" };
  },

  resetPassword: async (payload) => {
    if (!payload.token || !payload.newPassword) {
      throw new ApiError(400, "token and newPassword are required");
    }

    const resetToken = await tokenRepository.findValidPasswordResetToken(payload.token);
    if (!resetToken || resetToken.expiresAt < new Date()) {
      throw new ApiError(400, "Invalid or expired reset token");
    }

    await userRepository.updatePassword(resetToken.user, payload.newPassword);
    await tokenRepository.markPasswordTokenUsed(resetToken.id);

    return { message: "Password reset successful" };
  },

  validateSession: async (userId) => {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ApiError(401, "Session invalid");
    }

    return {
      valid: true,
      role: user.role,
    };
  },
};
