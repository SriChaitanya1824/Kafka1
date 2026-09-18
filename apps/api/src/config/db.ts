import mongoose from "mongoose";
import { env } from "./env.js";
import { logger } from "./logger.js";
export async function connectDb(uri = env.MONGO_URI) { mongoose.set("strictQuery", true); await mongoose.connect(uri); logger.info({ event: "db.connected" }); }
export async function closeDb() { await mongoose.connection.close(); }
