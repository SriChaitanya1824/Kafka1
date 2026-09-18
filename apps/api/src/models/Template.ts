import { Schema, model, Types } from "mongoose";
const templateSchema = new Schema({ name: { type: String, required: true }, description: String, channel: { type: String, enum: ["EMAIL","SMS","PUSH","IN_APP"], required: true, index: true }, subject: String, content: { type: String, required: true }, variables: [String], active: { type: Boolean, default: true }, createdBy: { type: Types.ObjectId, ref: "User", index: true } }, { timestamps: true });
export const Template = model("Template", templateSchema);
