# Architecture

Next.js Checkout UI -> API Gateway -> payment-api -> PostgreSQL

Notes:
- payment-api runs on Kubernetes in the `production` namespace.
- payment-api reads `DATABASE_URL` from Kubernetes Secret `payment-db-secret`.
- PostgreSQL metrics are normal during this incident.
