# Email Configuration for Password Reset

The password reset feature requires email sending capability. Choose one of the options below and configure the environment variables.

## ⚠️ IMPORTANT: Database Migration Required

**Before using password reset, you MUST run the database migration:**

```bash
npm run db:push
```

This creates the `password_reset_tokens` table. **Without this step, password reset will fail** with an error message asking users to contact the administrator.

## Option 1: Resend (Recommended for Production)

[Resend](https://resend.com) is a modern email API designed for developers.

### Setup Steps:

1. Sign up at https://resend.com
2. Verify your domain (or use their test domain for development)
3. Create an API key in the dashboard
4. The `resend` package is listed as an optional dependency. Install it:
   ```bash
   npm install
   ```
   Or explicitly:
   ```bash
   npm install resend
   ```
5. Add to `.env.local`:
   ```env
   RESEND_API_KEY=re_xxxxxxxxxxxx
   EMAIL_FROM="1000 QBM+ <noreply@yourdomain.com>"
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```

### Pricing:
- Free tier: 100 emails/day, 3,000 emails/month
- Paid: $20/month for 50,000 emails

---

## Option 2: SMTP (Gmail, Outlook, Custom)

Use SMTP with any email provider that supports it.

### Gmail Setup:

1. Enable 2-factor authentication on your Google account
2. Generate an App Password:
   - Go to https://myaccount.google.com/security
   - Select "App passwords" (under 2-Step Verification)
   - Generate a password for "Mail"
3. The `nodemailer` package is listed as an optional dependency. Install it:
   ```bash
   npm install
   ```
   Or explicitly:
   ```bash
   npm install nodemailer
   ```
4. Add to `.env.local`:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   EMAIL_FROM="1000 QBM+ <your-email@gmail.com>"
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

### Other SMTP Providers:

**Outlook/Office 365:**
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=your-password
```

**Custom SMTP Server:**
```env
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587  # or 465 for SSL
SMTP_USER=noreply@yourdomain.com
SMTP_PASSWORD=your-password
```

---

## Option 3: SendGrid

[SendGrid](https://sendgrid.com) is a reliable email delivery platform by Twilio.

### Setup Steps:

1. Sign up at https://sendgrid.com
2. Verify your sender identity (email or domain)
3. Create an API key in Settings > API Keys
4. The `@sendgrid/mail` package is listed as an optional dependency. Install it:
   ```bash
   npm install
   ```
   Or explicitly:
   ```bash
   npm install @sendgrid/mail
   ```
5. Add to `.env.local`:
   ```env
   SENDGRID_API_KEY=SG.xxxxxxxxxxxx
   EMAIL_FROM="noreply@yourdomain.com"
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```

### Pricing:
- Free tier: 100 emails/day
- Paid: From $19.95/month for 50,000 emails

---

## Package Installation

All email provider packages are listed as **optional dependencies** in `package.json`. This means:

- ✅ Next.js won't complain about missing packages during build
- ✅ You only need to install the provider(s) you plan to use
- ✅ Running `npm install` installs them automatically (if available)

### Installing a Specific Provider

**Resend:**
```bash
npm install resend
```

**SMTP (nodemailer):**
```bash
npm install nodemailer
```

**SendGrid:**
```bash
npm install @sendgrid/mail
```

### What Happens Without Installation?

If you configure an email provider (e.g., set `RESEND_API_KEY`) but haven't installed the package, the system will:
1. Attempt to send the email
2. Catch the MODULE_NOT_FOUND error
3. Log a clear message: "Resend package not installed. Run: npm install resend"
4. Return failure gracefully without crashing

---

## Environment Variables Reference

Required for all options:
- `EMAIL_FROM` - The "From" address for emails (e.g., "1000 QBM+ <noreply@yourdomain.com>")
- `NEXT_PUBLIC_APP_URL` - Your app's base URL (e.g., "https://yourdomain.com" or "http://localhost:3000" for local dev)

Choose ONE of these provider configurations:

**Resend:**
- `RESEND_API_KEY` - Your Resend API key

**SMTP:**
- `SMTP_HOST` - SMTP server hostname
- `SMTP_PORT` - SMTP port (usually 587 or 465)
- `SMTP_USER` - SMTP username/email
- `SMTP_PASSWORD` - SMTP password

**SendGrid:**
- `SENDGRID_API_KEY` - Your SendGrid API key

---

## Testing

After configuring your email provider:

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to http://localhost:3000/login

3. Click "Mot de passe oublié ?" (Forgot password?)

4. Enter a registered email address

5. Check the terminal for email sending logs

6. Check your email inbox (and spam folder) for the reset link

---

## Production Checklist

Before deploying:

- [ ] Email provider configured with production credentials
- [ ] `NEXT_PUBLIC_APP_URL` set to your production domain
- [ ] Email sending tested in production environment
- [ ] Sender domain/email verified with your provider
- [ ] SPF and DKIM records configured (for better deliverability)
- [ ] Check spam score of your emails
- [ ] Set up email rate limiting if needed

---

## Troubleshooting

### Emails not sending?

1. Check terminal logs for error messages
2. Verify all environment variables are set correctly
3. For Gmail: Ensure App Password is used (not regular password)
4. For SMTP: Try port 465 if 587 doesn't work
5. Check your email provider's dashboard for sending limits

### Emails going to spam?

1. Verify your sender domain with the email provider
2. Set up SPF, DKIM, and DMARC records for your domain
3. Use a dedicated sending domain (not Gmail/Outlook)
4. Warm up your sender reputation gradually

### Token expired errors?

- Tokens expire after 1 hour
- Request a new password reset link
- Check server time is synchronized

### "La fonctionnalité de réinitialisation n'est pas configurée" error?

This means the database migration hasn't been run. Fix it:

1. Run the migration:
   ```bash
   npm run db:push
   ```

2. Restart your development server:
   ```bash
   npm run dev
   ```

3. Verify the table exists in your database:
   ```sql
   SELECT * FROM password_reset_tokens LIMIT 1;
   ```

If the error persists:
- Check that `DATABASE_URL` or `DATABASE_URL_UNPOOLED` is set correctly
- Verify database connection is working
- Check Drizzle config in `drizzle.config.ts`

---

## Database Migration

The password reset feature requires a new database table. Apply the migration:

```bash
npm run db:push
```

This will create the `password_reset_tokens` table with the following schema:

```sql
CREATE TABLE password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```
