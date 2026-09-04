# Deployment checklist

- Move DATABASE_URL from SQLite to PostgreSQL.
- Set a strong AUTH_SECRET.
- Set HTTPS and secure cookies.
- Configure Paystack keys only on the server.
- Add a verified Paystack webhook before marking orders PAID.
- Configure object storage/CDN for product images.
- Enable database backups.
- Add rate limiting and audit logging.
- Test inventory concurrency and payment failure/retry flows.
