# IncidentIQ Sample Incidents

This pack contains six realistic sample production incidents for testing and demoing IncidentIQ.

## How to use

Upload all files from one incident folder into IncidentIQ at the same time.

## Expected scenarios

1. `incident-1-payment-db-secret` — Missing Kubernetes Secret causes payment API CrashLoopBackOff.
2. `incident-2-memory-leak` — Memory leak causes OOMKilled pods.
3. `incident-3-network-policy` — NetworkPolicy blocks frontend-to-backend traffic.
4. `incident-4-expired-ssl` — Expired TLS certificate causes browser/API failures.
5. `incident-5-disk-full` — PostgreSQL persistent volume reaches 100%.
6. `incident-6-redis-config-drift` — Stale Redis endpoint causes cache outage and database overload.

These files are intentionally crafted so Gemini can correlate logs, YAML, dashboards, and architecture notes to identify the root cause.
