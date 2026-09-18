import { Response } from "express";
export const ok = (res: Response, data: unknown, message = "Operation successful") => res.json({ success: true, data, message });
export const created = (res: Response, data: unknown, message = "Created") => res.status(201).json({ success: true, data, message });
