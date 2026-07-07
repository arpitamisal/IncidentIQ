# Incident 4: Expired SSL Certificate

## Expected Root Cause
The TLS certificate for `api.acme-shop.com` expired, causing browser and client TLS validation failures.

## Expected Severity
Medium or High

## What IncidentIQ should show
- Users see certificate/date invalid errors
- Ingress logs show TLS handshake failures
- Backend services are healthy
- Root cause is expired certificate, not application failure
- Recommended fix: renew cert and restart/reload ingress
