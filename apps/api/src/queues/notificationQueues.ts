import { Queue, JobsOptions } from "bullmq";
import { makeRedisConnection } from "../config/redis.js";
import { Channel } from "@notification/shared";
export type NotificationJob = { notificationId: string };
const connection = makeRedisConnection();
export const queues = {
  EMAIL: new Queue<NotificationJob>("emailQueue", { connection }),
  SMS: new Queue<NotificationJob>("smsQueue", { connection }),
  PUSH: new Queue<NotificationJob>("pushQueue", { connection }),
  IN_APP: new Queue<NotificationJob>("inAppQueue", { connection })
};
export function queueFor(channel: Channel) { return queues[channel]; }
export async function enqueueNotification(channel: Channel, notificationId: string, delay = 0) {
  const opts: JobsOptions = { jobId: notificationId, attempts: 3, backoff: { type: "exponential", delay: 5000 }, removeOnComplete: 1000, removeOnFail: 5000, delay };
  await queueFor(channel).add("send", { notificationId }, opts);
}
export async function closeQueues() { await Promise.all(Object.values(queues).map((q) => q.close())); await connection.quit(); }
