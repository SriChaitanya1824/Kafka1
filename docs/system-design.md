# System Design

```mermaid
sequenceDiagram
Client->>API: POST /notifications/send
API->>MongoDB: validate workflow/templates/preferences/idempotency
API->>BullMQ: enqueue per-channel jobs
API-->>Client: 201 QUEUED
BullMQ->>Worker: deliver job
Worker->>Provider: send
Provider-->>Worker: structured result
Worker->>MongoDB: notification + attempt updates
```

Scalability comes from stateless API instances, independent workers per queue, Redis-backed queueing, MongoDB indexes, and pagination. Idempotency keys protect duplicate sends. Rate limiting protects API capacity. Scheduling is implemented with BullMQ delayed jobs and UTC timestamps.
