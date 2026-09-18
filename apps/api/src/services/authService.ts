import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { Preference } from "../models/Preference.js";
import { ConflictError, AuthenticationError } from "../utils/errors.js";
import { env } from "../config/env.js";
function sign(user: { id: string; email: string; role: string }) {
  return {
    accessToken: jwt.sign({ email: user.email, role: user.role }, env.JWT_SECRET, { subject: user.id, expiresIn: "15m" }),
    refreshToken: jwt.sign({ email: user.email, role: user.role }, env.JWT_REFRESH_SECRET, { subject: user.id, expiresIn: "7d" })
  };
}
export const authService = {
  async register(input: { name: string; email: string; password: string; role?: "USER" | "ADMIN" }) {
    if (await User.findOne({ email: input.email.toLowerCase() })) throw new ConflictError("Email already registered");
    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = await User.create({ name: input.name, email: input.email.toLowerCase(), passwordHash, role: input.role ?? "USER" });
    await Preference.create({ userId: user.id });
    const tokens = sign({ id: user.id, email: user.email, role: user.role });
    user.refreshTokenHash = await bcrypt.hash(tokens.refreshToken, 12); await user.save();
    return { user, ...tokens };
  },
  async login(email: string, password: string) {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) throw new AuthenticationError("Invalid credentials");
    const tokens = sign({ id: user.id, email: user.email, role: user.role });
    user.refreshTokenHash = await bcrypt.hash(tokens.refreshToken, 12); await user.save();
    return { user, ...tokens };
  },
  async refresh(refreshToken: string) {
    const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { sub: string; email: string; role: "USER" | "ADMIN" };
    const user = await User.findById(payload.sub);
    if (!user?.refreshTokenHash || !(await bcrypt.compare(refreshToken, user.refreshTokenHash))) throw new AuthenticationError("Invalid refresh token");
    const tokens = sign({ id: user.id, email: user.email, role: user.role });
    user.refreshTokenHash = await bcrypt.hash(tokens.refreshToken, 12); await user.save();
    return { user, ...tokens };
  },
  async logout(userId: string) { await User.findByIdAndUpdate(userId, { $unset: { refreshTokenHash: "" } }); }
};
