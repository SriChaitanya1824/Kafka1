import crypto from "crypto";
import { Channel, sendNotificationSchema } from "@notification/shared";
import { DeliveryAttempt } from "../models/DeliveryAttempt.js";
import { IdempotencyKey } from "../models/IdempotencyKey.js";
import { InAppNotification } from "../models/InAppNotification.js";
import { Notification } from "../models/Notification.js";
import { Preference } from "../models/Preference.js";
import { Template } from "../models/Template.js";
import { Workflow } from "../models/Workflow.js";
import { enqueueNotification } from "../queues/notificationQueues.js";
import { ConflictError, NotFoundError, ValidationError } from "../utils/errors.js";
import { renderTemplate } from "../utils/renderTemplate.js";
function preferenceAllows(channel: Channel, pref: { emailEnabled: boolean; smsEnabled: boolean; pushEnabled: boolean; inAppEnabled: boolean } | null) {
  if (!pref) return true;
  return ({ EMAIL: pref.emailEnabled, SMS: pref.smsEnabled, PUSH: pref.pushEnabled, IN_APP: pref.inAppEnabled })[channel];
}
export const notificationService = {
  async send(input: unknown, userId: string, idempotencyKey?: string, scheduledAt?: Date) {
    const parsed = sendNotificationSchema.parse(input);
    const hash = crypto.createHash("sha256").update(JSON.stringify(parsed)).digest("hex");
    if (idempotencyKey) {
      const existing = await IdempotencyKey.findOne({ key: idempotencyKey, userId });
      if (existing) {
        if (existing.requestHash !== hash) throw new ConflictError("Idempotency-Key was already used with a different payload");
        return existing.response;
      }
    }
    if (scheduledAt && scheduledAt.getTime() <= Date.now()) throw new ValidationError("scheduledAt must be in the future");
    const workflow = await Workflow.findById(parsed.workflowId);
    if (!workflow || !workflow.active) throw new NotFoundError("Active workflow not found");
    const pref = parsed.recipient.userId ? await Preference.findOne({ userId: parsed.recipient.userId }) : null;
    const created = [];
    for (const step of [...workflow.steps].filter((s) => s.enabled).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))) {
      if (!preferenceAllows(step.channel as Channel, pref)) continue;
      const template = await Template.findById(step.templateId);
      if (!template || !template.active) continue;
      const payload = { subject: renderTemplate(template.subject ?? "", parsed.data, template.variables), content: renderTemplate(template.content, parsed.data, template.variables), data: parsed.data };
      const delay = (scheduledAt ? scheduledAt.getTime() - Date.now() : 0) + (step.delay ?? 0);
      const notification = await Notification.create({ workflowId: workflow.id, templateId: template.id, recipient: parsed.recipient, channel: step.channel, payload, status: delay > 0 ? "SCHEDULED" : "QUEUED", scheduledAt, queuedAt: delay > 0 ? undefined : new Date() });
      await enqueueNotification(step.channel as Channel, notification.id, Math.max(delay, 0));
      created.push(notification);
    }
    const response = { notificationId: created[0]?.id, notificationIds: created.map((n) => n.id), status: created[0]?.status ?? "CANCELLED" };
    if (idempotencyKey) await IdempotencyKey.create({ key: idempotencyKey, userId, requestHash: hash, response });
    return response;
  },
  async list(query: Record<string, string | undefined>, page: number, limit: number) {
    const filter: Record<string, unknown> = {};
    for (const key of ["status", "channel", "workflowId"] as const) if (query[key]) filter[key] = query[key];
    if (query.from || query.to) filter.createdAt = { ...(query.from ? { $gte: new Date(query.from) } : {}), ...(query.to ? { $lte: new Date(query.to) } : {}) };
    const [items, total] = await Promise.all([Notification.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit), Notification.countDocuments(filter)]);
    return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 } };
  },
  async get(id: string) { const item = await Notification.findById(id); if (!item) throw new NotFoundError("Notification not found"); return item; },
  attempts(id: string) { return DeliveryAttempt.find({ notificationId: id }).sort({ attemptNumber: 1 }); },
  async retry(id: string) {
    const item = await this.get(id);
    if (item.status !== "FAILED" && item.status !== "CANCELLED") throw new ConflictError("Only failed or cancelled notifications can be retried");
    item.status = "RETRYING"; item.error = undefined; item.queuedAt = new Date(); await item.save();
    await enqueueNotification(item.channel as Channel, item.id);
    return item;
  },
  async cancel(id: string) { const item = await this.get(id); if (["SENT","DELIVERED"].includes(item.status)) throw new ConflictError("Delivered notifications cannot be cancelled"); item.status = "CANCELLED"; await item.save(); return item; },
  async createInApp(notificationId: string, userId: string, title: string, message: string) { return InAppNotification.create({ notificationId, userId, title, message }); }
};
