import { Schema, model, Types } from "mongoose";
const inAppSchema = new Schema({ userId: { type: String, index: true }, title: String, message: String, notificationId: { type: Types.ObjectId, ref: "Notification" }, read: { type: Boolean, default: false, index: true }, readAt: Date }, { timestamps: true });
export const InAppNotification = model("InAppNotification", inAppSchema);
