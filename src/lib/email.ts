import { naira } from "@/lib/utils";

function sender() {
  const configuredSender = process.env.AUTH_EMAIL_FROM?.trim();
  if (!configuredSender) return "PaulTech Store <orders@paultechstores.com.ng>";
  if (!configuredSender.includes("@")) return `PaulTech Store <support@${configuredSender}>`;
  return configuredSender;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] || character);
}

export async function sendEmail(to: string, subject: string, text: string, html?: string) {
  if (!process.env.RESEND_API_KEY || !to) return false;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const body: Record<string, unknown> = {
      from: sender(),
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

type OrderEmail = {
  id: string;
  total: number;
  paymentMethod: string;
  shippingName: string;
  shippingPhone: string;
  shippingEmail: string;
  address: string;
  city: string;
  state: string;
  items: Array<{ quantity: number; price: number; product: { name: string } }>;
};

function orderDetails(order: OrderEmail) {
  const orderNumber = order.id.slice(-8).toUpperCase();
  const itemsText = order.items.map(item => `- ${item.product.name} x ${item.quantity}: ${naira(item.price * item.quantity)}`).join("\n");
  const itemsHtml = order.items.map(item => `<li>${escapeHtml(item.product.name)} x ${item.quantity}: <strong>${naira(item.price * item.quantity)}</strong></li>`).join("");
  const delivery = `${order.address}, ${order.city}, ${order.state}`;
  return {
    orderNumber,
    text: `Order #${orderNumber}\n\nCustomer: ${order.shippingName}\nEmail: ${order.shippingEmail}\nPhone: ${order.shippingPhone}\nPayment method: ${order.paymentMethod}\nDelivery: ${delivery}\n\nProducts:\n${itemsText}\n\nTotal: ${naira(order.total)}`,
    html: `<h2>Order #${orderNumber}</h2><p><strong>Customer:</strong> ${escapeHtml(order.shippingName)}<br><strong>Email:</strong> ${escapeHtml(order.shippingEmail)}<br><strong>Phone:</strong> ${escapeHtml(order.shippingPhone)}<br><strong>Payment method:</strong> ${escapeHtml(order.paymentMethod)}<br><strong>Delivery:</strong> ${escapeHtml(delivery)}</p><h3>Products</h3><ul>${itemsHtml}</ul><p><strong>Total: ${naira(order.total)}</strong></p>`
  };
}

export async function sendOrderNotifications(order: OrderEmail) {
  const details = orderDetails(order);
  const messages = [
    sendEmail(order.shippingEmail, `PaulTech Store order confirmation #${details.orderNumber}`, `Hi ${order.shippingName},\n\nThank you for your order.\n\n${details.text}\n\nWe will contact you with further updates.`, `<p>Hi ${escapeHtml(order.shippingName)},</p><p>Thank you for your order.</p>${details.html}<p>We will contact you with further updates.</p>`)
  ];
  if (process.env.ADMIN_EMAIL) messages.push(sendEmail(process.env.ADMIN_EMAIL, `New PaulTech Store order #${details.orderNumber}`, details.text, details.html));
  const results = await Promise.allSettled(messages);
  return results.every(result => result.status === "fulfilled" && result.value);
}