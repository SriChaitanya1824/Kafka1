# Queues

```mermaid
flowchart LR
API --> EmailQ[emailQueue]
API --> SmsQ[smsQueue]
API --> PushQ[pushQueue]
API --> InAppQ[inAppQueue]
EmailQ --> EW[EmailWorker]
SmsQ --> SW[SmsWorker]
PushQ --> PW[PushWorker]
InAppQ --> IW[InAppWorker]
```

BullMQ jobs use stable notification IDs, delayed scheduling, three attempts, and exponential backoff. Workers mark notifications `PROCESSING`, create `DeliveryAttempt` records, call a provider adapter, then update final status.
