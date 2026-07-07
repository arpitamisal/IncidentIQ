# Incident 6: Redis Configuration Drift

## Expected Root Cause
The app is still configured to use the old Redis endpoint after a cache migration. Logs first appear to blame the database, but architecture and Slack notes show Redis was migrated.

## Expected Severity
High

## What IncidentIQ should show
- Cache connection failures to old Redis endpoint
- Database load increases because cache is unavailable
- Slack mentions Redis migration
- ConfigMap still points to `redis-old.production.svc.cluster.local`
- Root cause is stale Redis config, not primary database failure
