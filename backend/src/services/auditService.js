import { auditRepository } from "../repositories/auditRepository.js";

const buildFilter = (query) => {
  const filter = {};
  if (query.user) filter.user = query.user;
  if (query.action) filter.action = query.action;
  if (query.entity) filter.entity = query.entity;

  if (query.startDate || query.endDate) {
    filter.timestamp = {};
    if (query.startDate) filter.timestamp.$gte = new Date(query.startDate);
    if (query.endDate) filter.timestamp.$lte = new Date(query.endDate);
  }

  return filter;
};

export const auditService = {
  getAuditLogs: async (query) => {
    const page = Number(query.page || 1);
    const limit = Number(query.limit || 50);
    const offset = (page - 1) * limit;

    const filter = buildFilter(query);
    const logs = await auditRepository.findAll(filter, { offset, limit });
    const total = await auditRepository.count(filter);

    return {
      logs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },

  exportAuditLogs: async (query) => ({
    fileUrl: `/exports/audit-logs-${Date.now()}.csv`,
    expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    filters: query,
  }),
};
