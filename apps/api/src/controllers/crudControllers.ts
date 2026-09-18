import { z } from "zod";
import { paginationSchema, templateSchema, workflowSchema } from "@notification/shared";
import { templateService } from "../services/templateService.js";
import { workflowService } from "../services/workflowService.js";
import { created, ok } from "../utils/responses.js";
export const templateController = {
  create: async (req, res) => created(res, await templateService.create({ ...templateSchema.parse(req.body), createdBy: req.user!.id })),
  list: async (req, res) => { const p = paginationSchema.parse(req.query); const r = await templateService.list({}, p.page, p.limit); ok(res, { data: r.items, pagination: r.pagination }); },
  get: async (req, res) => ok(res, await templateService.get(req.params.id)),
  update: async (req, res) => ok(res, await templateService.update(req.params.id, templateSchema.partial().parse(req.body))),
  remove: async (req, res) => ok(res, await templateService.remove(req.params.id)),
  preview: async (req, res) => ok(res, templateService.preview(z.object({ subject: z.string().optional(), content: z.string(), variables: z.array(z.string()).optional(), data: z.record(z.unknown()) }).parse(req.body), req.body.data))
} satisfies Record<string, import("express").RequestHandler>;
export const workflowController = {
  create: async (req, res) => created(res, await workflowService.create({ ...workflowSchema.parse(req.body), createdBy: req.user!.id })),
  list: async (req, res) => { const p = paginationSchema.parse(req.query); const r = await workflowService.list({}, p.page, p.limit); ok(res, { data: r.items, pagination: r.pagination }); },
  get: async (req, res) => ok(res, await workflowService.get(req.params.id)),
  update: async (req, res) => ok(res, await workflowService.update(req.params.id, workflowSchema.partial().parse(req.body))),
  remove: async (req, res) => ok(res, await workflowService.remove(req.params.id))
} satisfies Record<string, import("express").RequestHandler>;
