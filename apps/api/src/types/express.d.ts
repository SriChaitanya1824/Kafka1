import { Role } from "@notification/shared";
declare global { namespace Express { interface Request { user?: { id: string; role: Role; email: string }; requestId?: string } } }
