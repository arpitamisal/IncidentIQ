# Architecture
User -> Next.js Checkout UI -> payment-api service -> PostgreSQL payments-db
payment-api reads DATABASE_URL from Kubernetes Secret payment-db-secret.
