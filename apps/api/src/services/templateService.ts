import { templates } from "../repositories/index.js";
import { NotFoundError } from "../utils/errors.js";
import { renderTemplate } from "../utils/renderTemplate.js";
export const templateService = {
  create: (data: object) => templates.create(data),
  list: (filter: object, page: number, limit: number) => templates.paginate(filter, page, limit),
  async get(id: string) { const item = await templates.findById(id); if (!item) throw new NotFoundError("Template not found"); return item; },
  async update(id: string, data: object) { const item = await templates.updateById(id, data); if (!item) throw new NotFoundError("Template not found"); return item; },
  async remove(id: string) { const item = await templates.deleteById(id); if (!item) throw new NotFoundError("Template not found"); return item; },
  preview(template: { subject?: string; content: string; variables?: string[] }, data: Record<string, unknown>) { return { subject: renderTemplate(template.subject ?? "", data, template.variables), content: renderTemplate(template.content, data, template.variables) }; }
};
