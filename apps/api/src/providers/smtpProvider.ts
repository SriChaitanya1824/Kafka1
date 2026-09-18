import nodemailer from "nodemailer";
import { env } from "../config/env.js";
import { NotificationProvider } from "./types.js";
export const smtpProvider: NotificationProvider = {
  name: "smtp", channel: "EMAIL",
  async send(payload) {
    if (!env.EMAIL_HOST || !env.EMAIL_USER || !env.EMAIL_PASSWORD) return { success: false, error: "SMTP credentials are not configured" };
    const transporter = nodemailer.createTransport({ host: env.EMAIL_HOST, port: env.EMAIL_PORT, secure: env.EMAIL_PORT === 465, auth: { user: env.EMAIL_USER, pass: env.EMAIL_PASSWORD } });
    const result = await transporter.sendMail({ from: env.EMAIL_FROM, to: String(payload.recipient.email), subject: payload.subject, text: payload.content });
    return { success: true, providerMessageId: result.messageId };
  }
};
