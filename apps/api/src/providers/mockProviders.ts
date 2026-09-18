import crypto from "crypto";
import { NotificationProvider } from "./types.js";
export const mockEmailProvider: NotificationProvider = { name: "mock-email", channel: "EMAIL", async send() { return { success: true, providerMessageId: `email_${crypto.randomUUID()}` }; } };
export const mockSmsProvider: NotificationProvider = { name: "mock-sms", channel: "SMS", async send() { return { success: true, providerMessageId: `sms_${crypto.randomUUID()}` }; } };
export const mockPushProvider: NotificationProvider = { name: "mock-push", channel: "PUSH", async send() { return { success: true, providerMessageId: `push_${crypto.randomUUID()}` }; } };
export const inAppProvider: NotificationProvider = { name: "in-app", channel: "IN_APP", async send() { return { success: true, providerMessageId: `inapp_${crypto.randomUUID()}` }; } };
