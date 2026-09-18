import { z } from "zod";
export const channels = ["EMAIL", "SMS", "PUSH", "IN_APP"];
export const statuses = ["QUEUED", "PROCESSING", "SENT", "DELIVERED", "FAILED", "RETRYING", "CANCELLED", "SCHEDULED"];
export const roles = ["USER", "ADMIN"];
export const recipientSchema = z.object({
    userId: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    pushToken: z.string().optional()
});
export const sendNotificationSchema = z.object({
    workflowId: z.string(),
    recipient: recipientSchema,
    data: z.record(z.unknown()).default({})
});
export const paginationSchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20)
});
export const templateSchema = z.object({
    name: z.string().min(2),
    description: z.string().optional().default(""),
    channel: z.enum(channels),
    subject: z.string().optional().default(""),
    content: z.string().min(1),
    variables: z.array(z.string()).default([]),
    active: z.boolean().default(true)
});
export const workflowStepSchema = z.object({
    order: z.number().int().positive(),
    channel: z.enum(channels),
    templateId: z.string(),
    delay: z.number().int().min(0).default(0),
    enabled: z.boolean().default(true)
});
export const workflowSchema = z.object({
    name: z.string().min(2),
    description: z.string().optional().default(""),
    steps: z.array(workflowStepSchema).min(1),
    active: z.boolean().default(true)
});
