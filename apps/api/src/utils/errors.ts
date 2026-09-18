export class AppError extends Error { constructor(public code: string, message: string, public status = 500) { super(message); } }
export class ValidationError extends AppError { constructor(message = "Invalid request") { super("VALIDATION_ERROR", message, 400); } }
export class AuthenticationError extends AppError { constructor(message = "Authentication required") { super("AUTHENTICATION_ERROR", message, 401); } }
export class AuthorizationError extends AppError { constructor(message = "Forbidden") { super("AUTHORIZATION_ERROR", message, 403); } }
export class NotFoundError extends AppError { constructor(message = "Resource not found") { super("NOT_FOUND", message, 404); } }
export class ConflictError extends AppError { constructor(message = "Conflict") { super("CONFLICT", message, 409); } }
export class ProviderError extends AppError { constructor(message = "Provider failed") { super("PROVIDER_ERROR", message, 502); } }
