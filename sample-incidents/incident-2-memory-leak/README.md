# Incident 2: Memory Leak / OOMKilled

## Expected Root Cause
The `recommendation-service` has a memory leak after version `v4.3.0`. Memory grows steadily until pods exceed the 1Gi limit and are killed with exit code 137.

## Expected Severity
High

## What IncidentIQ should show
- Memory usage increases steadily after deployment
- Pods are OOMKilled
- Error rate rises after restarts
- Root cause is application memory leak or unbounded cache
- Recommended fix: rollback, inspect heap/profile memory, reduce cache size, increase memory only temporarily
