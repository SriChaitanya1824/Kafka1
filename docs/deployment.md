# Deployment

Copy `.env.example` to `.env`, set production secrets, then run:

```bash
docker compose up --build
```

Services: `mongodb`, `redis`, `api`, `worker`, and `web`. The API exposes `/health`, `/health/db`, `/health/redis`, `/metrics`, and `/api/docs`.
