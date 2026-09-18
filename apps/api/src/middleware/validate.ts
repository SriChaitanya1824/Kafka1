import { AnyZodObject } from "zod";
import { asyncHandler } from "./asyncHandler.js";
export const validate = (schema: AnyZodObject) => asyncHandler(async (req, _res, next) => { req.body = schema.parse(req.body); next(); });
