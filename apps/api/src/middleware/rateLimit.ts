import rateLimit from "express-rate-limit";
export const apiLimiter = rateLimit({ windowMs: 60_000, max: 100, standardHeaders: true, legacyHeaders: false, keyGenerator: (req) => req.user?.id ?? req.ip ?? "anonymous", message: { success: false, error: { code: "RATE_LIMITED", message: "Too Many Requests" } } });
