import { Schema, model } from "mongoose";
const preferenceSchema = new Schema({ userId: { type: String, unique: true, index: true }, emailEnabled: { type: Boolean, default: true }, smsEnabled: { type: Boolean, default: true }, pushEnabled: { type: Boolean, default: true }, inAppEnabled: { type: Boolean, default: true } }, { timestamps: true });
export const Preference = model("Preference", preferenceSchema);
