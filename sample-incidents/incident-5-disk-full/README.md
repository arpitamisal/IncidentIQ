# Incident 5: PostgreSQL Persistent Volume Full

## Expected Root Cause
PostgreSQL cannot write because the persistent volume is 100% full. WAL growth and missing log cleanup filled the volume.

## Expected Severity
Critical

## What IncidentIQ should show
- Database write failures
- `No space left on device`
- Disk at 100%
- App errors are downstream symptoms
- Recommended fix: expand PVC, clean logs/WAL carefully, enable retention/alerts
