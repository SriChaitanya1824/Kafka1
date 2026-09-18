import { Schema, model } from "mongoose";
const idemSchema = new Schema({ key: { type: String, unique: true, index: true }, userId: { type: String, index: true }, requestHash: String, response: Schema.Types.Mixed }, { timestamps: true });
export const IdempotencyKey = model("IdempotencyKey", idemSchema);
