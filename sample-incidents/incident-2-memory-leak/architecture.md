# Architecture

User Feed -> API Gateway -> recommendation-service -> Redis -> PostgreSQL

Notes:
- recommendation-service keeps a local in-memory feature cache.
- Redis and PostgreSQL are healthy.
- Failures started after deployment v4.3.0.
