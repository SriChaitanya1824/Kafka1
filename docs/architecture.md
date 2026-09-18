# Architecture

```mermaid
flowchart TD
Client[React Dashboard] --> API[Express API]
API --> Mongo[(MongoDB)]
API --> Redis[(Redis)]
API --> Bull[BullMQ Queues]
Bull --> Email[Email Worker]
Bull --> Sms[SMS Worker]
Bull --> Push[Push Worker]
Bull --> InApp[In-App Worker]
Email --> Providers[Provider Adapters]
Sms --> Providers
Push --> Providers
InApp --> Providers
Providers --> Mongo
```

Controllers validate transport concerns, services perform business decisions, repositories and Mongoose models handle persistence, queues decouple slow providers from API requests, and workers write delivery attempts plus notification state transitions.
