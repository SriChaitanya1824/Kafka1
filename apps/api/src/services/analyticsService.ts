import { Notification } from "../models/Notification.js";
export const analyticsService = {
  async overview() {
    const rows = await Notification.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]);
    const counts = Object.fromEntries(rows.map((r) => [String(r._id).toLowerCase(), r.count]));
    const total = rows.reduce((sum, r) => sum + r.count, 0);
    const delivered = counts.delivered ?? 0; const failed = counts.failed ?? 0;
    return { total, ...counts, deliveryRate: total ? delivered / total : 0, failureRate: total ? failed / total : 0 };
  },
  channels: () => Notification.aggregate([{ $group: { _id: "$channel", count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
  daily: () => Notification.aggregate([{ $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } }, { $sort: { _id: 1 } }]),
  failures: () => Notification.aggregate([{ $match: { status: "FAILED" } }, { $group: { _id: "$provider", count: { $sum: 1 } } }, { $sort: { count: -1 } }])
};
