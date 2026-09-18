import { ValidationError } from "./errors.js";
export function renderTemplate(input: string, data: Record<string, unknown>, required: string[] = []) {
  const missing = required.filter((key) => data[key] === undefined || data[key] === null);
  if (missing.length) throw new ValidationError(`Missing template variables: ${missing.join(", ")}`);
  return input.replace(/\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g, (_, key) => String(data[key] ?? ""));
}
