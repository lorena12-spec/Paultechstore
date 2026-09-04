export async function sendEmail(to: string, subject: string, text: string, html?: string) {
  if (!process.env.RESEND_API_KEY || !process.env.AUTH_EMAIL_FROM) return false;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const body: Record<string, unknown> = {
      from: process.env.AUTH_EMAIL_FROM,
      to: [to],
      subject,
      text
    };
    if (html) body.html = html;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal
    });
    if (!response.ok) console.error(`Email delivery failed with status ${response.status}.`);
    return response.ok;
  } catch {
    console.error("Email delivery failed.");
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

export const sendOrderEmail = sendEmail;