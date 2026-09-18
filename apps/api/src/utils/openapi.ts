export const openApiSpec = {
  openapi: "3.0.3",
  info: { title: "Open Source Notification Platform API", version: "1.0.0" },
  security: [{ bearerAuth: [] }],
  components: { securitySchemes: { bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" } } },
  paths: {
    "/api/auth/register": { post: { summary: "Register user" } },
    "/api/auth/login": { post: { summary: "Login user" } },
    "/api/auth/me": { get: { summary: "Current user" } },
    "/api/templates": { get: { summary: "List templates" }, post: { summary: "Create template" } },
    "/api/workflows": { get: { summary: "List workflows" }, post: { summary: "Create workflow" } },
    "/api/notifications/send": { post: { summary: "Queue workflow notifications asynchronously" } },
    "/api/notifications/schedule": { post: { summary: "Schedule workflow notifications" } },
    "/api/notifications": { get: { summary: "Notification history with filters" } },
    "/api/preferences": { get: { summary: "Get preferences" }, put: { summary: "Update preferences" } },
    "/api/in-app-notifications": { get: { summary: "List in-app notifications" } },
    "/api/providers": { get: { summary: "List provider configuration without secrets" } },
    "/api/analytics/overview": { get: { summary: "Aggregated delivery metrics" } }
  }
};
