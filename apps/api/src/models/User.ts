import { Schema, model } from "mongoose";
const userSchema = new Schema({ name: { type: String, required: true }, email: { type: String, required: true, unique: true, lowercase: true, index: true }, passwordHash: { type: String, required: true }, role: { type: String, enum: ["USER", "ADMIN"], default: "USER" }, refreshTokenHash: String }, { timestamps: true });
userSchema.methods.toJSON = function () { const obj = this.toObject(); delete obj.passwordHash; delete obj.refreshTokenHash; obj.id = obj._id.toString(); delete obj._id; delete obj.__v; return obj; };
export const User = model("User", userSchema);
