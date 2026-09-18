import { workflows } from "../repositories/index.js";
import { NotFoundError } from "../utils/errors.js";
export const workflowService = {
  create: (data: object) => workflows.create(data),
  list: (filter: object, page: number, limit: number) => workflows.paginate(filter, page, limit),
  async get(id: string) { const item = await workflows.findById(id); if (!item) throw new NotFoundError("Workflow not found"); return item; },
  async update(id: string, data: object) { const item = await workflows.updateById(id, data); if (!item) throw new NotFoundError("Workflow not found"); return item; },
  async remove(id: string) { const item = await workflows.deleteById(id); if (!item) throw new NotFoundError("Workflow not found"); return item; }
};
