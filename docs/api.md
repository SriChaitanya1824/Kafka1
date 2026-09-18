# API

Core endpoints:

- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/refresh`, `POST /api/auth/logout`
- `POST /api/templates`, `GET /api/templates`, `GET /api/templates/:id`, `PUT /api/templates/:id`, `DELETE /api/templates/:id`
- `POST /api/workflows`, `GET /api/workflows`, `GET /api/workflows/:id`, `PUT /api/workflows/:id`, `DELETE /api/workflows/:id`
- `POST /api/notifications/send`, `POST /api/notifications/schedule`, `GET /api/notifications`, `GET /api/notifications/:id`, `GET /api/notifications/:id/attempts`, `POST /api/notifications/:id/retry`, `POST /api/notifications/:id/cancel`
- `GET /api/preferences`, `PUT /api/preferences`
- `GET /api/in-app-notifications`, `GET /api/in-app-notifications/unread-count`, `PATCH /api/in-app-notifications/:id/read`, `POST /api/in-app-notifications/read-all`
- `GET /api/analytics/overview`, `GET /api/analytics/channels`, `GET /api/analytics/daily`, `GET /api/analytics/failures`
