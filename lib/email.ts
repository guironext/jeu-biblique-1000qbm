/**
 * Email sending utility for 1000 QBM+
 *
 * SETUP REQUIRED:
 * To enable email sending, you must configure one of the following:
 *
 * Option 1: SMTP (works with Gmail, Outlook, custom SMTP servers)
 * Add these environment variables to your .env.local:
 *   SMTP_HOST=smtp.gmail.com
 *   SMTP_PORT=587
 *   SMTP_USER=your-email@gmail.com
 *   SMTP_PASSWORD=your-app-password
 *   EMAIL_FROM="1000 QBM+ <noreply@yourapp.com>"
 *
 * Option 2: Resend (recommended for production)
 * 1. Sign up at https://resend.com
 * 2. Add to .env.local:
 *   RESEND_API_KEY=re_xxxxxxxxxxxx
 *   EMAIL_FROM="1000 QBM+ <noreply@yourapp.com>"
 * 3. Install: npm install resend
 *
 * Option 3: SendGrid
 * 1. Sign up at https://sendgrid.com
 * 2. Add to .env.local:
 *   SENDGRID_API_KEY=SG.xxxxxxxxxxxx
 *   EMAIL_FROM="noreply@yourapp.com"
 * 3. Install: npm install @sendgrid/mail
 */

type EmailOptions = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

/**
 * Send an email using the configured provider.
 * Returns true on success, false on failure.
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const emailFrom = process.env.EMAIL_FROM;

  if (!emailFrom) {
    console.error(
      "EMAIL_FROM not configured. See lib/email.ts for setup instructions.",
    );
    return false;
  }

  // Try Resend first
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      // Dynamic import to avoid requiring it at build time
      const { Resend } = await import("resend");
      const resend = new Resend(resendKey);

      await resend.emails.send({
        from: emailFrom,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });

      console.log(`Email sent to ${options.to} via Resend`);
      return true;
    } catch (error) {
      console.error("Resend email error:", error);
      return false;
    }
  }

  // Try SendGrid
  const sendgridKey = process.env.SENDGRID_API_KEY;
  if (sendgridKey) {
    try {
      const sgMail = await import("@sendgrid/mail");
      sgMail.default.setApiKey(sendgridKey);

      await sgMail.default.send({
        from: emailFrom,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });

      console.log(`Email sent to ${options.to} via SendGrid`);
      return true;
    } catch (error) {
      console.error("SendGrid email error:", error);
      return false;
    }
  }

  // Try SMTP
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPassword = process.env.SMTP_PASSWORD;

  if (smtpHost && smtpPort && smtpUser && smtpPassword) {
    try {
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.default.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort),
        secure: parseInt(smtpPort) === 465,
        auth: {
          user: smtpUser,
          pass: smtpPassword,
        },
      });

      await transporter.sendMail({
        from: emailFrom,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });

      console.log(`Email sent to ${options.to} via SMTP`);
      return true;
    } catch (error) {
      console.error("SMTP email error:", error);
      return false;
    }
  }

  console.error(
    "No email provider configured. See lib/email.ts for setup instructions.",
  );
  return false;
}

/**
 * Generate the HTML for a password reset email.
 */
export function generatePasswordResetEmail(resetUrl: string): {
  html: string;
  text: string;
} {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Réinitialiser votre mot de passe</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f4;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background-color: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #1c1917;">1000 QBM+</h1>
        <p style="margin: 8px 0 0; font-size: 14px; color: #78716c; text-transform: uppercase; letter-spacing: 0.05em;">Jeu biblique</p>
      </div>
      
      <h2 style="margin: 0 0 16px; font-size: 20px; font-weight: 600; color: #1c1917;">Réinitialiser votre mot de passe</h2>
      
      <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.5; color: #57534e;">
        Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe.
      </p>
      
      <div style="text-align: center; margin: 32px 0;">
        <a href="${resetUrl}" style="display: inline-block; background-color: #65a30d; color: #ffffff; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-size: 14px; font-weight: 600;">
          Réinitialiser mon mot de passe
        </a>
      </div>
      
      <p style="margin: 24px 0 0; font-size: 14px; line-height: 1.5; color: #78716c;">
        Ce lien est valable pendant 1 heure. Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email en toute sécurité.
      </p>
      
      <hr style="margin: 32px 0; border: none; border-top: 1px solid #e7e5e4;">
      
      <p style="margin: 0; font-size: 12px; color: #a8a29e;">
        Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br>
        <a href="${resetUrl}" style="color: #65a30d; word-break: break-all;">${resetUrl}</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
1000 QBM+ - Réinitialiser votre mot de passe

Vous avez demandé à réinitialiser votre mot de passe.

Pour créer un nouveau mot de passe, visitez ce lien (valable pendant 1 heure) :
${resetUrl}

Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email en toute sécurité.
  `;

  return { html, text };
}
