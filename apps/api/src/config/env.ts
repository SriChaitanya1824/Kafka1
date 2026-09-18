import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();
const schema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(4000),
  MONGO_URI: z.string().default("mongodb://localhost:27017/notification_platform"),
  REDIS_URL: z.string().default("redis://localhost:6379"),
  JWT_SECRET: z.string().default("dev-access-secret-change-me"),
  JWT_REFRESH_SECRET: z.string().default("dev-refresh-secret-change-me"),
  FRONTEND_URL: z.string().default("http://localhost:5173"),
  EMAIL_HOST: z.string().optional(),
  EMAIL_PORT: z.coerce.number().default(587),
  EMAIL_USER: z.string().optional(),
  EMAIL_PASSWORD: z.string().optional(),
  EMAIL_FROM: z.string().default("notifications@example.com")
});
export const env = schema.parse(process.env);
