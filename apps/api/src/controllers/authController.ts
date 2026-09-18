import { z } from "zod";
import { authService } from "../services/authService.js";
import { ok, created } from "../utils/responses.js";
export const authController = {
  register: async (req, res) => created(res, await authService.register(z.object({ name: z.string(), email: z.string().email(), password: z.string().min(8), role: z.enum(["USER","ADMIN"]).optional() }).parse(req.body))),
  login: async (req, res) => { const body = z.object({ email: z.string().email(), password: z.string() }).parse(req.body); ok(res, await authService.login(body.email, body.password)); },
  me: async (req, res) => ok(res, req.user),
  refresh: async (req, res) => ok(res, await authService.refresh(z.object({ refreshToken: z.string() }).parse(req.body).refreshToken)),
  logout: async (req, res) => { await authService.logout(req.user!.id); ok(res, null, "Logged out"); }
} satisfies Record<string, import("express").RequestHandler>;
