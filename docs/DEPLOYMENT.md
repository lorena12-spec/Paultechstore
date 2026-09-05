# Deployment checklist

- Set `DATABASE_URL` to a managed PostgreSQL database. Netlify hosts the application, but the database must be external and durable.
- Set `NEXT_PUBLIC_SITE_URL` to the deployed Netlify HTTPS URL or custom domain.
- Set a strong AUTH_SECRET.
- Set HTTPS and secure cookies.
- Configure Paystack keys only on the server.
- Add a verified Paystack webhook before marking orders PAID.
- Configure object storage/CDN for product images.
- Enable database backups.
- Add rate limiting and audit logging.
- Test inventory concurrency and payment failure/retry flows.
