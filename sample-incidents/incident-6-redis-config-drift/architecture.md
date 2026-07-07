# Architecture

Users -> Product API -> Redis Cache -> PostgreSQL

Recent change:
- Redis was migrated from `redis-old.production.svc.cluster.local` to `redis-new.production.svc.cluster.local`.
- Product API should use Redis for catalog reads before falling back to PostgreSQL.
