# Architecture

Checkout UI -> order-api -> inventory-db

Notes:
- checkout-ui and order-api are in the same Kubernetes namespace.
- order-api pods are healthy but receive no requests after the policy was applied.
