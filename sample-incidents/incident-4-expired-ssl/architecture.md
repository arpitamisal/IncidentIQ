# Architecture

Users -> HTTPS Ingress -> API Gateway -> Backend Services

Notes:
- Backend services are healthy.
- Failure occurs before requests reach application services.
