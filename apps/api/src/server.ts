import http from "http";
import { app } from "./app.js";
import { connectDb, closeDb } from "./config/db.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { closeQueues } from "./queues/notificationQueues.js";
import { redis } from "./config/redis.js";
await connectDb();
const server = http.createServer(app).listen(env.PORT, () => logger.info({ event: "api.started", port: env.PORT }));
async function shutdown() {
  logger.info({ event: "shutdown.started" });
  server.close(async () => { await closeQueues(); await redis.quit(); await closeDb(); process.exit(0); });
}
process.on("SIGINT", shutdown); process.on("SIGTERM", shutdown);
