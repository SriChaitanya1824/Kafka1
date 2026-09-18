import request from "supertest";
import { afterAll, beforeAll, expect, it, jest } from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";
import { connectDb, closeDb } from "../src/config/db.js";
import { app } from "../src/app.js";
import { redis } from "../src/config/redis.js";
jest.mock("../src/queues/notificationQueues.js", () => ({ enqueueNotification: jest.fn(), closeQueues: jest.fn() }));
let mongo: MongoMemoryServer; let token = ""; let templateId = ""; let workflowId = ""; let notificationId = "";
beforeAll(async () => { mongo = await MongoMemoryServer.create(); await connectDb(mongo.getUri()); });
afterAll(async () => { await closeDb(); await mongo.stop(); redis.disconnect(); });
it("registers, logs in, refreshes and returns me", async () => {
  const reg = await request(app).post("/api/auth/register").send({ name: "A", email: "a@example.com", password: "Password123" }).expect(201);
  expect(reg.body.data.user.passwordHash).toBeUndefined();
  const login = await request(app).post("/api/auth/login").send({ email: "a@example.com", password: "Password123" }).expect(200);
  token = login.body.data.accessToken;
  await request(app).get("/api/auth/me").set("Authorization", `Bearer ${token}`).expect(200);
  await request(app).post("/api/auth/refresh").send({ refreshToken: login.body.data.refreshToken }).expect(200);
});
it("creates templates and previews variables", async () => {
  const res = await request(app).post("/api/templates").set("Authorization", `Bearer ${token}`).send({ name: "Order", channel: "EMAIL", subject: "Hi {{name}}", content: "Order {{orderId}}", variables: ["name","orderId"], active: true }).expect(201);
  templateId = res.body.data._id;
  await request(app).post("/api/templates/preview").set("Authorization", `Bearer ${token}`).send({ subject: "Hi {{name}}", content: "Order {{orderId}}", variables: ["name","orderId"], data: { name: "Ada", orderId: "1" } }).expect(200);
  await request(app).get("/api/templates").set("Authorization", `Bearer ${token}`).expect(200);
});
it("creates workflows", async () => {
  const res = await request(app).post("/api/workflows").set("Authorization", `Bearer ${token}`).send({ name: "Order Flow", steps: [{ order: 1, channel: "EMAIL", templateId, delay: 0, enabled: true }], active: true }).expect(201);
  workflowId = res.body.data._id;
  await request(app).get(`/api/workflows/${workflowId}`).set("Authorization", `Bearer ${token}`).expect(200);
});
it("queues notifications idempotently and supports history", async () => {
  const body = { workflowId, recipient: { userId: "u1", email: "u@example.com" }, data: { name: "Ada", orderId: "A1" } };
  const first = await request(app).post("/api/notifications/send").set("Authorization", `Bearer ${token}`).set("Idempotency-Key", "abc").send(body).expect(201);
  notificationId = first.body.data.notificationId;
  const second = await request(app).post("/api/notifications/send").set("Authorization", `Bearer ${token}`).set("Idempotency-Key", "abc").send(body).expect(201);
  expect(second.body.data.notificationId).toBe(notificationId);
  await request(app).get("/api/notifications?status=QUEUED").set("Authorization", `Bearer ${token}`).expect(200);
  await request(app).get(`/api/notifications/${notificationId}`).set("Authorization", `Bearer ${token}`).expect(200);
});
it("handles scheduling cancellation preferences analytics health and docs", async () => {
  await request(app).put("/api/preferences").set("Authorization", `Bearer ${token}`).send({ smsEnabled: false }).expect(200);
  await request(app).get("/api/preferences").set("Authorization", `Bearer ${token}`).expect(200);
  await request(app).post("/api/notifications/schedule").set("Authorization", `Bearer ${token}`).send({ workflowId, recipient: { email: "u@example.com" }, data: { name: "Ada", orderId: "A2" }, scheduledAt: new Date(Date.now()+60000).toISOString() }).expect(201);
  await request(app).post(`/api/notifications/${notificationId}/cancel`).set("Authorization", `Bearer ${token}`).expect(200);
  await request(app).get("/api/analytics/overview").set("Authorization", `Bearer ${token}`).expect(200);
  await request(app).get("/health").expect(200);
  await request(app).get("/metrics").expect(200);
  await request(app).get("/api/docs/").expect(200);
});
