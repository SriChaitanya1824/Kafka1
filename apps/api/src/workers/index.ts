import { connectDb, closeDb } from "../config/db.js";
import { createWorker } from "./notificationWorker.js";
import { logger } from "../config/logger.js";
await connectDb();
const workers = ["EMAIL", "SMS", "PUSH", "IN_APP"].map((c) => createWorker(c as never));
logger.info({ event: "workers.started" });
async function shutdown() { await Promise.all(workers.map((w) => w.close())); await closeDb(); process.exit(0); }
process.on("SIGINT", shutdown); process.on("SIGTERM", shutdown);
