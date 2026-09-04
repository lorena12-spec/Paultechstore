import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { sendOrderEmail } from "@/lib/email";

const statuses = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Please log in." }, { status: 401 });
  const { id } = await params;
  const order = await db.order.findFirst({ where: { id, userId: session.id }, select: { id: true, total: true, status: true, paymentMethod: true } });
  return order ? NextResponse.json(order) : NextResponse.json({ error: "Order not found." }, { status: 404 });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Please log in." }, { status: 401 });
  const { id } = await params;
  try {
    const { status } = await req.json();
    if (!statuses.includes(status)) return NextResponse.json({ error: "Invalid order status." }, { status: 400 });
    const existing = await db.order.findUnique({ where: { id }, include: { user: true, items: true } });
    if (!existing) return NextResponse.json({ error: "Order not found." }, { status: 404 });
    if (existing.status === status) return NextResponse.json({ ok: true });
    if (session.role !== "ADMIN") {
      if (existing.userId !== session.id || status !== "CANCELLED") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      if (!["PENDING", "PAID", "PROCESSING"].includes(existing.status)) return NextResponse.json({ error: "This order can no longer be cancelled because it has shipped." }, { status: 409 });
    }
    if (status === "CANCELLED" && ["SHIPPED", "DELIVERED", "CANCELLED"].includes(existing.status)) return NextResponse.json({ error: "This order can no longer be cancelled because it has shipped." }, { status: 409 });
    const order = await db.$transaction(async tx => {
      if (status === "CANCELLED" && existing.status !== "PENDING") {
        for (const item of existing.items) await tx.product.update({ where: { id: item.productId }, data: { stock: { increment: item.quantity } } });
      }
      return tx.order.update({ where: { id }, data: { status }, include: { user: true } });
    });
    const recipient = order.shippingEmail || order.user.email;
    const subject = status === "PAID" ? "Payment received for your PaulTech Store order" : status === "PROCESSING" ? "Your PaulTech Store order is being processed" : status === "SHIPPED" ? "Your PaulTech Store order has shipped" : `PaulTech Store order update: ${status}`;
    const message = status === "PAID" ? `We received your payment for order #${order.id.slice(-8)}. Your order is now being processed. Track it from your PaulTech Store account.` : status === "PROCESSING" ? `Your order #${order.id.slice(-8)} has been confirmed and is now being prepared for delivery. Track it from your PaulTech Store account.` : status === "SHIPPED" ? `Your order #${order.id.slice(-8)} has shipped and is on its way. Track the latest status from your PaulTech Store account.` : `Your order #${order.id.slice(-8)} is now ${status.toLowerCase()}. Track it from your PaulTech Store account.`;
    const notificationSent = await sendOrderEmail(recipient, subject, message);
    return NextResponse.json({ ok: true, notificationSent });
  } catch { return NextResponse.json({ error: "Order not found." }, { status: 404 }); }
}
