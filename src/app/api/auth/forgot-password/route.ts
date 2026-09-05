import { createHash, randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validation";
import { sendEmail } from "@/lib/email";

const responseMessage = "If an account matches that email, password recovery instructions are ready.";

function getSiteUrl(req: Request) {
  const requestOrigin = new URL(req.url).origin;
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!configuredUrl) return requestOrigin;

  try {
    const parsedUrl = new URL(configuredUrl);
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") return requestOrigin;
    if (process.env.NODE_ENV === "production" && ["localhost", "127.0.0.1", "0.0.0.0"].includes(parsedUrl.hostname)) return requestOrigin;
    return parsedUrl.origin;
  } catch {
    return requestOrigin;
  }
}

export async function POST(req: Request) {
  try {
    const { email } = forgotPasswordSchema.parse(await req.json());
    const user = await db.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) return NextResponse.json({ message: responseMessage });

    const rawToken = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(rawToken).digest("hex");
    await db.passwordResetToken.deleteMany({ where: { userId: user.id } });
    await db.passwordResetToken.create({
      data: { userId: user.id, tokenHash, expiresAt: new Date(Date.now() + 60 * 60 * 1000) }
    });

    const resetUrl = new URL(`/reset-password?token=${encodeURIComponent(rawToken)}`, getSiteUrl(req)).toString();
    const htmlEmail = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 20px; }
            .content { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #1e40af; margin-bottom: 10px; }
            h1 { color: #1f2937; margin: 0 0 10px 0; font-size: 24px; }
            .message { color: #6b7280; margin-bottom: 30px; }
            .button { display: inline-block; background: #1e40af; color: white; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; margin: 20px 0; }
            .button:hover { background: #1e3a8a; }
            .link-text { color: #6b7280; word-break: break-all; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 14px; }
            .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; color: #92400e; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="content">
              <div class="header">
                <div class="logo">PaulTech Store</div>
              </div>
              <h1>Reset Your Password</h1>
              <p class="message">We received a request to reset the password for your account. If you didn't make this request, please ignore this email.</p>
              <p>Click the button below to create a new password. This link will expire in 1 hour.</p>
              <center>
                <a href="${resetUrl}" class="button">Reset Password</a>
              </center>
              <p style="color: #6b7280; margin-top: 20px;">Or copy and paste this link in your browser:</p>
              <p class="link-text">${resetUrl}</p>
              <div class="warning">
                <strong>Security tip:</strong> Never share this link with anyone. PaulTech Store will never ask for your password via email.
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} PaulTech Store. All rights reserved.</p>
                <p>If you have questions, please contact our support team.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const plainTextEmail = `Password Reset Request\n\nHi ${user.name},\n\nWe received a request to reset your password. Click the link below or copy it into your browser:\n\n${resetUrl}\n\nThis link expires in 1 hour.\n\nIf you didn't request this, please ignore this email.\n\n© ${new Date().getFullYear()} PaulTech Store`;

    const emailSent = await sendEmail(user.email, "Reset your PaulTech Store password", plainTextEmail, htmlEmail);
    if (!emailSent) {
      await db.passwordResetToken.delete({ where: { tokenHash } }).catch(() => undefined);
    }

    return NextResponse.json({ message: responseMessage });
  } catch {
    return NextResponse.json({ message: responseMessage });
  }
}
