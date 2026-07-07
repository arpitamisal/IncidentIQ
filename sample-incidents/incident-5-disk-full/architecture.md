# Architecture

Checkout API -> PostgreSQL primary -> Persistent Volume

Notes:
- Application errors began after PostgreSQL write failures.
- Reads partially work, writes fail.
