import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";
import { AuthenticationError, AuthorizationError } from "../utils/errors.js";
import { Role } from "@notification/shared";
export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) throw new AuthenticationError();
  const payload = jwt.verify(token, env.JWT_SECRET) as { sub: string; role: Role; email: string };
  req.user = { id: payload.sub, role: payload.role, email: payload.email };
  next();
}
export const authorize = (...roles: Role[]) => (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user) throw new AuthenticationError();
  if (!roles.includes(req.user.role)) throw new AuthorizationError();
  next();
};
