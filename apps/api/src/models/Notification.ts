import { Schema, model, Types } from "mongoose";
const recipient = new Schema({ userId: { type: String, index: true }, email: String, phone: String, pushToken: String }, { _id: false });
const notificationSchema = new Schema({ workflowId: { type: Types.ObjectId, ref: "Workflow", index: true }, templateId: { type: Types.ObjectId, ref: "Template" }, recipient, channel: { type: String, enum: ["EMAIL","SMS","PUSH","IN_APP"], index: true }, payload: Schema.Types.Mixed, status: { type: String, enum: ["QUEUED","PROCESSING","SENT","DELIVERED","FAILED","RETRYING","CANCELLED","SCHEDULED"], default: "QUEUED", index: true }, provider: String, attempts: { type: Number, default: 0 }, scheduledAt: Date, queuedAt: Date, processingAt: Date, sentAt: Date, deliveredAt: Date, failedAt: Date, error: String }, { timestamps: true });
notificationSchema.index({ createdAt: -1 });
export const Notification = model("Notification", notificationSchema);
