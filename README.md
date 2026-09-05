# PaulTech Store

Full-stack e-commerce starter for PaulTech Store, focused on iPhones, iPads, Samsung and Google Pixel.

## Stack
- Next.js App Router + TypeScript
- Prisma ORM
- PostgreSQL via Prisma
- JWT session cookie using `jose`
- bcrypt password hashing
- Zod validation
- Tailwind CSS

## Run locally
1. Install Node.js 20+.
2. Set `DATABASE_URL` to a PostgreSQL database in `.env`.
3. Run `npm install`.
4. Run `npx prisma generate`.
5. Run `npm run db:push`.
6. Run `npm run db:seed`.
7. Run `npm run dev`.
8. Open http://localhost:3000.

Seed creates a demo admin account from ADMIN_EMAIL / ADMIN_PASSWORD.

## Real password-reset email setup

Password reset uses the existing custom JWT authentication and Prisma user database. Resend sends the reset email from the server; no reset token or email secret is exposed to the browser.

Configure these environment variables in `.env` locally and in the deployment provider's server-side environment/secrets settings:

- `DATABASE_URL`: Prisma database connection string. Use a durable PostgreSQL database in production.
- `AUTH_SECRET`: random secret of at least 32 characters. Never use the example value in production.
- `NEXT_PUBLIC_SITE_URL`: public HTTPS URL of the deployed store, used to build reset links.
- `RESEND_API_KEY`: Resend API key. Keep this server-only and never prefix it with `NEXT_PUBLIC_`.
- `AUTH_EMAIL_FROM`: verified Resend sender, for example `PaulTech Store <support@your-verified-domain.com>`.

In Resend, verify the sending domain (recommended) or sender identity used by `AUTH_EMAIL_FROM`. Without a valid API key and verified sender, the application does not generate or expose a fallback reset link; it returns the same generic response for privacy.

The project currently has no external authentication provider with email-verification support, so registration email verification is not enabled. Existing accounts remain compatible, and all new passwords must contain at least 8 characters, including uppercase, lowercase, and a number.

## Production notes
Use a managed PostgreSQL database, HTTPS, a strong AUTH_SECRET, Cloudinary image storage, backups, monitoring and a reviewed payment/webhook implementation before taking live payments. Netlify hosts the full-stack Next.js application; never commit `.env`.
