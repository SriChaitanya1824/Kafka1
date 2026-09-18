# Database

MongoDB collections: users, templates, workflows, notifications, deliveryattempts, preferences, inappnotifications, providerconfigs, idempotencykeys.

Indexes include `users.email`, `notifications.status`, `notifications.createdAt`, `notifications.recipient.userId`, `notifications.channel`, `notifications.workflowId`, `deliveryAttempts.notificationId`, `templates.createdBy`, and `workflows.createdBy`.

Provider configuration is stored without returning secret values to the frontend; real provider credentials are environment variables.
