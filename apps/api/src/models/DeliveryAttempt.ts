import { Schema, model, Types } from "mongoose";
const deliveryAttemptSchema = new Schema({ notificationId: { type: Types.ObjectId, ref: "Notification", index: true }, attemptNumber: Number, provider: String, status: String, response: Schema.Types.Mixed, error: String, startedAt: Date, completedAt: Date }, { timestamps: true });
export const DeliveryAttempt = model("DeliveryAttempt", deliveryAttemptSchema);
