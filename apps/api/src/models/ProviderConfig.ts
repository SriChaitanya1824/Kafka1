import { Schema, model } from "mongoose";
const providerSchema = new Schema({ name: String, channel: { type: String, enum: ["EMAIL","SMS","PUSH","IN_APP"] }, type: String, enabled: { type: Boolean, default: true }, configuration: { type: Schema.Types.Mixed, default: {} } }, { timestamps: true });
providerSchema.methods.toJSON = function () { const obj = this.toObject(); if (obj.configuration) obj.configuration = { configured: Object.keys(obj.configuration).length > 0 }; obj.id = obj._id.toString(); delete obj._id; delete obj.__v; return obj; };
export const ProviderConfig = model("ProviderConfig", providerSchema);
