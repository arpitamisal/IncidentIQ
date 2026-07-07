# Incident 1: Payment API Missing Database Secret

## Expected Root Cause
The `payment-api` deployment is failing because `DATABASE_URL` is empty. The deployment expects the value from Kubernetes Secret `payment-db-secret` key `url_prod`, but the secret/key is missing or incorrect.

## Expected Severity
Critical

## What IncidentIQ should show
- Pods enter `CrashLoopBackOff`
- HTTP 503 spike starts after deployment
- Database itself looks healthy
- Root cause is Kubernetes secret configuration, not database outage
- Recommended fix: rollback, verify secret, recreate/update secret, redeploy
