# Incident 3: Kubernetes NetworkPolicy Blocks Traffic

## Expected Root Cause
A new NetworkPolicy allows frontend pods to talk only to pods labeled `app: order-api-v2`, but the backend pods are labeled `app: order-api`. This blocks traffic and causes 504s.

## Expected Severity
High

## What IncidentIQ should show
- Frontend sees 504 Gateway Timeout
- Backend receives zero requests
- Issue starts after NetworkPolicy change
- Root cause is label mismatch in NetworkPolicy
- Recommended fix: update policy selector or labels
