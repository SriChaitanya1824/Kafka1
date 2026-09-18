import { z } from "zod";
import { paginationSchema } from "@notification/shared";
import { notificationService } from "../services/notificationService.js";
import { analyticsService } from "../services/analyticsService.js";
import { ok, created } from "../utils/responses.js";
import { Preference } from "../models/Preference.js";
import { InAppNotification } from "../models/InAppNotification.js";
import { ProviderConfig } from "../models/ProviderConfig.js";
export const notificationController = {
  send: async (req, res) => created(res, await notificationService.send(req.body, req.user!.id, req.header("Idempotency-Key") ?? undefined)),
  schedule: async (req, res) => { const { scheduledAt, ...body } = z.object({ scheduledAt: z.string().datetime() }).passthrough().parse(req.body); created(res, await notificationService.send(body, req.user!.id, req.header("Idempotency-Key") ?? undefined, new Date(scheduledAt))); },
  list: async (req, res) => { const p = paginationSchema.parse(req.query); const r = await notificationService.list(req.query as Record<string,string>, p.page, p.limit); ok(res, { data: r.items, pagination: r.pagination }); },
  get: async (req, res) => ok(res, await notificationService.get(req.params.id)),
  attempts: async (req, res) => ok(res, await notificationService.attempts(req.params.id)),
  retry: async (req, res) => ok(res, await notificationService.retry(req.params.id)),
  cancel: async (req, res) => ok(res, await notificationService.cancel(req.params.id))
} satisfies Record<string, import("express").RequestHandler>;
export const miscController = {
  preferences: async (req, res) => ok(res, await Preference.findOneAndUpdate({ userId: req.user!.id }, { $setOnInsert: { userId: req.user!.id } }, { new: true, upsert: true })),
  updatePreferences: async (req, res) => ok(res, await Preference.findOneAndUpdate({ userId: req.user!.id }, z.object({ emailEnabled: z.boolean().optional(), smsEnabled: z.boolean().optional(), pushEnabled: z.boolean().optional(), inAppEnabled: z.boolean().optional() }).parse(req.body), { new: true, upsert: true })),
  inAppList: async (req, res) => ok(res, await InAppNotification.find({ userId: req.user!.id }).sort({ createdAt: -1 }).limit(50)),
  unread: async (req, res) => ok(res, { count: await InAppNotification.countDocuments({ userId: req.user!.id, read: false }) }),
  readOne: async (req, res) => ok(res, await InAppNotification.findOneAndUpdate({ _id: req.params.id, userId: req.user!.id }, { read: true, readAt: new Date() }, { new: true })),
  readAll: async (req, res) => ok(res, await InAppNotification.updateMany({ userId: req.user!.id, read: false }, { read: true, readAt: new Date() })),
  providers: async (_req, res) => ok(res, await ProviderConfig.find()),
  createProvider: async (req, res) => created(res, await ProviderConfig.create(req.body)),
  overview: async (_req, res) => ok(res, await analyticsService.overview()),
  channels: async (_req, res) => ok(res, await analyticsService.channels()),
  daily: async (_req, res) => ok(res, await analyticsService.daily()),
  failures: async (_req, res) => ok(res, await analyticsService.failures())
} satisfies Record<string, import("express").RequestHandler>;
