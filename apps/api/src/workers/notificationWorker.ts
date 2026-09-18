import { Worker } from "bullmq";
import { Channel } from "@notification/shared";
import { makeRedisConnection } from "../config/redis.js";
import { DeliveryAttempt } from "../models/DeliveryAttempt.js";
import { InAppNotification } from "../models/InAppNotification.js";
import { Notification } from "../models/Notification.js";
import { resolveProvider } from "../providers/providerRegistry.js";
import { logger } from "../config/logger.js";
export function createWorker(channel: Channel) {
  const names = { EMAIL: "emailQueue", SMS: "smsQueue", PUSH: "pushQueue", IN_APP: "inAppQueue" };
  return new Worker(names[channel], async (job) => {
    const notification = await Notification.findById(job.data.notificationId);
    if (!notification || notification.status === "CANCELLED") return;
    notification.status = "PROCESSING"; notification.processingAt = new Date(); notification.attempts += 1; await notification.save();
    const provider = resolveProvider(channel);
    const attempt = await DeliveryAttempt.create({ notificationId: notification.id, attemptNumber: notification.attempts, provider: provider.name, status: "PROCESSING", startedAt: new Date() });
    try {
      const result = await provider.send({ subject: notification.payload?.subject, content: notification.payload?.content, recipient: notification.recipient as Record<string, unknown> });
      if (!result.success) throw new Error(result.error ?? "Provider failed");
      attempt.status = "SENT"; attempt.response = result; attempt.completedAt = new Date(); await attempt.save();
      notification.provider = provider.name; notification.status = channel === "IN_APP" ? "DELIVERED" : "SENT"; notification.sentAt = new Date(); if (channel === "IN_APP") notification.deliveredAt = new Date();
      if (channel === "IN_APP" && notification.recipient?.userId) await InAppNotification.create({ userId: notification.recipient.userId, title: notification.payload?.subject ?? "Notification", message: notification.payload?.content, notificationId: notification.id });
      await notification.save(); logger.info({ event: "notification.sent", notificationId: notification.id, channel, provider: provider.name });
    } catch (error) {
      attempt.status = "FAILED"; attempt.error = error instanceof Error ? error.message : "Unknown error"; attempt.completedAt = new Date(); await attempt.save();
      notification.provider = provider.name; notification.status = job.attemptsMade + 1 >= (job.opts.attempts ?? 1) ? "FAILED" : "RETRYING"; notification.error = attempt.error; notification.failedAt = notification.status === "FAILED" ? new Date() : undefined; await notification.save();
      logger.error({ event: "notification.failed", notificationId: notification.id, channel, error: attempt.error });
      throw error;
    }
  }, { connection: makeRedisConnection(), concurrency: 5 });
}
