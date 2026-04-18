import { User } from "../models/User.js";

export const userRepository = {
  findByUsername: (username, options = {}) => {
    const query = User.findOne({ username: String(username).toLowerCase() });

    if (options.includePassword) {
      query.select("+password");
    }

    return query;
  },

  findByEmail: (email, options = {}) => {
    const query = User.findOne({ email });

    if (options.includePassword) {
      query.select("+password");
    }

    return query;
  },

  findAll: (filter = {}, options = {}) =>
    User.find(filter)
      .skip(options.offset || 0)
      .limit(options.limit || 0)
      .sort(options.sort || { createdAt: -1 }),

  count: (filter = {}) => User.countDocuments(filter),

  findById: (id) => User.findById(id).select("-password"),

  updateById: (id, payload) =>
    User.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    }),

  create: (payload) => User.create(payload),
};
