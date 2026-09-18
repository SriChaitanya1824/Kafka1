import { Schema, model, Types } from "mongoose";
const step = new Schema({ order: Number, channel: { type: String, enum: ["EMAIL","SMS","PUSH","IN_APP"] }, templateId: { type: Types.ObjectId, ref: "Template" }, delay: { type: Number, default: 0 }, enabled: { type: Boolean, default: true } }, { _id: false });
const workflowSchema = new Schema({ name: { type: String, required: true }, description: String, steps: [step], active: { type: Boolean, default: true }, createdBy: { type: Types.ObjectId, ref: "User", index: true } }, { timestamps: true });
export const Workflow = model("Workflow", workflowSchema);
